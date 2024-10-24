import React, { Fragment } from "react";
import * as RContextMenu from "@radix-ui/react-context-menu";
import { CheckIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import clsx from "../../utils/clsx";
import { dropdownCheckboxItemClassName, dropdownItemIndicatorClassName, dropdownItemClassName, dropdownSeparatorClassName, } from "../../styles/Dropdown.classNames";
import { modalContentClassName } from "../../styles/Modal.classNames";
function ContextMenuContent({ className, children, ...props }) {
    return (<RContextMenu.Portal>
      <RContextMenu.Content {...props} className={clsx(modalContentClassName, "ui-context-menu-content", className)}>
        {children}
      </RContextMenu.Content>
    </RContextMenu.Portal>);
}
function ContextMenuSeparator({ className, ...props }) {
    return (<RContextMenu.Separator {...props} className={clsx(dropdownSeparatorClassName, "ui-context-menu-separator", className)}/>);
}
function ContextMenuItem({ className, href, ...props }) {
    const Wrapper = href ? Link : Fragment;
    return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Wrapper {...(href ? { href } : {})}>
      <RContextMenu.Item {...props} className={clsx(dropdownItemClassName, "ui-context-menu-item", className)}/>
    </Wrapper>);
}
function ContextMenuCheckboxItem({ className, children, indicatorClassName, ...props }) {
    return (<RContextMenu.CheckboxItem {...props} className={clsx(dropdownCheckboxItemClassName, "ui-context-menu-checkbox-item", className)}>
      <RContextMenu.ItemIndicator className={clsx(dropdownItemIndicatorClassName, "ui-context-menu-checkbox-item-indicator", indicatorClassName)}>
        <CheckIcon />
      </RContextMenu.ItemIndicator>
      {children}
    </RContextMenu.CheckboxItem>);
}
const ContextMenu = {
    Root: RContextMenu.Root,
    Trigger: RContextMenu.Trigger,
    Content: ContextMenuContent,
    Item: ContextMenuItem,
    Separator: ContextMenuSeparator,
    CheckboxItem: ContextMenuCheckboxItem,
};
export default ContextMenu;
