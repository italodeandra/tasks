import { ComponentProps, ReactElement, ReactNode } from "react";
import { DateRange, DayModifiers, Matcher, ModifiersClassNames } from "react-day-picker";
import Button from "../Button";
export type { DateRange };
export default function DatePicker({ value, onValueChange, children, buttonProps, fromDate, toDate, footer, monthFooter, modifiers, modifiersClassNames, disabled, defaultMonth, }: {
    value?: Date | string;
    onValueChange?: (value?: Date) => void;
    children?: (value: string) => ReactElement;
    buttonProps?: ComponentProps<typeof Button>;
    fromDate?: Date;
    toDate?: Date;
    footer?: ReactNode;
    monthFooter?: ReactNode;
    modifiers?: DayModifiers;
    modifiersClassNames?: ModifiersClassNames;
    disabled?: Matcher | Matcher[];
    defaultMonth?: Date;
}): JSX.Element;
