import NextLink from "next/link";
import UiHeader from "@italodeandra/ui/components/Header";
import UserMenu from "./user-menu/UserMenu";
import React from "react";
import { TimesheetStatus } from "./TimesheetStatus";
import { Logo } from "../../panel/layout/Logo";
import clsx from "@italodeandra/ui/utils/clsx";
import { TimesheetButton } from "./TimesheetButton";
import { OrientationSelect } from "./OrientationSelect";
import Group from "@italodeandra/ui/components/Group";
import { useSnapshot } from "valtio";
import { homeState } from "../../home/home.state";
import Projects from "./projects/Projects";

export default function Header() {
  const { showTimesheet } = useSnapshot(homeState);

  return (
    <UiHeader className="gap-2 px-3.5 md:px-3.5">
      <NextLink href="/">
        <Logo className="w-8 h-8" />
      </NextLink>
      <Group className={clsx("w-full p-2 items-center rounded-lg")}>
        <Group
          className={clsx(
            "p-2 items-center rounded-lg",
            "bg-white/50 dark:bg-black/50"
          )}
        >
          <Projects />
        </Group>
        <div className="grow" />
        <TimesheetButton />
        {!showTimesheet && <OrientationSelect />}
      </Group>
      <TimesheetStatus />
      <UserMenu />
    </UiHeader>
  );
}
