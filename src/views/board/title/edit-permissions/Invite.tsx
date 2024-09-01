import { boardGetPermissionsApi } from "../../../../pages/api/board/get-permissions";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { boardInviteUserApi } from "../../../../pages/api/board/invite-user";
import { TeamListApi, teamListApi } from "../../../../pages/api/team/list";
import { boardInviteTeamApi } from "../../../../pages/api/board/invite-team";
import clsx from "@italodeandra/ui/utils/clsx";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import emailRegExp from "@italodeandra/ui/utils/emailRegExp";
import { TeamAvatarAndName } from "../../../../components/TeamAvatarAndName";

export function Invite({
  boardId,
  className,
}: {
  boardId: string;
  className?: string;
}) {
  const boardGetPermissions = boardGetPermissionsApi.useQuery({ _id: boardId });
  const { teams, users } = useMemo(() => {
    const users = boardGetPermissions.data
      ?.filter((p) => p.user)
      .map((p) => ({
        ...p,
        user: p.user!,
      }));
    const teams = boardGetPermissions.data
      ?.filter((p) => p.team)
      .map((p) => ({
        ...p,
        team: p.team!,
      }));

    return {
      users,
      teams,
    };
  }, [boardGetPermissions.data]);

  const [invite, setInvite] = useState("");
  const boardInviteUser = boardInviteUserApi.useMutation();
  const handleInviteUser = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      boardInviteUser.mutate({
        boardId,
        email: invite,
      });
    },
    [boardId, boardInviteUser, invite],
  );
  useEffect(() => {
    if (boardInviteUser.isSuccess) {
      setInvite("");
    }
  }, [boardInviteUser.isSuccess]);

  const teamList = teamListApi.useQuery();
  const boardInviteTeam = boardInviteTeamApi.useMutation();
  const handleInviteTeam = useCallback(
    (team: TeamListApi["Response"][0]) => () => {
      boardInviteTeam.mutate({
        boardId,
        teamId: team._id,
      });
    },
    [boardId, boardInviteTeam],
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
          loading={boardInviteUser.isPending}
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
                  boardInviteTeam.isPending &&
                  boardInviteTeam.variables.teamId === team._id
                }
              >
                Invite
              </Button>
            </div>
          ))}
    </div>
  );
}
