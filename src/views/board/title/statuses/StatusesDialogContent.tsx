import { useCallback, useState } from "react";
import { IStatus } from "./IStatus";
import { StatusList } from "./StatusList";
import { StatusEditForm } from "./StatusEditForm";

export function StatusesDialogContent({ boardId }: { boardId: string }) {
  const [selectedStatusId, setSelectedStatusId] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const handleStatusEdit = useCallback((team: IStatus) => {
    setSelectedStatusId(team._id);
    setTitle(team.title);
  }, []);

  if (selectedStatusId) {
    return (
      <StatusEditForm
        _id={selectedStatusId}
        boardId={boardId}
        title={title}
        onGoBack={() => setSelectedStatusId(null)}
      />
    );
  }

  return <StatusList onEdit={handleStatusEdit} boardId={boardId} />;
}
