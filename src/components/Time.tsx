import { useInterval, useUpdate } from "react-use";
import formatTime from "@italodeandra/ui/utils/formatTime";
import { NextSeo } from "next-seo";

export function Time({
  value,
  plus = 0,
  from,
  autoUpdate,
  interval = 1000,
  short,
  className,
  showOnWindowTitle,
}: {
  value?: number;
  plus?: number;
  from?: Date | string;
  interval?: number;
  autoUpdate?: boolean;
  short?: boolean;
  className?: string;
  showOnWindowTitle?: boolean;
}) {
  const update = useUpdate();

  useInterval(update, autoUpdate ? interval : null);

  let time = formatTime(
    ((from ? Date.now() - new Date(from).getTime() : value) || 0) + plus,
  );

  if (short) {
    time = time.split(" ")[0];
  }

  return (
    <>
      {showOnWindowTitle && time && <NextSeo title={time} />}
      <span className={className}>{time || "0s"}</span>
    </>
  );
}
