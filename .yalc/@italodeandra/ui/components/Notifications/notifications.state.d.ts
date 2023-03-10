import { ReactElement, ReactNode } from "react";
declare type Notification = {
    _id: string;
    message: string;
    title?: string;
    timeout?: number | string;
    icon?: "success" | "error" | ReactElement;
    dismissable?: boolean;
    actions?: ReactNode;
    supress?: boolean;
};
declare const notificationsState: {
    rendered: boolean;
    setRendered(rendered: boolean): void;
    notifications: Notification[];
    add({ _id, dismissable, timeout, ...notification }: Pick<Partial<Notification>, "_id"> & Omit<Notification, "_id">): void;
    remove(_id: string): void;
};
export declare function showNotification(notification: string | (Pick<Partial<Notification>, "_id"> & Omit<Notification, "_id">)): void;
export declare function removeNotification(_id: string): void;
export default notificationsState;
