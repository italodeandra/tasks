/// <reference types="react" />
export interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onChangePage?: (page: number) => void;
    className?: string;
}
export default function Pagination({ totalItems, itemsPerPage, currentPage, onChangePage, className, }: PaginationProps): JSX.Element;
