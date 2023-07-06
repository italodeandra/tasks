/// <reference types="react" />
import { InputProps } from "../Input/Input";
import { FileSelectProps } from "../FileSelect/FileSelect";
export declare type ImageFile = {
    file: File;
    description?: string;
};
export declare type ImageUrl = {
    url: string;
    description?: string;
};
export declare type Image = ImageFile | ImageUrl;
declare const _default: import("react").ForwardRefExoticComponent<Pick<InputProps<false>, "className" | "error" | "id" | "onMouseOut" | "onMouseOver" | "label" | "name" | "helpText" | "required"> & Omit<FileSelectProps, "onAcceptFiles"> & {
    readOnly?: boolean | undefined;
    defaultValue?: Image[] | undefined;
    onChange?: ((event: {
        target: {
            value: Image[];
        };
    }) => void) | undefined;
    emptyText?: string | undefined;
} & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
