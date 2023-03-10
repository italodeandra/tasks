import { ReactNode } from "react";
import { ModeToggle } from "@italodeandra/ui/components/ModeToggle/ModeToggle";
import BottomBlurryPoint from "@italodeandra/ui/components/BackgroundEffects/BottomBlurryPoint";
import TopBlurryPoint from "@italodeandra/ui/components/BackgroundEffects/TopBlurryPoint";

export default function getLayout(children: ReactNode) {
  return (
    <>
      <TopBlurryPoint />
      <BottomBlurryPoint />
      <div className="absolute bottom-1 left-1">
        <ModeToggle />
      </div>
      {children}
    </>
  );
}
