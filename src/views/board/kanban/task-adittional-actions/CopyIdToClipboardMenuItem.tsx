import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { useCopyToClipboard } from "react-use";

export function CopyIdToClipboardMenuItem({ taskId }: { taskId: string }) {
  const [, copy] = useCopyToClipboard();

  return (
    <ContextMenu.Item onClick={() => copy(taskId)}>Copy ID</ContextMenu.Item>
  );
}
