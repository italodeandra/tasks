import { ReactNode } from "react";
import { UnstyledInputCommonProps } from "../Input";
export interface SwitchProps {
    srLabel?: string;
    checked?: boolean;
    className?: string;
    rightLabel?: ReactNode;
    switchClassName?: string;
    pointerClassName?: string;
    readOnly?: boolean;
    onChange?(checked: boolean): void;
}
export default function Switch({ srLabel, checked, onChange, className, rightLabel, readOnly, switchClassName, pointerClassName, }: SwitchProps): JSX.Element;
export declare type SwitchInputProps = UnstyledInputCommonProps & SwitchProps;
export declare function SwitchInput({ inputClassName, ...props }: SwitchInputProps): JSX.Element;
