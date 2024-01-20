import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTaskList } from "../../pages/api/task/list";

export function HomeView() {
  let { data: databaseTasks, isLoading } = useTaskList();
  let [inMemoryTasks, setInMemoryTasks] = useState<
    (
      | {
          _id: string;
          titleHtml: string;
          description?: string;
          type: "TASK";
        }
      | {
          _id: "DOING";
          title: "Doing";
          type: "STATUS";
        }
    )[]
  >([]);

  useEffect(() => {
    if (databaseTasks) {
      setInMemoryTasks(databaseTasks);
    }
  }, [databaseTasks]);

  return (
    <div className="p-2 pt-px">
      <div
        className={clsx(
          "rounded border",

          "[&_th]:text-left [&_th]:text-sm [&_th]:font-medium",
          "[&_tbody_tr:last-of-type]:border-b-0 [&_tr:last-of-type_td]:rounded-b [&_tr>*]:px-3 [&_tr>*]:py-2 [&_tr]:border-b",

          "border-zinc-300 bg-zinc-50",
          "dark:border-zinc-800 dark:bg-zinc-900",

          "[&_tbody_tr]:border-zinc-200 [&_td:hover]:bg-zinc-200 [&_td]:bg-zinc-50 [&_thead_tr]:border-zinc-300",
          "dark:[&_tbody_tr]:border-zinc-800/50 dark:[&_td:hover]:bg-zinc-800/50 dark:[&_td]:bg-zinc-900 dark:[&_thead_tr]:border-zinc-800"
        )}
      >
        <table className="w-full">
          <thead>
            <tr>
              <th>Task</th>
            </tr>
          </thead>
          <Reorder.Group
            as="tbody"
            axis="y"
            values={inMemoryTasks}
            onReorder={setInMemoryTasks}
            className="select-none"
          >
            {inMemoryTasks.map((item, index) => {
              return (
                <Reorder.Item
                  key={item._id}
                  value={item}
                  as="tr"
                  className="relative cursor-grab"
                  dragListener={item.type === "TASK"}
                  whileDrag={{
                    cursor: "grabbing",
                    zIndex: 20,
                  }}
                >
                  <td
                    dangerouslySetInnerHTML={{
                      __html:
                        item.type === "TASK" ? item.titleHtml : item.title,
                    }}
                  />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
          <Reorder.Group
            as="tbody"
            axis="y"
            values={inMemoryTasks}
            onReorder={setInMemoryTasks}
            className="select-none"
          >
            {inMemoryTasks.map((item, index) => {
              return (
                <Reorder.Item
                  key={item._id}
                  value={item}
                  as="tr"
                  className="relative cursor-grab"
                  dragListener={item.type === "TASK"}
                  whileDrag={{
                    cursor: "grabbing",
                    zIndex: 20,
                  }}
                >
                  <td
                    dangerouslySetInnerHTML={{
                      __html:
                        item.type === "TASK" ? item.titleHtml : item.title,
                    }}
                  />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </table>
      </div>
    </div>
  );
}
