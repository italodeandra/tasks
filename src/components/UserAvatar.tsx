import clsx from "@italodeandra/ui/utils/clsx";
import { getColorForString } from "./ColorPicker/colors";
import getInitials from "@italodeandra/ui/utils/getInitials";

export function UserAvatar({
  _id,
  name,
  email,
  isMe,
}: {
  _id: string;
  name?: string;
  email: string;
  isMe?: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex h-6 w-6 items-center justify-center rounded-full text-center text-xs",
        {
          "bg-blue-600": isMe,
        },
      )}
      style={{
        backgroundColor: !isMe ? getColorForString(_id) : undefined,
      }}
    >
      {getInitials(name || email)}
    </div>
  );
}
