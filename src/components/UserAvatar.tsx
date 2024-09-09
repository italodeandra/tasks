import clsx from "@italodeandra/ui/utils/clsx";
import { getColorForString } from "./ColorPicker/colors";
import getInitials from "@italodeandra/ui/utils/getInitials";

export function UserAvatar({
  _id,
  name,
  email,
  className,
  profilePicture,
}: {
  _id: string;
  name?: string;
  email: string;
  className?: string;
  profilePicture?: string;
}) {
  return (
    <div
      className={clsx(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-center text-xs uppercase text-white",
        className,
      )}
      style={
        {
          background: profilePicture
            ? `center / cover url(${profilePicture})`
            : getColorForString(_id)["600"],
        } as Record<string, string>
      }
    >
      {!profilePicture && getInitials(name || email)}
    </div>
  );
}
