/// <reference types="react" />
export type CopyButtonProps = {
    text: string;
    copyText?: string;
    copiedText?: string;
};
export default function CopyButton({ text, copyText, copiedText, }: CopyButtonProps): JSX.Element;
