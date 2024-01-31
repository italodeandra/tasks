import { ReactNode } from "react";
import Group from "@italodeandra/ui/components/Group";
import clsx from "@italodeandra/ui/utils/clsx";

export function LabeledValue({
  label,
  children,
  title,
  className,
}: {
  label: string;
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <Group className={clsx("gap-0", className)}>
      <div className="bg-zinc-100 dark:bg-zinc-800/50 w-32 px-4 py-1.5 font-medium">
        {label}
      </div>
      <div
        className="bg-zinc-50 dark:bg-zinc-900 grow px-2.5 items-center flex"
        title={title}
      >
        {children}
      </div>
    </Group>
  );
}
