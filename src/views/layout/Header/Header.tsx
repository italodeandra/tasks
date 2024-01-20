import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import ModeToggle from "@italodeandra/ui/components/ModeToggle";
import Image from "next/image";
import NextLink from "next/link";
import UiHeader from "@italodeandra/ui/components/Header";
import Button from "@italodeandra/ui/components/Button";
import { navigationDrawerState } from "@italodeandra/ui/components/NavigationDrawer";
import UserMenu from "../../panel/layout/UserMenu";
import React from "react";
import { TimesheetStatus } from "../../home/Kanban2/header/TimesheetStatus";

export default function Header() {
  return (
    <UiHeader className="gap-2">
      <Button
        icon
        variant="text"
        className="-my-2 -ml-2 mr-3 sm:hidden"
        onClick={navigationDrawerState.toggle}
      >
        <Bars3BottomLeftIcon />
      </Button>
      <NextLink href="/">
        <Image src="/favicon.ico" width={34} height={34} alt="Logo" />
      </NextLink>
      <span className="ml-2 text-xl font-medium">Tasks</span>
      <div className="flex-grow" />
      <TimesheetStatus />
      <ModeToggle />
      <UserMenu />
    </UiHeader>
  );
}
