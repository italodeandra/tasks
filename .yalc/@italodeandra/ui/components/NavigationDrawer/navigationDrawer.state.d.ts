declare const navigationDrawerState: {
    isOpen: boolean;
    open(): void;
    close(): void;
    setOpen(open: boolean): void;
    toggle(): void;
};
export declare const hydrateNavigationDrawerState: (cookies?: {
    state?: string;
}) => void;
export default navigationDrawerState;
