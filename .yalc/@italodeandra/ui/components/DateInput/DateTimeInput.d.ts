/// <reference types="react" />
import { InputProps } from "../Input/Input";
export declare function parseDate(value: string): string;
export declare function formatDate(value: string): string;
declare const _default: import("react").ForwardRefExoticComponent<Pick<InputProps<false>, "error" | "select" | "key" | keyof import("../Input/UnstyledInput").UnstyledInputCommonProps | keyof import("react").InputHTMLAttributes<HTMLInputElement> | "loading"> & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
