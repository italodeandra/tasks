import Button from "@italodeandra/ui/components/Button";
import { ArrowLeftIcon, TableCellsIcon } from "@heroicons/react/16/solid";
import { useCallback } from "react";
import { homeState } from "../../home/home.state";
import { useSnapshot } from "valtio";

export function TimesheetButton() {
  const { showTimesheet } = useSnapshot(homeState);

  const handleClick = useCallback(() => {
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
