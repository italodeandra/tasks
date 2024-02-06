import { taskGetApi } from "../../../../pages/api/task/get";
import Stack from "@italodeandra/ui/components/Stack";
import dayjs from "dayjs";
import { ProjectSelect } from "../ProjectSelect";
import { ColumnSelect } from "./StatusSelect";
import { LabeledValue } from "./LabeledValue";
import { Timer } from "../Timer";
import { Markdown } from "../Markdown";
import clsx from "@italodeandra/ui/utils/clsx";
import { useCallback } from "react";
import { taskUpdateApi } from "../../../../pages/api/task/update";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { Comments } from "./comments/Comments";

export function TaskDetails({ _id }: { _id: string }) {
  const { data } = taskGetApi.useQuery({
    _id,
  });

  const { mutate: update, isLoading: isUpdating } = taskUpdateApi.useMutation();

  const handleTitleSave = useCallback(
    (title: string) => {
      if (!isUpdating) {
        update({
          _id,
          title,
        });
      }
    },
    [_id, isUpdating, update]
  );

  const handleDescriptionSave = useCallback(
    (description: string) => {
      if (!isUpdating) {
        update({
          _id,
          description,
        });
      }
    },
    [_id, isUpdating, update]
  );

  return (
    <div className="-m-4 overflow-auto">
      <>
        <Stack className="p-4">
          {data ? (
            <Markdown
              value={data.title}
              className="text-lg font-medium"
              editable
              onChange={handleTitleSave}
              loading={isUpdating}
            />
          ) : (
            <Skeleton className="h-4" />
          )}
          {data ? (
            <Markdown
              value={data.description}
              className="text-sm"
              editable
              placeholder="Add a description"
              onChange={handleDescriptionSave}
            />
          ) : (
            <Skeleton className="h-4" />
          )}
        </Stack>
        <Stack
          className={clsx(
            "w-full gap-0 divide-y border-y",
            "divide-zinc-100 border-zinc-100",
            "dark:divide-zinc-800 dark:border-zinc-800"
          )}
        >
          <LabeledValue label="Timesheet">
            {data ? <Timer task={data} /> : <Skeleton className="h-4 w-20" />}
          </LabeledValue>
          <LabeledValue label="Status">
            {data ? (
              <ColumnSelect {...data} />
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
          </LabeledValue>
          <LabeledValue label="Project" className="group">
            {data ? (
              <ProjectSelect {...data} triggerClassName="text-md" />
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
          </LabeledValue>
          <LabeledValue
            label="Created at"
            title={data && dayjs(data.createdAt).format("LLLL")}
          >
            {data ? (
              dayjs(data.createdAt).fromNow()
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
          </LabeledValue>
          <LabeledValue
            label="Updated at"
            title={data && dayjs(data.updatedAt).format("LLLL")}
          >
            {data ? (
              dayjs(data.updatedAt).fromNow()
            ) : (
              <Skeleton className="h-4 w-20" />
            )}
          </LabeledValue>
        </Stack>
        {data && <Comments taskId={data._id} />}
      </>
    </div>
  );
}
