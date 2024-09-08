import { FormEvent, useCallback, useMemo, useState } from "react";
import clsx from "@italodeandra/ui/utils/clsx";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import emailRegExp from "@italodeandra/ui/utils/emailRegExp";
import {
  TeamListApi,
  teamListApi,
} from "../../../../../../../pages/api/team/list";
import { TeamAvatarAndName } from "../../../../../../../components/TeamAvatarAndName";
import { projectPermissionsListApi } from "../../../../../../../pages/api/project/permissions/list";
import { projectPermissionsInviteUserApi } from "../../../../../../../pages/api/project/permissions/invite-user";
import { projectPermissionsInviteTeamApi } from "../../../../../../../pages/api/project/permissions/invite-team";

export function ProjectInvite({
  projectId,
  className,
}: {
  projectId: string;
  className?: string;
}) {
  const projectPermissionsList = projectPermissionsListApi.useQuery({
    projectId,
  });
  const { teams, users } = useMemo(() => {
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

    return {
      users,
      teams,
    };
  }, [projectPermissionsList.data]);

  const [invite, setInvite] = useState("");
  const projectPermissionsInviteUser =
    projectPermissionsInviteUserApi.useMutation({
      onSuccess: () => {
        setInvite("");
      },
    });
  const handleInviteUser = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      projectPermissionsInviteUser.mutate({
        projectId,
        email: invite,
      });
    },
    [projectId, projectPermissionsInviteUser, invite],
  );

  const teamList = teamListApi.useQuery();
  const projectPermissionsInviteTeam =
    projectPermissionsInviteTeamApi.useMutation();
  const handleInviteTeam = useCallback(
    (team: TeamListApi["Response"][0]) => () => {
      projectPermissionsInviteTeam.mutate({
        projectId,
        teamId: team._id,
      });
    },
    [projectId, projectPermissionsInviteTeam],
  );

  const existingEmail = users?.some((u) => u.user.email === invite);

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <form className="flex gap-2" onSubmit={handleInviteUser}>
        <Input
          placeholder="Invite others by email or team name"
          className="flex-1"
          value={invite}
          onChange={(e) => setInvite(e.target.value)}
          error={existingEmail}
          helpText={existingEmail && "This email is already a member"}
        />
        <Button
          variant="filled"
          color="primary"
          disabled={!emailRegExp.test(invite) || existingEmail}
          type="submit"
          loading={projectPermissionsInviteUser.isPending}
          className="mb-auto"
        >
          Invite
        </Button>
      </form>
      {invite &&
        teamList.data
          ?.filter(
            (team) =>
              team.name?.toLowerCase().includes(invite.toLowerCase()) &&
              teams?.every((t) => t.team._id !== team._id),
          )
          .map((team) => (
            <div key={team._id} className="flex items-center gap-2">
              <TeamAvatarAndName {...team} className="grow" />
              <Button
                variant="filled"
                color="primary"
                className="py-1"
                onClick={handleInviteTeam(team)}
                loading={
                  projectPermissionsInviteTeam.isPending &&
                  projectPermissionsInviteTeam.variables.teamId === team._id
                }
              >
                Invite
              </Button>
            </div>
          ))}
    </div>
  );
}
