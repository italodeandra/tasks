import React, {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
} from "react";
import * as RadixSelect from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import clsx from "clsx";

export function Select({
  trigger,
  children,
  contentClassName,
  ...props
}: {
  trigger: ReactElement;
  children?: ReactNode;
  contentClassName?: string;
} & Omit<ComponentPropsWithoutRef<typeof RadixSelect.Root>, "children">) {
  return (
    <RadixSelect.Root {...props}>
      <RadixSelect.Trigger asChild>{trigger}</RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          className={clsx(
            "overflow-hidden rounded-md border border-gray-5 bg-gray-1 shadow-md shadow-gray-4",
            contentClassName
          )}
        >
          <RadixSelect.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-gray-11">
            <ChevronUpIcon />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className="p-[5px]">
            {children}
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-gray-1">
            <ChevronDownIcon />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

export type SelectItemProps = ComponentPropsWithRef<typeof SelectItem>;

export const SelectItem = forwardRef(function SelectItem(
  {
    children,
    className,
    color = "blue",
    ...props
  }: ComponentPropsWithoutRef<typeof RadixSelect.Item> & { color?: "blue" },
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  return (
    <RadixSelect.Item
      className={clsx(
        "relative flex h-[25px] select-none items-center rounded-[3px] pr-[35px] pl-[25px] text-sm leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none",
        "text-gray-12 data-[disabled]:text-gray-8 data-[highlighted]:text-white", // default,
        {
          blue: "data-[highlighted]:bg-blue-9",
          red: "data-[highlighted]:bg-red-9",
          green: "data-[highlighted]:bg-green-9",
          pink: "data-[highlighted]:bg-pink-9",
          orange: "data-[highlighted]:bg-orange-9",
        }[color],
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon className="h-4 w-4" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

export const SelectLabel = forwardRef(function SelectLabel(
  {
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<typeof RadixSelect.Label>,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <RadixSelect.Label
      className={clsx(
        "px-[25px] text-xs leading-[25px] text-gray-10",
        className
      )}
      {...props}
      ref={ref}
    >
      {children}
    </RadixSelect.Label>
  );
});
