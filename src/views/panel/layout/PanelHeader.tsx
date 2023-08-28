import UiHeader from "@italodeandra/ui/components/Header/Header";
import Button from "@italodeandra/ui/components/Button/Button";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import UserMenu from "./UserMenu";
import navigationDrawerState from "@italodeandra/ui/components/NavigationDrawer/navigationDrawer.state";
import NextLink from "next/link";
import Routes from "../../../Routes";

export default function PanelHeader({ title }: { title?: string }) {
  return (
    <UiHeader className="gap-2">
      <Button
        icon
        variant="text"
        className="-my-2 -ml-2"
        onClick={navigationDrawerState.toggle}
      >
        <Bars3BottomLeftIcon />
      </Button>
      <NextLink href={Routes.Home}>
        <Image src="/favicon.ico" width={34} height={34} alt="Logo" />
      </NextLink>
      {title && <span className="ml-2 text-xl font-medium">{title}</span>}
      <div className="flex-grow" />
      <UserMenu />
    </UiHeader>
  );
}
