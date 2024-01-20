import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react";
import { Combobox } from "@headlessui/react";
export type UnstyledInputCommonProps = {
    label?: ReactNode;
    inputClassName?: string;
    labelClassName?: string;
    helpTextClassName?: string;
    trailingClassName?: string;
    trailingInputClassName?: string;
    leadingClassName?: string;
    leadingInputClassName?: string;
    helpText?: ReactNode;
    trailing?: ReactNode;
    leading?: ReactNode;
    as?: typeof Combobox.Input;
    innerClassName?: string;
    error?: boolean;
};
export type UnstyledInputProps<Select extends boolean | undefined> = UnstyledInputCommonProps & {
    select?: Select;
} & (Select extends string ? DetailedHTMLProps<InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> : DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>);
declare const _default: import("react").ForwardRefExoticComponent<Pick<UnstyledInputProps<boolean | undefined>, "select" | "key" | keyof InputHTMLAttributes<HTMLInputElement> | keyof UnstyledInputCommonProps> & import("react").RefAttributes<HTMLInputElement | HTMLSelectElement>>;
export default _default;
