import { MenuProps } from "../Menu/Menu";
import { ReactNode } from "react";
export declare type ConfirmationButtonProps = {
    confirmation: string;
    label: ReactNode;
    onConfirm: () => void;
    loading?: boolean;
    className?: string;
    cancel?: string;
    position?: MenuProps["position"];
};
export default function ConfirmationButton({ label, confirmation, onConfirm, loading, className, cancel, position, }: ConfirmationButtonProps): JSX.Element;
