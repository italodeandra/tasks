import { ComponentPropsWithRef, ForwardedRef } from "react";
import { InputProps } from "../Input";
import { FileSelectProps } from "../FileSelect";
export type FileFile = {
    _id: string;
    file: File;
    description?: string;
    name: string;
    type: string;
    size: number;
};
export type FileUrl = {
    _id: string;
    url: string;
    description?: string;
    name: string;
    type: string;
    size: number;
};
export type FileInputFile = FileFile | FileUrl;
declare function FileInput({ error, className, helpText, onChange, name, limit, label, id, required, onMouseOver, onMouseOut, readOnly, defaultValue, emptyText, downloadText, openText, preview, asyncUpload, onRejectFiles, ...props }: Pick<InputProps<false>, "error" | "className" | "helpText" | "name" | "label" | "id" | "required" | "onMouseOver" | "onMouseOut"> & Omit<FileSelectProps, "onAcceptFiles" | "onRejectFiles"> & {
    readOnly?: boolean;
    defaultValue?: FileInputFile[];
    onChange?: (event: {
        target: {
            value: FileInputFile[];
        };
    }) => void;
    emptyText?: string;
    downloadText?: string;
    openText?: string;
    preview?: boolean;
    asyncUpload?: (file: FileFile & {
        _id: string;
    }) => Promise<FileUrl & {
        _id: string;
    }>;
    onRejectFiles?: (files: File[], reason: "type" | "size" | "limit" | "upload-error") => void;
}, ref: ForwardedRef<HTMLInputElement>): JSX.Element;
export type FileInputProps = ComponentPropsWithRef<typeof FileInput>;
declare const _default: import("react").ForwardRefExoticComponent<Pick<InputProps<false>, "className" | "label" | "id" | "onMouseOut" | "onMouseOver" | "name" | "required" | "error" | "helpText"> & Omit<FileSelectProps, "onAcceptFiles" | "onRejectFiles"> & {
    readOnly?: boolean | undefined;
    defaultValue?: FileInputFile[] | undefined;
    onChange?: ((event: {
        target: {
            value: FileInputFile[];
        };
    }) => void) | undefined;
    emptyText?: string | undefined;
    downloadText?: string | undefined;
    openText?: string | undefined;
    preview?: boolean | undefined;
    asyncUpload?: ((file: FileFile & {
        _id: string;
    }) => Promise<FileUrl & {
        _id: string;
    }>) | undefined;
    onRejectFiles?: ((files: File[], reason: "size" | "type" | "limit" | "upload-error") => void) | undefined;
} & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
