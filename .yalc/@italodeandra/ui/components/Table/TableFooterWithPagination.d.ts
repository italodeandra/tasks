/// <reference types="react" />
export interface TableFooterWithPaginationProps {
    itemsPerPage: number;
    totalItems?: number;
    currentPage: number;
    onChangePage?: (page: number) => void;
}
export default function TableFooterWithPagination({ itemsPerPage, totalItems, currentPage, onChangePage, }: TableFooterWithPaginationProps): JSX.Element;
