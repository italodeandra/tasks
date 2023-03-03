import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react";
export declare type CheckboxProps = {
    label?: ReactNode;
    description?: ReactNode;
    labelClassName?: string;
    descriptionClassName?: string;
    inputClassName?: string;
    labelOuterClassName?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
declare const _default: import("react").ForwardRefExoticComponent<Pick<CheckboxProps, "key" | "label" | "inputClassName" | "labelClassName" | keyof InputHTMLAttributes<HTMLInputElement> | "description" | "descriptionClassName" | "labelOuterClassName"> & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
