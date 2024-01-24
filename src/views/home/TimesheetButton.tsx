import Button from "@italodeandra/ui/components/Button";
import { ArrowLeftIcon, TableCellsIcon } from "@heroicons/react/16/solid";
import { useCallback } from "react";
import { homeState } from "./home.state";
import { useSnapshot } from "valtio";

export function TimesheetButton() {
  let { showTimesheet } = useSnapshot(homeState);

  let handleClick = useCallback(() => {
    homeState.setShowTimesheet(!homeState.showTimesheet);
  }, []);

  return (
    <Button
      size="xs"
      leading={
        showTimesheet ? (
          <ArrowLeftIcon className="w-4 h-4" />
        ) : (
          <TableCellsIcon className="w-4 h-4" />
        )
      }
      onClick={handleClick}
    >
      {showTimesheet ? "Go back" : "Timesheet"}
    </Button>
  );
}
