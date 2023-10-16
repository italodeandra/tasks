/// <reference types="react" />
declare const _default: import("react").ForwardRefExoticComponent<Pick<Pick<import("../Input").InputProps<false>, "className" | "label" | "id" | "onMouseOut" | "onMouseOver" | "name" | "required" | "error" | "helpText"> & Omit<import("../FileSelect").FileSelectProps, "onAcceptFiles"> & {
    readOnly?: boolean | undefined;
    defaultValue?: import("../FileInput").FileInputFile[] | undefined;
    onChange?: ((event: {
        target: {
            value: import("../FileInput").FileInputFile[];
        };
    }) => void) | undefined;
    emptyText?: string | undefined;
    downloadText?: string | undefined;
} & import("react").RefAttributes<HTMLInputElement>, "className" | "label" | "defaultValue" | "id" | "onChange" | "onMouseOut" | "onMouseOver" | "key" | "name" | "readOnly" | "required" | "icon" | "error" | "helpText" | "emptyText" | "maxFileSize" | "allowedFileTypes" | "limit" | "uploadAFileText" | "orDragAndDropText" | "upToText" | "anyFileText" | "dropFilesHereText" | "helperText" | "downloadText"> & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
