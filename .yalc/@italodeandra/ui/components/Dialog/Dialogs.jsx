import { useSnapshot } from "valtio";
import dialogsState, { closeDialog } from "./dialogs.state";
import { useEffect } from "react";
import Dialog from "./Dialog";
export default function Dialogs() {
    const { dialogs, setRendered } = useSnapshot(dialogsState);
    useEffect(() => {
        setRendered(true);
        return () => {
            setRendered(false);
        };
    }, [setRendered]);
    return (<>
      {dialogs.map((dialog) => (<Dialog key={dialog._id} open={dialog.open} onOpenChange={() => {
                closeDialog(dialog._id);
                dialog.props.onClose?.(dialog._id);
            }} {...dialog.props} title={dialog.props.title} description={dialog.props.description}>
          {dialog.props.content}
        </Dialog>))}
    </>);
}
