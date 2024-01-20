import React, { ComponentProps } from "react";
import * as RContextMenu from "@radix-ui/react-context-menu";
declare function ContextMenuContent({ className, children, ...props }: ComponentProps<typeof RContextMenu.Content>): JSX.Element;
declare function ContextMenuSeparator({ className, ...props }: ComponentProps<typeof RContextMenu.Separator>): JSX.Element;
declare function ContextMenuItem({ className, href, ...props }: ComponentProps<typeof RContextMenu.Item> & {
    href?: string;
}): JSX.Element;
declare function ContextMenuCheckboxItem({ className, children, ...props }: ComponentProps<typeof RContextMenu.CheckboxItem>): JSX.Element;
declare const ContextMenu: {
    Root: React.FC<RContextMenu.ContextMenuProps>;
    Trigger: React.ForwardRefExoticComponent<RContextMenu.ContextMenuTriggerProps & React.RefAttributes<HTMLSpanElement>>;
    Content: typeof ContextMenuContent;
    Item: typeof ContextMenuItem;
    Separator: typeof ContextMenuSeparator;
    CheckboxItem: typeof ContextMenuCheckboxItem;
};
export default ContextMenu;
