export function prettyMilliseconds(milliseconds: number) {
  const ch = 60 * 60 * 1000;
  const cm = 60 * 1000;
  let h = Math.floor(milliseconds / ch);
  let m = Math.floor((milliseconds - h * ch) / cm);
  let s = Math.round((milliseconds - h * ch - m * cm) / 1000);

  if (s === 60) {
    m++;
    s = 0;
  }

  if (m === 60) {
    h++;
    m = 0;
  }

  const hoursStr = h > 0 ? `${h}h` : "";
  const minutesStr = m > 0 ? `${m}m` : "";
  const secondsStr = h === 0 && m === 0 && s > 0 ? `${s}s` : "";

  return `${hoursStr} ${minutesStr}${secondsStr}`.trim() || "0s";
}
