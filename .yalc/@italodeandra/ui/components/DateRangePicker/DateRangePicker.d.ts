import { ComponentProps, ReactElement } from "react";
import { DateRange } from "react-day-picker";
import Button from "../Button";
export type { DateRange };
export default function DateRangePicker({ value, onChangeValue, children, buttonProps, fromDate, toDate, min, max, }: {
    value?: DateRange;
    onChangeValue?: (value?: DateRange) => void;
    children?: (value: string) => ReactElement;
    buttonProps?: ComponentProps<typeof Button>;
    fromDate?: Date;
    toDate?: Date;
    min?: number;
    max?: number;
}): JSX.Element;
