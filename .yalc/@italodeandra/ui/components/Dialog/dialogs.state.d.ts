import { ReactElement, ReactNode } from "react";
export declare type IDialog = {
    _id: string;
    actions?: ReactNode | ((_id: string) => ReactNode);
    title?: ReactNode;
    content: ReactNode | ((_id: string) => ReactNode);
    icon?: ReactElement;
    open?: boolean;
    hideCloseButton?: boolean;
};
declare const dialogsState: {
    rendered: boolean;
    setRendered(rendered: boolean): void;
    dialogs: IDialog[];
    add({ _id, open, ...dialog }: Pick<Partial<IDialog>, "_id"> & Omit<IDialog, "_id">): void;
    remove(_id: string): void;
    update(dialog: Pick<IDialog, "_id"> & Partial<Omit<IDialog, "_id">>): void;
};
export declare function showDialog(dialog: Pick<Partial<IDialog>, "_id"> & Omit<IDialog, "_id">): void;
export declare function closeDialog(_id: string): void;
export default dialogsState;
