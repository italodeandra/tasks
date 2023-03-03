import { ReactElement, ReactNode } from "react";
export default function NavigationItem({ icon, children, href, exact, alternativeActiveHrefs, }: {
    icon?: ReactElement;
    children: ReactNode;
    href: string;
    exact?: boolean;
    alternativeActiveHrefs?: string[];
}): JSX.Element;
