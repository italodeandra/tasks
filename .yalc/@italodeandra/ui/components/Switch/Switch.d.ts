import { ReactNode } from "react";
import { UnstyledInputCommonProps } from "../Input/UnstyledInput";
export interface SwitchProps {
    srLabel?: string;
    checked?: boolean;
    className?: string;
    rightLabel?: ReactNode;
    onChange?(checked: boolean): void;
}
export default function Switch({ srLabel, checked, onChange, className, rightLabel, }: SwitchProps): JSX.Element;
export declare type SwitchInputProps = UnstyledInputCommonProps & SwitchProps;
export declare function SwitchInput({ inputClassName, ...props }: SwitchInputProps): JSX.Element;
