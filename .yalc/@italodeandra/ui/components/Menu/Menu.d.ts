import { ReactElement, ReactNode } from "react";
import { UnstyledButtonProps } from "../Button/UnstyledButton";
import { TextProps } from "../Text/Text";
export declare const defaultMenuItemsClassName = "z-10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800";
export declare type MenuProps = {
    className?: string;
    position?: "left" | "right" | "bottom-right" | "bottom-left";
    iconClassName?: string;
    label?: ReactNode;
    children?: ReactNode;
    button?: ReactNode;
};
export declare type MenuItemProps<Href extends string | undefined> = UnstyledButtonProps<Href> & {
    icon?: ReactElement;
};
export declare type MenuLabelProps<Inline extends boolean | undefined, Href extends string | undefined> = TextProps<Inline, Href>;
declare function Menu({ className, iconClassName, position, children, label, button, }: MenuProps): JSX.Element;
declare namespace Menu {
    var Item: <Href extends string | undefined>({ className, icon, children, ...props }: MenuItemProps<Href>) => JSX.Element;
    var Label: <Inline extends boolean | undefined, Href extends string | undefined>(props: MenuLabelProps<Inline, Href>) => JSX.Element;
}
export default Menu;
