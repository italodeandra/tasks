/// <reference types="react" />
export type LoadingProps = {
    className?: string;
    dotClassName?: string;
    debounce?: boolean | string;
};
export default function Loading({ className, dotClassName, debounce, }: LoadingProps): JSX.Element;
