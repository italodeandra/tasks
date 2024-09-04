import { getColorForString } from "./ColorPicker/colors";
import getInitials from "@italodeandra/ui/utils/getInitials";

export function TeamAvatar({ _id, name }: { _id: string; name: string }) {
  return (
    <div
      className="flex h-6 w-6 items-center justify-center rounded-full bg-[--bg] text-center text-xs uppercase"
      style={
        {
          "--bg": getColorForString(_id)["600"],
        } as Record<string, string>
      }
    >
      {getInitials(name)}
    </div>
  );
}
