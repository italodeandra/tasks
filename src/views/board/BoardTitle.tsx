import { useRouter } from "next/router";
import { boardGetApi } from "../../pages/api/board/get";
import { MarkdownEditor } from "../../components/Kanban/MarkdownEditor";
import { useCallback, useEffect, useState } from "react";
import { boardUpdateApi } from "../../pages/api/board/update";
import Loading from "@italodeandra/ui/components/Loading";
import { Projects } from "../trello/projects/Projects";
import ContextMenu from "@italodeandra/ui/components/ContextMenu";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import Select from "@italodeandra/ui/components/Select";

function EditPermissionsDialogContent() {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex gap-2">
        <Input placeholder="Invite others by email" className="flex-1" />
        <Button variant="filled" color="primary">
          Invite
        </Button>
      </div>
      <div className="text-sm">Who has access</div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center text-center text-xs">
            <GlobeAltIcon />
          </div>
          <div className="grow">Anyone with the link</div>
          <Select.Root value="view">
            <Select.Trigger
              variant="text"
              size="sm"
              trailingClassName="-mr-1"
            />
            <Select.Content>
              <Select.Item value="view">can view</Select.Item>
              <Select.Item value="edit">can edit</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-center text-xs">
            IA
          </div>
          <div className="grow">
            Ítalo Andrade <span className="opacity-50">(you)</span>
          </div>
          <Button variant="text" size="sm" disabled className="opacity-100">
            admin
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BoardTitle() {
  const router = useRouter();

  const _id = router.query._id as string;

  const boardGet = boardGetApi.useQuery({ _id });
  const boardUpdate = boardUpdateApi.useMutation();

  const [name, setName] = useState(boardGet.data?.name || "");

  useEffect(() => {
    if (name !== boardGet.data?.name) {
      setName(boardGet.data?.name || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardGet.data?.name]);

  const handleChange = useCallback(
    (value: string) => {
      setName(value);
      boardUpdate.mutate({
        _id,
        name: value,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_id],
  );

  const handleEditPermissionsClick = useCallback(() => {
    showDialog({
      title: "Edit board permissions",
      content: <EditPermissionsDialogContent />,
    });
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <div className="-mr-1 mt-[6px] text-sm">/</div>
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <MarkdownEditor
              className="mb-auto mt-[7px] rounded px-1 py-0.5 text-xs transition-colors hover:bg-zinc-900"
              value={name}
              onChange={handleChange}
              editOnDoubleClick={boardGet.data?.canEdit}
              editHighlight
            />
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item onClick={handleEditPermissionsClick}>
              Edit permissions
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
        {boardUpdate.isPending && <Loading />}
        <Projects boardId={_id} />
      </div>
    </>
  );
}
