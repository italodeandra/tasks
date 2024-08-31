import { UserAvatar } from "./UserAvatar";

export function UserAvatarAndName({
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
    <div className="flex items-center gap-1.5">
      <UserAvatar _id={_id} email={email} name={name} isMe={isMe} />
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
