import { useCallback, useEffect, useMemo } from "react";
import {
  GlobeAltIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Select from "@italodeandra/ui/components/Select";
import { closeDialog } from "@italodeandra/ui/components/Dialog";
import { PermissionLevel } from "../../../../../../../collections/permission";
import { UserAvatarAndName } from "../../../../../../../components/UserAvatarAndName";
import { TeamAvatarAndName } from "../../../../../../../components/TeamAvatarAndName";
import { ProjectInvite } from "./ProjectInvite";
import {
  ProjectPermissionsListApi,
  projectPermissionsListApi,
} from "../../../../../../../pages/api/project/permissions/list";
import { projectListWithSubProjectsApi } from "../../../../../../../pages/api/project/list-with-sub-projects";
import Button from "@italodeandra/ui/components/Button";
import { projectPermissionsClearApi } from "../../../../../../../pages/api/project/permissions/clear";
import { projectPermissionsUpdateApi } from "../../../../../../../pages/api/project/permissions/update";
import { projectPermissionsCreateApi } from "../../../../../../../pages/api/project/permissions/create";

export function ProjectPermissionsDialogContent({
  dialogId,
  boardId,
  projectId,
}: {
  dialogId: string;
  boardId: string;
  projectId: string;
}) {
  const projectPermissionsList = projectPermissionsListApi.useQuery({
    projectId,
  });

  const projectListWithSubProjects = projectListWithSubProjectsApi.useQuery({
    boardId,
  });

  const project = useMemo(
    () => projectListWithSubProjects.data?.find((p) => p._id === projectId),
    [projectId, projectListWithSubProjects.data],
  );

  useEffect(() => {
    if (!project) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const canEdit = project?.canEdit;

  const { isInheritingFromBoard, teams, users, isPublic } = useMemo(() => {
    const users = projectPermissionsList.data
      ?.filter((p) => p.user)
      .map((p) => ({
        ...p,
        user: p.user!,
      }));
    const teams = projectPermissionsList.data
      ?.filter((p) => p.team)
      .map((p) => ({
        ...p,
        team: p.team!,
      }));
    const isPublic = projectPermissionsList.data?.some((p) => p.public);

    return {
      isInheritingFromBoard: !projectPermissionsList.data?.length,
      users,
      teams,
      isPublic,
    };
  }, [projectPermissionsList.data]);

  const projectPermissionsUpdate = projectPermissionsUpdateApi.useMutation();
  const handlePermissionChange = useCallback(
    (permission: ProjectPermissionsListApi["Response"][0]) =>
      (level: PermissionLevel) => {
        projectPermissionsUpdate.mutate({
          projectId,
          userId: permission.user?._id,
          teamId: permission.team?._id,
          level,
          public: permission.public,
        });
      },
    [projectId, projectPermissionsUpdate],
  );
  const handlePublicPermissionChange = useCallback(
    (level: "public" | "private") => {
      projectPermissionsUpdate.mutate({
        projectId,
        public: level === "public",
        level: PermissionLevel.READ,
      });
    },
    [projectId, projectPermissionsUpdate],
  );

  const projectPermissionsCreate = projectPermissionsCreateApi.useMutation();
  const handleCreateProjectOwnPermissionsClick = useCallback(() => {
    projectPermissionsCreate.mutate({
      projectId,
    });
  }, [projectId, projectPermissionsCreate]);

  const projectPermissionsClear = projectPermissionsClearApi.useMutation();
  const handleResetToBoardPermissions = useCallback(() => {
    projectPermissionsClear.mutate({
      projectId,
    });
  }, [projectPermissionsClear, projectId]);

  return (
    <div className="flex flex-col gap-2 pt-2">
      {isInheritingFromBoard ? (
        <>
          <div className="flex items-center gap-1 rounded-lg bg-zinc-950 p-2 text-zinc-300">
            <InformationCircleIcon className="h-6 w-6" />
            This project is inheriting permissions from the board.
          </div>
          {canEdit && (
            <Button
              onClick={handleCreateProjectOwnPermissionsClick}
              loading={projectPermissionsCreate.isPending}
            >
              Create project own permissions
            </Button>
          )}
        </>
      ) : (
        <>
          {canEdit && <ProjectInvite projectId={projectId} className="mb-2" />}
          <div className="text-sm">Who has access</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center text-center text-xs">
                <GlobeAltIcon />
              </div>
              <div className="grow">Anyone with the link</div>
              <Select.Root
                value={isPublic ? "public" : "private"}
                onValueChange={handlePublicPermissionChange}
              >
                <Select.Trigger
                  variant="text"
                  size="sm"
                  trailingClassName="-mr-1"
                  loading={
                    projectPermissionsUpdate.isPending &&
                    projectPermissionsUpdate.variables.public !== undefined
                  }
                  readOnly={!canEdit}
                />
                <Select.Content>
                  <Select.Item value="public">can view</Select.Item>
                  <Select.Item value="private">no access</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
            {users?.map((permission) => (
              <div
                className="flex items-center gap-2"
                key={permission.user._id}
              >
                <UserAvatarAndName {...permission.user} className="grow" />
                <Select.Root
                  value={permission.level}
                  onValueChange={handlePermissionChange(permission)}
                >
                  <Select.Trigger
                    variant="text"
                    size="sm"
                    trailingClassName="-mr-1"
                    loading={
                      projectPermissionsUpdate.isPending &&
                      projectPermissionsUpdate.variables.userId ===
                        permission.user._id
                    }
                    readOnly={!canEdit}
                  />
                  <Select.Content>
                    <Select.Item value={PermissionLevel.READ}>
                      can view
                    </Select.Item>
                    <Select.Item value={PermissionLevel.WRITE}>
                      can edit tasks
                    </Select.Item>
                    <Select.Item value={PermissionLevel.ADMIN}>
                      admin
                    </Select.Item>
                    {!permission.user.isMe && (
                      <Select.Item value="remove">remove</Select.Item>
                    )}
                  </Select.Content>
                </Select.Root>
              </div>
            ))}
            {teams?.map((permission) => (
              <div
                className="flex items-center gap-2"
                key={permission.team._id}
              >
                <TeamAvatarAndName {...permission.team} className="grow" />
                <Select.Root
                  value={permission.level}
                  onValueChange={handlePermissionChange(permission)}
                  disabled={!canEdit}
                >
                  <Select.Trigger
                    variant="text"
                    size="sm"
                    trailingClassName="-mr-1"
                    loading={
                      projectPermissionsUpdate.isPending &&
                      projectPermissionsUpdate.variables.teamId ===
                        permission.team._id
                    }
                  />
                  <Select.Content>
                    <Select.Item value={PermissionLevel.READ}>
                      can view
                    </Select.Item>
                    <Select.Item value={PermissionLevel.WRITE}>
                      can edit
                    </Select.Item>
                    <Select.Item value="remove">remove</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            ))}
          </div>
          {canEdit && (
            <Button
              onClick={handleResetToBoardPermissions}
              loading={projectPermissionsClear.isPending}
              size="sm"
            >
              Restore permissions from board
            </Button>
          )}
        </>
      )}
    </div>
  );
}
