import NextLink from "next/link";
import UiHeader from "@italodeandra/ui/components/Header";
import UserMenu from "../../panel/layout/user-menu/UserMenu";
import React from "react";
import { TimesheetStatus } from "./TimesheetStatus";
import { Logo } from "../../panel/layout/Logo";

export default function Header() {
  return (
    <UiHeader className="gap-2 px-3.5 md:px-3.5">
      <NextLink href="/">
        <Logo className="w-8 h-8" />
      </NextLink>
      <div className="flex-grow" />
      <TimesheetStatus />
      <UserMenu />
    </UiHeader>
  );
}
