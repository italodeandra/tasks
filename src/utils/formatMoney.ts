import numeral from "./numeral";

export function formatMoney(value: string | number) {
  return numeral(value).format("$0,0");
}
