import clsx from "../../utils/clsx";
import { useContext } from "react";
import TableHeadContext from "./TableHeadContext";
export default function TableCell({ children, className, actions, colSpan, title, }) {
    const { isHead } = useContext(TableHeadContext);
    const commonClassName = clsx("text-sm first:pl-4 first:sm:pl-6 first:font-medium first:text-zinc-900 dark:first:text-zinc-100 px-3", {
        "py-2 last:pr-4 last:sm:pr-6": !actions,
        "py-0.5 text-right pr-2.5 sm:pr-5": actions,
    });
    if (isHead) {
        return (<th className={clsx(commonClassName, "sticky left-0 bg-zinc-50 py-2 text-left font-semibold text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50", className)} colSpan={colSpan} title={title}>
        {children}
      </th>);
    }
    return (<td className={clsx(commonClassName, "whitespace-nowrap text-zinc-500 dark:text-zinc-300", className)} colSpan={colSpan} title={title}>
      {children}
    </td>);
}
