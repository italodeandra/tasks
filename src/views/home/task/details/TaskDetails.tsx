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

export function TaskDetails({ _id }: { _id: string }) {
  const { data, isLoading } = taskGetApi.useQuery({
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
    <div className="-m-4">
      {data && (
        <>
          <Stack className="m-4">
            <Markdown
              value={data.title}
              className="text-lg font-medium"
              editable
              onChange={handleTitleSave}
              loading={isUpdating}
            />
            <Markdown
              value={data.description}
              editable
              placeholder="Add a description"
              onChange={handleDescriptionSave}
            />
          </Stack>
          {/*<div
            dangerouslySetInnerHTML={{ __html: data.title }}
            contentEditable
          />
          <div
            className={clsx("prose prose-zinc dark:prose-invert outline-0", {
              "opacity-50": !data.description,
            })}
            dangerouslySetInnerHTML={{
              __html: data.description || "Add a description",
            }}
            contentEditable
            onFocus={(e) => {
              if (!data.description) {
                e.currentTarget.innerText = "";
                // const target = e.currentTarget;
                // setTimeout(() => target.focus(), 100);
              }
            }}
            onBlur={(e) => {
              if (!data.description) {
                e.currentTarget.innerText = "Add a description";
              }
            }}
          />*/}
          <Stack
            className={clsx(
              "w-full gap-0 divide-y border-t",
              "divide-zinc-100 border-zinc-100",
              "dark:divide-zinc-800 dark:border-zinc-800"
            )}
          >
            <LabeledValue
              label="Timesheet"
              title={dayjs(data.updatedAt).format("LLLL")}
            >
              <Timer task={data} />
            </LabeledValue>
            <LabeledValue label="Status">
              <ColumnSelect {...data} />
            </LabeledValue>
            <LabeledValue label="Project" className="group">
              <ProjectSelect {...data} triggerClassName="text-md" />
            </LabeledValue>
            <LabeledValue
              label="Created at"
              title={dayjs(data.createdAt).format("LLLL")}
            >
              {dayjs(data.createdAt).fromNow()}
            </LabeledValue>
            <LabeledValue
              label="Updated at"
              title={dayjs(data.updatedAt).format("LLLL")}
            >
              {dayjs(data.updatedAt).fromNow()}
            </LabeledValue>
          </Stack>
        </>
      )}
    </div>
  );
}
