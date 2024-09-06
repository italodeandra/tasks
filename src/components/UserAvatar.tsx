import clsx from "@italodeandra/ui/utils/clsx";
import { getColorForString } from "./ColorPicker/colors";
import getInitials from "@italodeandra/ui/utils/getInitials";

export function UserAvatar({
  _id,
  name,
  email,
  className,
}: {
  _id: string;
  name?: string;
  email: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[--bg] text-center text-xs uppercase",
        className,
      )}
      style={
        {
          "--bg": getColorForString(_id)["600"],
        } as Record<string, string>
      }
    >
      {getInitials(name || email)}
    </div>
  );
}
