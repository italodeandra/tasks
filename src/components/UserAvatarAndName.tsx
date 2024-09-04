import { UserAvatar } from "./UserAvatar";
import clsx from "@italodeandra/ui/utils/clsx";

export function UserAvatarAndName({
  _id,
  name,
  email,
  isMe,
  className,
}: {
  _id: string;
  name?: string;
  email: string;
  isMe?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-1.5", className)}>
      <UserAvatar _id={_id} email={email} name={name} />
      <span>
        {name || email}
        {isMe ? (
          <>
            {" "}
            <span className="opacity-50">(you)</span>
          </>
        ) : null}
      </span>
    </div>
  );
}
