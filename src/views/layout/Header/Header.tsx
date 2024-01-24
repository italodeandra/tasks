import ModeToggle from "@italodeandra/ui/components/ModeToggle";
import Image from "next/image";
import NextLink from "next/link";
import UiHeader from "@italodeandra/ui/components/Header";
import UserMenu from "../../panel/layout/UserMenu";
import React from "react";
import { TimesheetStatus } from "./TimesheetStatus";

export default function Header() {
  return (
    <UiHeader className="gap-2 px-3.5 md:px-3.5">
      <NextLink href="/">
        <Image src="/favicon.ico" width={34} height={34} alt="Logo" />
      </NextLink>
      <span className="ml-1 text-xl font-medium">Tasks</span>
      <div className="flex-grow" />
      <TimesheetStatus />
      <ModeToggle />
      <UserMenu />
    </UiHeader>
  );
}
