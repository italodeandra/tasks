import { MenuProps } from "../Menu/Menu";
import { ReactNode } from "react";
import { ButtonProps } from "../Button/Button";
export declare type ConfirmationButtonProps = {
    confirmation: string;
    label: ReactNode;
    onConfirm: () => void;
    loading?: boolean;
    className?: string;
    cancel?: string;
    position?: MenuProps["position"];
    buttonClassName?: string;
    buttonProps?: ButtonProps<undefined>;
};
export default function ConfirmationButton({ label, confirmation, onConfirm, loading, className, cancel, position, buttonClassName, buttonProps, }: ConfirmationButtonProps): JSX.Element;
