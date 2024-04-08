import * as RPopover from "@radix-ui/react-popover";
import React, { ComponentProps, ForwardedRef } from "react";
declare function PopoverContentWithRef({ className, sideOffset, collisionPadding, children, ...props }: ComponentProps<typeof RPopover.Content>, ref: ForwardedRef<HTMLDivElement>): JSX.Element;
declare function PopoverArrow({ className, ...props }: ComponentProps<typeof RPopover.Arrow>): JSX.Element;
declare const Popover: {
    Content: typeof PopoverContentWithRef;
    Root: React.FC<RPopover.PopoverProps>;
    Trigger: React.ForwardRefExoticComponent<RPopover.PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>>;
    Arrow: typeof PopoverArrow;
};
export default Popover;
