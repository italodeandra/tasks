/// <reference types="react" />
import { InputProps } from "../Input";
export declare function parseDate(value: string): string;
export declare function formatDate(value: string): string;
declare const _default: import("react").ForwardRefExoticComponent<Pick<InputProps<false>, "select" | "key" | keyof import("react").InputHTMLAttributes<HTMLInputElement> | keyof import("../Input").UnstyledInputCommonProps | "loading"> & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
