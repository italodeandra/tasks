import React, { ComponentProps } from "react";
import * as RDropdownMenu from "@radix-ui/react-dropdown-menu";
declare function DropdownMenuContent({ className, arrowClassName, children, sideOffset, collisionPadding, ...props }: ComponentProps<typeof RDropdownMenu.Content> & {
    arrowClassName?: string;
}): JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof RDropdownMenu.Separator>): JSX.Element;
declare function DropdownMenuItem({ className, href, ...props }: ComponentProps<typeof RDropdownMenu.Item> & {
    href?: string;
}): JSX.Element;
declare function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof RDropdownMenu.Item>): JSX.Element;
declare function DropdownMenuCheckboxItem({ className, children, indicatorClassName, ...props }: ComponentProps<typeof RDropdownMenu.CheckboxItem> & {
    indicatorClassName?: string;
}): JSX.Element;
declare const DropdownMenu: {
    Root: React.FC<RDropdownMenu.DropdownMenuProps>;
    Trigger: React.ForwardRefExoticComponent<RDropdownMenu.DropdownMenuTriggerProps & React.RefAttributes<HTMLButtonElement>>;
    Content: typeof DropdownMenuContent;
    Item: typeof DropdownMenuItem;
    Separator: typeof DropdownMenuSeparator;
    CheckboxItem: typeof DropdownMenuCheckboxItem;
    Label: typeof DropdownMenuLabel;
};
export default DropdownMenu;
