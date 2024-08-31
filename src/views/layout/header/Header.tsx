import { UserSection } from "./user/UserSection";
import { ReactNode } from "react";

export function Header({ children }: { children?: ReactNode }) {
  return (
    <div className="sticky left-0 top-0 z-10 flex w-full gap-2 bg-zinc-950/70 p-2 backdrop-blur-lg transition-shadow scrolled:shadow">
      <div className="mb-auto flex min-h-8 items-center gap-2">
        <div className="text-2xl leading-none text-zinc-100">マ</div>
        <div className="font-mono text-sm leading-[normal] text-zinc-100">
          Tasks
        </div>
      </div>
      {children}
      <div className="grow" />
      <div className="mb-auto flex min-h-8 items-center gap-2 pr-1">
        <UserSection />
      </div>
    </div>
  );
}
