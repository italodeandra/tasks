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
import { NewProjectModal } from "./projects/new-project/NewProjectModal";
import { NewClientModal } from "./clients/new-client/NewClientModal";
import Clients from "./clients/Clients";
import Button from "@italodeandra/ui/components/Button";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import Popover from "@italodeandra/ui/components/Popover";

function DesktopHeaderContent({ className }: { className?: string }) {
  const { showTimesheet } = useSnapshot(homeState);

  return (
    <Group className={clsx("w-full p-2 items-center rounded-lg", className)}>
      <Clients />
      <Projects />
      <div className="grow" />
      <TimesheetStatus />
      <TimesheetButton />
      {!showTimesheet && <OrientationSelect />}
    </Group>
  );
}

function MobileHeaderContent({ className }: { className?: string }) {
  const { showTimesheet } = useSnapshot(homeState);

  return (
    <Group className={clsx("w-full p-2 items-center rounded-lg", className)}>
      <div className="grow" />
      <TimesheetStatus />
      <TimesheetButton />
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button icon variant="text" rounded>
            <Cog6ToothIcon />
          </Button>
        </Popover.Trigger>
        <Popover.Content className="flex flex-col gap-2">
          <Clients />
          <Projects />
          {!showTimesheet && <OrientationSelect />}
        </Popover.Content>
      </Popover.Root>
    </Group>
  );
}

export default function Header() {
  return (
    <>
      <NewProjectModal />
      <NewClientModal />
      <UiHeader className="gap-2 px-3.5 md:px-3.5 dark:bg-zinc-950/95 dark:[@supports(backdrop-filter:blur(0))]:bg-zinc-950/75 not-scrolled:!bg-zinc-950/75">
        <NextLink href="/">
          <Logo className="w-8 h-8" />
        </NextLink>
        <DesktopHeaderContent className="hidden sm:flex" />
        <MobileHeaderContent className="sm:hidden" />
        <UserMenu />
      </UiHeader>
    </>
  );
}
