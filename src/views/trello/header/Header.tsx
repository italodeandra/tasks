import { UserSection } from "./UserSection";

export function Header() {
  return (
    <div className="static flex items-center gap-2 p-2 scrolled:shadow scrolled:backdrop-blur">
      <div className="text-2xl leading-none text-zinc-100">マ</div>
      <div className="font-mono text-sm leading-[normal] text-zinc-100">
        Tasks
      </div>
      <div className="grow" />
      <UserSection />
    </div>
  );
}