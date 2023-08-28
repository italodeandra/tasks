import { ReactNode } from "react";
import BottomBlurryPoint from "@italodeandra/ui/components/BackgroundEffects/BottomBlurryPoint";
import TopBlurryPoint from "@italodeandra/ui/components/BackgroundEffects/TopBlurryPoint";
import PanelNavigationDrawer from "./PanelNavigationDrawer";
import PanelHeader from "./PanelHeader";

export default function getLayout(children: ReactNode) {
  return (
    <>
      <PanelHeader />
      <PanelNavigationDrawer>
        <TopBlurryPoint />
        <BottomBlurryPoint />
        {children}
      </PanelNavigationDrawer>
    </>
  );
}
