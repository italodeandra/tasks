/// <reference types="react" />
import { UnstyledInputProps } from "../Input/UnstyledInput";
export type InputProps<Select extends boolean | undefined> = {
    error?: boolean;
    loading?: boolean;
} & UnstyledInputProps<Select>;
export declare const defaultLabelClassName: string;
export declare const defaultInputClassNameUncolored = "block w-full rounded-md shadow-sm sm:text-sm disabled:cursor-not-allowed dark:bg-zinc-800";
export declare const defaultInputClassName = "ui-input-input block w-full rounded-md shadow-sm sm:text-sm disabled:cursor-not-allowed dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 disabled:border-zinc-200 dark:disabled:border-zinc-800 disabled:bg-zinc-50 dark:disabled:bg-zinc-900/90 disabled:text-zinc-500";
export declare const defaultHelpTextClassName: string;
export declare const defaultTrailingClassName = "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 text-sm";
export declare const defaultLeadingClassName = "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 text-sm";
export declare const defaultLeadingInputClassName = "pl-10";
export declare const defaultTrailingInputClassName = "pr-10";
declare const _default: import("react").ForwardRefExoticComponent<Pick<InputProps<boolean | undefined>, "select" | "key" | keyof import("react").InputHTMLAttributes<HTMLInputElement> | keyof import("../Input/UnstyledInput").UnstyledInputCommonProps | "loading"> & import("react").RefAttributes<HTMLInputElement | HTMLSelectElement>>;
export default _default;
