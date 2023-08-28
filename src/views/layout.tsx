import { ReactNode } from "react";
import BottomBlurryPoint from "@italodeandra/ui/components/BackgroundEffects/BottomBlurryPoint";
import TopBlurryPoint from "@italodeandra/ui/components/BackgroundEffects/TopBlurryPoint";

export default function getLayout(children: ReactNode) {
  return (
    <>
      <TopBlurryPoint />
      <BottomBlurryPoint />
      <div>{children}</div>
    </>
  );
}
