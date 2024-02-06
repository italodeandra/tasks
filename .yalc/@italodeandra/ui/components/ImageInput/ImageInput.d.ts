/// <reference types="react" />
declare const _default: import("react").ForwardRefExoticComponent<Pick<Pick<import("../Input").InputProps<false>, "className" | "label" | "id" | "onMouseOut" | "onMouseOver" | "name" | "required" | "error" | "helpText"> & Omit<import("../FileSelect").FileSelectProps, "onAcceptFiles" | "onRejectFiles"> & {
    readOnly?: boolean | undefined;
    value?: import("../FileInput").FileInputFile[] | undefined;
    onChange?: ((event: {
        target: {
            value: import("../FileInput").FileInputFile[];
        };
    }) => void) | undefined;
    emptyText?: string | undefined;
    downloadText?: string | undefined;
    openText?: string | undefined;
    preview?: boolean | undefined;
    asyncUpload?: ((file: import("../FileInput").FileFile & {
        _id: string;
    }) => Promise<import("../FileInput").FileUrl & {
        _id: string;
    }>) | undefined;
    onRejectFiles?: ((files: File[], reason: "size" | "type" | "limit" | "upload-error") => void) | undefined;
} & import("react").RefAttributes<HTMLInputElement>, "className" | "label" | "id" | "onChange" | "onMouseOut" | "onMouseOver" | "key" | "disabled" | "name" | "readOnly" | "required" | "value" | "error" | "icon" | "helpText" | "emptyText" | "maxFileSize" | "allowedFileTypes" | "limit" | "uploadAFileText" | "orDragAndDropText" | "upToText" | "anyFileText" | "dropFilesHereText" | "uploadingText" | "uploading" | "additionalBottomInfo" | "onRejectFiles" | "helperText" | "downloadText" | "openText" | "preview" | "asyncUpload"> & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
