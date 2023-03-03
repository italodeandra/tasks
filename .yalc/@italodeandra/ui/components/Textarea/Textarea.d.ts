/// <reference types="react" />
import { InputProps } from "../Input/Input";
import { TextareaAutosizeProps } from "react-textarea-autosize/dist/declarations/src";
export declare type TextareaProps = InputProps<false> & Partial<Pick<TextareaAutosizeProps, "maxRows" | "minRows" | "onHeightChange" | "cacheMeasurements">>;
declare const _default: import("react").ForwardRefExoticComponent<Pick<TextareaProps, "error" | "select" | "key" | keyof import("../Input/UnstyledInput").UnstyledInputCommonProps | keyof import("react").InputHTMLAttributes<HTMLInputElement> | "loading" | "maxRows" | "minRows" | "onHeightChange" | "cacheMeasurements"> & import("react").RefAttributes<HTMLTextAreaElement>>;
export default _default;
