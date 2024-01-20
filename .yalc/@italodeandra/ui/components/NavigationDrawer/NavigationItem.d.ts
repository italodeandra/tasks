import { ReactElement, ReactNode } from "react";
export default function NavigationItem({ icon, children, href, exact, alternativeActiveHrefs, className, }: {
    icon?: ReactElement;
    children: ReactNode;
    href: string;
    exact?: boolean;
    alternativeActiveHrefs?: string[];
    className?: string;
}): JSX.Element;
