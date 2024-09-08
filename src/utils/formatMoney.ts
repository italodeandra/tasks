import numeral from "./numeral";
import { isNil } from "lodash-es";

export function formatMoney<T extends string | number | null | undefined>(
  value: T,
  cents?: boolean,
) {
  return value !== "" && !isNil(value)
    ? numeral(value).format(cents ? "$0,0.00" : "$0,0")
    : value;
}
