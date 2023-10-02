/// <reference types="react" />
import { InputProps } from "../Input";
import { TextareaAutosizeProps } from "react-textarea-autosize/dist/declarations/src";
export declare type TextareaProps = InputProps<false> & Partial<Pick<TextareaAutosizeProps, "maxRows" | "minRows" | "onHeightChange" | "cacheMeasurements">>;
declare const _default: import("react").ForwardRefExoticComponent<Pick<TextareaProps, "select" | "key" | keyof import("react").InputHTMLAttributes<HTMLInputElement> | "error" | keyof import("../Input").UnstyledInputCommonProps | "loading" | "maxRows" | "minRows" | "onHeightChange" | "cacheMeasurements"> & import("react").RefAttributes<HTMLTextAreaElement>>;
export default _default;
