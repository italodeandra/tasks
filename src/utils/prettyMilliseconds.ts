export function prettyMilliseconds(milliseconds: number) {
  let ch = 60 * 60 * 1000;
  let h = Math.floor(milliseconds / ch);
  let m = Math.round((milliseconds - h * ch) / 60000);
  if (m === 60) {
    h++;
    m = 0;
  }
  return `${h ? `${h}h` : ""}${m ? ` ${m}m` : ""}`;
}
