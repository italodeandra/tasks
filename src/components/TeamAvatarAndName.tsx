import { TeamAvatar } from "./TeamAvatar";
import clsx from "@italodeandra/ui/utils/clsx";
import { UsersIcon } from "@heroicons/react/16/solid";

export function TeamAvatarAndName({
  _id,
  name,
  className,
}: {
  _id: string;
  name: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-1.5", className)}>
      <TeamAvatar _id={_id} name={name} />
      <span>{name}</span>
      <UsersIcon className="h-4 w-4" />
    </div>
  );
}
