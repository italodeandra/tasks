import { ComponentPropsWithoutRef, ReactElement, ReactNode, Ref } from "react";
import Button from "../Button/Button";
import { UnstyledButtonProps } from "../Button/UnstyledButton";
import { TextProps } from "../Text/Text";
export declare const defaultMenuItemsClassName = "z-10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800";
export type MenuProps = {
    className?: string;
    position?: "left" | "right" | "bottom-right" | "bottom-left";
    iconClassName?: string;
    menuItemsClassName?: string;
    buttonProps?: ComponentPropsWithoutRef<typeof Button>;
    label?: ReactNode;
    children?: ReactNode;
    button?: ReactNode;
    unmount?: boolean;
    ref?: Ref<HTMLDivElement>;
};
export type MenuItemProps<T extends HTMLElement = HTMLButtonElement> = UnstyledButtonProps<T> & {
    icon?: ReactElement;
};
export type MenuLabelProps<Inline extends boolean | undefined, Href extends string | undefined> = TextProps<Inline, Href>;
declare const _default: import("react").ForwardRefExoticComponent<Pick<MenuProps, "className" | "label" | "children" | "button" | "position" | "unmount" | "iconClassName" | "buttonProps" | "menuItemsClassName"> & import("react").RefAttributes<HTMLDivElement>> & {
    Label: <Inline extends boolean | undefined, Href extends string | undefined>({ ref, ...props }: MenuLabelProps<Inline, Href>) => JSX.Element;
    Item: <T extends HTMLElement = HTMLButtonElement>({ className, icon, children, ...props }: MenuItemProps<T>) => JSX.Element;
};
export default _default;
