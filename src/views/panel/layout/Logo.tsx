import clsx from "@italodeandra/ui/utils/clsx";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={clsx("text-4xl leading-none text-zinc-100", className)}>
      マ
    </div>
  );
}
