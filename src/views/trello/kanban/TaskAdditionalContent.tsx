import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button/Button";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import { PlayIcon } from "@heroicons/react/16/solid";

export function TaskAdditionalContent({ cardId }: { cardId: string }) {
  return (
    <div className="flex justify-end gap-2 px-3 pb-3">
      <Tooltip content="Start tracking time on this task">
        <Button
          variant="filled"
          rounded
          className="group/myself pointer-events-auto relative h-6 w-6 p-0 text-xs dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
          onClick={stopPropagation}
          onTouchStart={stopPropagation}
          onMouseDown={stopPropagation}
        >
          <span className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-hover/myself:opacity-0">
            IA
          </span>
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/myself:opacity-100">
            <PlayIcon className="-mr-0.5 h-4 w-4" />
          </span>
        </Button>
      </Tooltip>
    </div>
  );
}
