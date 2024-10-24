import clsx from "../../utils/clsx";
import TableActionButton from "./TableActionButton";
import TableBody from "./TableBody";
import TableCell from "./TableCell";
import TableHead from "./TableHead";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableFooter from "./TableFooter";
import TableFooterWithPagination from "./TableFooterWithPagination";
export default function Table({ children, className, hideBorder, autoHeight, }) {
    return (<div className={clsx("overflow-hidden bg-white dark:bg-zinc-800", {
            "relative flex-1": autoHeight,
            "shadow ring-1 ring-black/5 dark:ring-white/10 md:rounded-lg": !hideBorder,
        }, className)}>
      <div className={clsx("overflow-auto", {
            "absolute inset-0": autoHeight,
        })}>
        <table className={clsx("w-full max-w-full divide-y divide-zinc-300 dark:divide-zinc-600")}>
          {children}
        </table>
      </div>
    </div>);
}
Table.Row = TableRow;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Cell = TableCell;
Table.ActionButton = TableActionButton;
Table.Header = TableHeader;
Table.Footer = TableFooter;
Table.FooterWithPagination = TableFooterWithPagination;
