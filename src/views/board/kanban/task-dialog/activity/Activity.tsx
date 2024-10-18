import { taskActivityListApi } from "../../../../../pages/api/task-activity/list";
import { useState } from "react";
import { taskActivityCommentAddApi } from "../../../../../pages/api/task-activity/comment/add";
import Textarea from "@italodeandra/ui/components/Textarea";
import Button from "@italodeandra/ui/components/Button";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import clsx from "@italodeandra/ui/utils/clsx";
import { UserAvatar } from "../../../../../components/UserAvatar";
import { ActivityType } from "../../../../../collections/taskActivity";
import { ChatBubbleLeftIcon } from "@heroicons/react/16/solid";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import dayjs from "dayjs";
import { Comment } from "./Comment";
import { Timesheet } from "./Timesheet";

export function Activity({
  taskId,
  canComment,
}: {
  taskId: string;
  canComment?: boolean;
}) {
  const taskActivityList = taskActivityListApi.useQuery({ taskId });

  const [comment, setComment] = useState("");
  const taskActivityComment = taskActivityCommentAddApi.useMutation({
    onSuccess: () => {
      setComment("");
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm font-medium">Activity</div>
      <div className="flex flex-col gap-4">
        {canComment && (
          <Textarea
            placeholder="Add new comment"
            trailing={
              <Button
                icon
                className="pointer-events-auto"
                size="sm"
                variant="text"
                onClick={() => {
                  taskActivityComment.mutate({
                    taskId,
                    content: comment,
                  });
                }}
                loading={taskActivityComment.isPending}
              >
                <PaperAirplaneIcon />
              </Button>
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            inputClassName="dark:border-transparent"
            trailingClassName="pr-0.5 items-end pb-0.5"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                taskActivityComment.mutate({
                  taskId,
                  content: e.currentTarget.value,
                });
              }
            }}
          />
        )}
        {taskActivityList.isLoading && (
          <Skeleton className="h-5 w-full max-w-60" />
        )}
        {taskActivityList.data?.map((activity, index, activities) => (
          <div
            key={activity._id}
            className={clsx("flex gap-1.5", {
              "-mt-3": activities[index - 1]?.user._id === activity.user._id,
            })}
          >
            <UserAvatar
              {...activity.user}
              className={clsx({
                "opacity-0":
                  activities[index - 1]?.user._id === activity.user._id,
              })}
            />
            <div className="flex flex-1 flex-col pt-0.5">
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-2">
                <div className="text-zinc-300">
                  <span
                    className={clsx("font-medium text-white", {
                      hidden:
                        activities[index - 1]?.user._id === activity.user._id,
                    })}
                  >
                    {activity.user.name || activity.user.email}
                  </span>{" "}
                  {activity.type === ActivityType.CREATE && (
                    <>created the task</>
                  )}
                  {activity.type === ActivityType.UPDATE && (
                    <>updated the task {activity.data.field}</>
                  )}
                  {activity.type === ActivityType.CHANGE_TITLE && (
                    <>
                      changed title to{" "}
                      <span className="font-medium text-white">
                        {activity.data.title}
                      </span>
                    </>
                  )}
                  {activity.type === ActivityType.MOVE && activity.data && (
                    <>
                      moved task to {activity.data.type}{" "}
                      <span className="font-medium text-white">
                        {activity.data.title}
                      </span>
                    </>
                  )}
                  {activity.type === ActivityType.SET && activity.data && (
                    <>
                      set the task {activity.data.type} to{" "}
                      <span className="font-medium text-white">
                        {activity.data.title}
                      </span>
                    </>
                  )}
                  {activity.type === ActivityType.ASSIGN && activity.data && (
                    <>
                      {activity.data.type === "add"
                        ? "assigned task to"
                        : "unassigned task from"}{" "}
                      <span className="font-medium text-white">
                        {activity.data.users.join(", ")}
                      </span>
                    </>
                  )}
                  {activity.type === ActivityType.DEPENDENCY &&
                    activity.data && (
                      <>
                        {activity.data.type === "add"
                          ? "added dependency to"
                          : "removed dependency from"}{" "}
                        <span className="font-medium text-white">
                          {activity.data.dependencies.join(", ")}
                        </span>
                      </>
                    )}
                  {activity.type === ActivityType.TIMESHEET &&
                    activity.data && <Timesheet {...activity} />}
                  {activity.type === ActivityType.COMMENT && activity.data && (
                    <>
                      <ChatBubbleLeftIcon className="-ml-0.5 -mt-1 inline h-4 w-4" />
                    </>
                  )}
                </div>
                <Tooltip content={dayjs(activity.createdAt).format("LLL")}>
                  <div className="mb-px text-xs text-zinc-500">
                    {dayjs(activity.createdAt).fromNow()}
                  </div>
                </Tooltip>
              </div>
              {activity.type === ActivityType.COMMENT && activity.data && (
                <Comment
                  content={activity.data.content}
                  activityId={activity._id}
                  canEdit={activity.user.isMe}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
