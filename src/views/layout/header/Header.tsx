import { UserSection } from "./user/UserSection";
import { ReactNode } from "react";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import { useQueryClient } from "@tanstack/react-query";
import UnstyledButton from "../../../../.yalc/@italodeandra/ui/components/Button/UnstyledButton";
import { CurrentClock } from "./CurrentClock";
import Routes from "../../../Routes";

export function Header({ children }: { children?: ReactNode }) {
  const queryClient = useQueryClient();

  return (
    <div
      id="header"
      className="sticky left-0 top-0 z-10 flex w-full gap-2 bg-zinc-950/70 p-2 backdrop-blur-lg transition-shadow scrolled:shadow"
    >
      <div className="mb-auto flex min-h-8 items-center gap-2">
        <Tooltip content="Click to refresh">
          <UnstyledButton
            className="text-2xl leading-none text-zinc-100"
            onClick={() => queryClient.invalidateQueries()}
          >
            マ
          </UnstyledButton>
        </Tooltip>
        <UnstyledButton
          className="font-mono text-sm leading-[normal] text-zinc-100"
          href={Routes.Home}
        >
          MaTasks
        </UnstyledButton>
      </div>
      {children}
      <div className="grow" />
      <div className="mb-auto flex min-h-8 items-center gap-2 pr-1">
        <CurrentClock />
        <UserSection />
      </div>
    </div>
  );
}
