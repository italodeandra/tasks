/// <reference types="react" />
export default function Slider({ step, max, min, className, value, onValueChange, thumbClassName, }: {
    step?: number;
    max?: number;
    className?: string;
    thumbClassName?: string;
    min?: number;
    value?: number[];
    onValueChange?: (value: number[]) => void;
}): JSX.Element;
