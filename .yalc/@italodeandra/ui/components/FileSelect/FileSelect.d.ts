import { ReactNode } from "react";
export interface FileSelectProps {
    uploadAFileText?: string;
    orDragAndDropText?: string;
    upToText?: string;
    anyFileText?: string;
    dropFilesHereText?: string;
    maxFileSize?: number | string;
    allowedFileTypes?: string[];
    id?: string;
    limit?: number;
    onAcceptFiles: (files: File[]) => void;
    helperText?: string;
    className?: string;
    error?: boolean;
}
declare const _default: import("react").ForwardRefExoticComponent<FileSelectProps & import("react").RefAttributes<HTMLInputElement>>;
export default _default;
export declare function FileSelectProvider({ children }: {
    children: ReactNode;
}): JSX.Element;
