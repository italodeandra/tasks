/// <reference types="react" />
import { Language } from "prism-react-renderer";
export declare type CodeProps = {
    children: string;
    language: Language;
    className?: string;
    copy?: boolean;
    copyText?: string;
    copiedText?: string;
};
export default function Code({ children, language, className, copy, copyText, copiedText, }: CodeProps): JSX.Element;
