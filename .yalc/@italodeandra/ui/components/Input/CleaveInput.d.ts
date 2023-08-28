/// <reference types="react" />
import { InputProps } from "./Input";
import { CleaveOptions } from "cleave.js/options";
export declare type CleaveInputProps = {
    options: CleaveOptions;
} & InputProps<undefined>;
declare const _default: import("react").ForwardRefExoticComponent<Pick<CleaveInputProps, "select" | "key" | keyof import("react").InputHTMLAttributes<HTMLInputElement> | "error" | keyof import("./UnstyledInput").UnstyledInputCommonProps | "loading" | "options"> & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
