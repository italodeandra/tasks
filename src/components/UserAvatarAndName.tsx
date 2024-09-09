import { UserAvatar } from "./UserAvatar";
import clsx from "@italodeandra/ui/utils/clsx";

export function UserAvatarAndName({
  _id,
  name,
  email,
  isMe,
  className,
  avatarClassName,
  nameClassName,
  profilePicture,
}: {
  _id: string;
  name?: string;
  email: string;
  isMe?: boolean;
  className?: string;
  avatarClassName?: string;
  nameClassName?: string;
  profilePicture?: string;
}) {
  return (
    <div className={clsx("flex gap-1.5", className)}>
      <UserAvatar
        _id={_id}
        email={email}
        name={name}
        className={avatarClassName}
        profilePicture={profilePicture}
      />
      <span className={clsx("mt-px", nameClassName)}>
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
