import { ComponentType, ReactElement, ReactNode } from "react";
export declare type DataTableProps<RowData> = {
    title?: ReactNode;
    subtitle?: ReactNode;
    headerContent?: ReactNode;
    data?: RowData[];
    idAccessor?: keyof RowData;
    columns: {
        id?: string;
        title?: ReactNode;
        accessor?: keyof RowData;
        render?: (item: RowData) => ReactNode;
    }[];
    actions?: {
        title: string;
        icon: ReactElement;
        href?: string | ((item: RowData) => string);
        onClick?: (item: RowData) => void;
        wrapper?: ComponentType<{
            item: RowData;
            children: ReactNode;
        }>;
    }[];
    isLoading?: boolean;
    noRecords?: ReactNode;
    onRowClick?: (item: RowData) => void;
    rowWrapper?: ComponentType<{
        item: RowData;
        children: ReactNode;
    }>;
    pagination?: boolean;
    currentPage?: number;
    onChangePage?: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
    className?: string;
};
export default function DataTable<RowData>({ title, subtitle, headerContent, data, idAccessor, actions, columns, isLoading, noRecords: noRecordsText, onRowClick, rowWrapper, pagination, currentPage, onChangePage, totalItems, itemsPerPage, className, }: DataTableProps<RowData>): JSX.Element;
