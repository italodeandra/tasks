import React, { ComponentProps } from "react";
import * as RDropdownMenu from "@radix-ui/react-dropdown-menu";
export declare const menuContentClassName = "z-20 min-w-[220px] rounded-md bg-white p-[5px] shadow-lg ring-1 ring-black/5 will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade";
export declare const menuSeparatorClassName = "m-[5px] h-[1px] bg-zinc-200";
declare function DropdownMenuContent({ className, children, ...props }: ComponentProps<typeof RDropdownMenu.Content>): JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof RDropdownMenu.Separator>): JSX.Element;
export declare const menuItemClassName = "relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] text-[13px] leading-none text-zinc-900 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-primary-500 data-[disabled]:text-zinc-300 data-[highlighted]:text-white";
declare function DropdownMenuItem({ className, ...props }: ComponentProps<typeof RDropdownMenu.Item>): JSX.Element;
declare function DropdownMenuCheckboxItem({ className, children, ...props }: ComponentProps<typeof RDropdownMenu.CheckboxItem>): JSX.Element;
declare const DropdownMenu: {
    Root: React.FC<RDropdownMenu.DropdownMenuProps>;
    Trigger: React.ForwardRefExoticComponent<RDropdownMenu.DropdownMenuTriggerProps & React.RefAttributes<HTMLButtonElement>>;
    Content: typeof DropdownMenuContent;
    Item: typeof DropdownMenuItem;
    Separator: typeof DropdownMenuSeparator;
    CheckboxItem: typeof DropdownMenuCheckboxItem;
};
export default DropdownMenu;
