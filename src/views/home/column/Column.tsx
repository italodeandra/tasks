import Group from "@italodeandra/ui/components/Group";
import { translateTaskStatus } from "../../../utils/translateTaskStatus";
import { AddTaskButton } from "./AddTaskButton";
import Button from "@italodeandra/ui/components/Button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import React from "react";
import { useSnapshot } from "valtio";
import { homeState } from "../home.state";

function Column({ column, taskCount }: { column: string; taskCount: number }) {
  const { hiddenColumns, setHiddenColumns } = useSnapshot(homeState);
  const isHidden = hiddenColumns.includes(column);

  return (
    <Group className="w-full items-center">
      {translateTaskStatus(column)}
      <span className="text-zinc-500 font-light">{taskCount}</span>
      {!isHidden && (
        <>
          <div className="grow" />
          <AddTaskButton column={column} />
        </>
      )}
      <Tooltip content="Toggle column visibility">
        <Button icon size="xs" variant="text">
          {isHidden ? (
            <EyeIcon
              onClick={() =>
                setHiddenColumns([...hiddenColumns.filter((c) => c !== column)])
              }
            />
          ) : (
            <EyeSlashIcon
              className="opacity-50"
              onClick={() => setHiddenColumns([...hiddenColumns, column])}
            />
          )}
        </Button>
      </Tooltip>
    </Group>
  );
}

export function renderColumn(column: string, taskCount: number) {
  return <Column column={column} taskCount={taskCount} />;
}
