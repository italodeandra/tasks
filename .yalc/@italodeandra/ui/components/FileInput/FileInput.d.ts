/// <reference types="react" />
import { InputProps } from "../Input";
import { FileSelectProps } from "../FileSelect";
export declare type FileFile = {
    file: File;
    description?: string;
    name: string;
    type: string;
};
export declare type FileUrl = {
    url: string;
    description?: string;
    name: string;
    type: string;
};
export declare type FileInputFile = FileFile | FileUrl;
declare const _default: import("react").ForwardRefExoticComponent<Pick<InputProps<false>, "className" | "label" | "id" | "onMouseOut" | "onMouseOver" | "name" | "required" | "error" | "helpText"> & Omit<FileSelectProps, "onAcceptFiles"> & {
    readOnly?: boolean | undefined;
    defaultValue?: FileInputFile[] | undefined;
    onChange?: ((event: {
        target: {
            value: FileInputFile[];
        };
    }) => void) | undefined;
    emptyText?: string | undefined;
    downloadText?: string | undefined;
} & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
