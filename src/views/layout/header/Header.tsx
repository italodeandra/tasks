import { UserSection } from "./UserSection";
import { ReactNode } from "react";

export function Header({ children }: { children?: ReactNode }) {
  return (
    <div className="static flex gap-2 p-2 scrolled:shadow scrolled:backdrop-blur">
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
