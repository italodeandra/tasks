import { useInterval, useUpdate } from "react-use";
import formatTime from "@italodeandra/ui/utils/formatTime";

export function Time({
  value,
  from,
  autoUpdate,
  interval = 1000,
  short,
  className,
}: {
  value?: number;
  from?: Date | string;
  interval?: number;
  autoUpdate?: boolean;
  short?: boolean;
  className?: string;
}) {
  const update = useUpdate();

  useInterval(update, autoUpdate ? interval : null);

  let time = formatTime(
    (from ? Date.now() - new Date(from).getTime() : value) || 0,
  );

  if (short) {
    time = time.split(" ")[0];
  }

  return <span className={className}>{time || "0s"}</span>;
}
