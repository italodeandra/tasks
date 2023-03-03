import { ReactNode } from "react";
declare function Accordion({ children }: {
    children?: ReactNode;
}): JSX.Element;
declare namespace Accordion {
    var Item: typeof AccordionItem;
}
export default Accordion;
declare function AccordionItem({ children, title, defaultOpen, }: {
    children?: ReactNode;
    title: ReactNode;
    defaultOpen?: boolean;
}): JSX.Element;
