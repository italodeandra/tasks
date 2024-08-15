import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { PanelUserFieldValues } from "./PanelUserFieldValues";
export default function PanelUserView({ customFields, }: {
    customFields?: (form: UseFormReturn<PanelUserFieldValues>, isLoadingFields: boolean) => ReactNode;
}): import("react").JSX.Element;
