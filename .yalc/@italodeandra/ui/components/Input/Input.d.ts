/// <reference types="react" />
import { UnstyledInputProps } from "../Input/UnstyledInput";
export declare type InputProps<Select extends boolean | undefined> = {
    error?: boolean;
    loading?: boolean;
} & UnstyledInputProps<Select>;
export declare const defaultLabelClassName: string;
export declare const defaultInputClassName = "block w-full dark:bg-zinc-800 rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 sm:text-sm disabled:cursor-not-allowed disabled:border-gray-200 dark:disabled:border-zinc-800 disabled:bg-gray-50 dark:disabled:bg-zinc-900/90 disabled:text-gray-500";
export declare const defaultHelpTextClassName: string;
export declare const defaultTrailingClassName = "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 text-sm";
export declare const defaultLeadingClassName = "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500 text-sm";
export declare const defaultLeadingInputClassName = "pl-10";
export declare const defaultTrailingInputClassName = "pr-10";
declare const _default: import("react").ForwardRefExoticComponent<Pick<InputProps<boolean | undefined>, "error" | "select" | "key" | keyof import("../Input/UnstyledInput").UnstyledInputCommonProps | keyof import("react").InputHTMLAttributes<HTMLInputElement> | "loading"> & import("react").RefAttributes<HTMLInputElement | HTMLSelectElement>>;
export default _default;
