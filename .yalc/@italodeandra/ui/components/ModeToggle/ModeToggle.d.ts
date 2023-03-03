/// <reference types="react" />
export interface ModeToggleProps {
    ariaLabel?: string;
    className?: string;
    iconClassName?: string;
}
export declare function useModeToggle(): () => void;
declare const ModeToggle: import("react").ForwardRefExoticComponent<ModeToggleProps & import("react").RefAttributes<HTMLButtonElement>>;
export { ModeToggle };
