import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react";
export type CheckboxProps = {
    label?: ReactNode;
    description?: ReactNode;
    labelClassName?: string;
    descriptionClassName?: string;
    inputClassName?: string;
    labelOuterClassName?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
declare const _default: import("react").ForwardRefExoticComponent<Pick<CheckboxProps, "description" | "label" | "key" | "labelClassName" | "descriptionClassName" | "inputClassName" | "labelOuterClassName" | keyof InputHTMLAttributes<HTMLInputElement>> & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
