import { ReactNode } from "react";
import { Header } from "./header/Header";

export function getLayout(
  children: ReactNode,
  layoutProps?: { headerContent: ReactNode },
) {
  return (
    <>
      <Header>{layoutProps?.headerContent}</Header>
      {children}
    </>
  );
}
