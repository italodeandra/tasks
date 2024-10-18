import { useCopyToClipboard } from "react-use";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import Button from "@italodeandra/ui/components/Button/Button";
import { CheckIcon } from "@heroicons/react/20/solid";
import { ClipboardIcon } from "@heroicons/react/24/outline";

export function CopyToClipboardButton({ content }: { content: string }) {
  const [state, copy] = useCopyToClipboard();

  return (
    <Tooltip content={state.value === content ? "Copied" : "Copy"}>
      <Button
        variant="text"
        className="-m-1.5 px-1.5 py-1"
        size="sm"
        trailing={state.value === content ? <CheckIcon /> : <ClipboardIcon />}
        onClick={() => copy(content)}
      >
        {content}
      </Button>
    </Tooltip>
  );
}