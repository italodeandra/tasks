import { ReactNode } from "react";
import { UnstyledInputProps } from "../Input/UnstyledInput";
import Input from "../Input/Input";
export interface MultiSelectProps<T extends {
    _id: string;
} | string> extends Omit<UnstyledInputProps<false>, "as" | "onSelect" | "inputClassName" | "innerClassName" | "value" | "onChange"> {
    placeholder?: string;
    emptyText?: string;
    items?: T[];
    filterProperty?: keyof T;
    filterFunction?: (item: T) => boolean;
    onChange?: (items: T[]) => void;
    renderProperty?: keyof T;
    renderFunction?: (item: T) => ReactNode;
    query?: string;
    onChangeQuery?: (query: string) => void;
    loading?: boolean;
    leadingClassName?: string;
    inputInnerClassName?: string;
    inputElementClassName?: string;
    leading?: ReactNode;
    as?: typeof Input;
    static?: boolean;
    displayValue?: (item: T | null) => string;
    value?: T[];
    creatable?: boolean;
    getCreateLabel?: (query: string) => string;
}
export default function MultiSelect<T extends {
    _id: string;
} | string>({ placeholder, emptyText, items, renderProperty, renderFunction, filterProperty, filterFunction, onChange, query: defaultQuery, onChangeQuery, loading, inputInnerClassName, inputElementClassName, as, trailing, trailingClassName, trailingInputClassName, leadingInputClassName, static: isStatic, displayValue, value, labelClassName, creatable, getCreateLabel, ...props }: MultiSelectProps<T>): JSX.Element;
