import { useQueryClient } from "@tanstack/react-query";
import authState, { useAuthSnapshot } from "@italodeandra/auth/auth.state";
import {
  setData_authGetUser,
  useAuthGetUser,
} from "@italodeandra/auth/api/getUser";
import { useRouter } from "next/router";
import { useAuthPanelUserStopImpersonate } from "@italodeandra/auth/api/panel/user/stop-impersonate";
import { checkUserType } from "@italodeandra/auth/collections/user/User.service";
import { UserType } from "@italodeandra/auth/collections/user/User";
import { useCallback, useEffect, useState } from "react";
import { deleteCookie } from "cookies-next";
import Routes from "../../../Routes";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import { ExclamationTriangleIcon, UserIcon } from "@heroicons/react/16/solid";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";
import Button from "@italodeandra/ui/components/Button";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import Loading from "@italodeandra/ui/components/Loading";
import getInitials from "@italodeandra/ui/utils/getInitials";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { PlusIcon } from "@heroicons/react/20/solid";
import Input from "@italodeandra/ui/components/Input";
import { teamListApi } from "../../../pages/api/team/list";
import { TeamGetApi, teamGetApi } from "../../../pages/api/team/get";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { teamCreateApi } from "../../../pages/api/team/create";
import { useForm } from "react-hook-form";
import { PencilIcon } from "@heroicons/react/24/solid";
import Select from "@italodeandra/ui/components/Select";
import { MemberRole } from "../../../collections/team";
import { teamUpdateApi } from "../../../pages/api/team/update";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";
import emailRegExp from "@italodeandra/ui/utils/emailRegExp";
import { teamInviteUserApi } from "../../../pages/api/team/invite-user";
import { teamLeaveApi } from "../../../pages/api/team/leave";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { teamUpdateMemberRoleApi } from "../../../pages/api/team/update-member-role";

type ITeam = { _id: string; name: string };

function TeamList({
  onSelect,
  onEdit,
}: {
  onSelect: (team: ITeam) => void;
  onEdit: (team: ITeam) => void;
}) {
  const teamList = teamListApi.useQuery();

  const handleNewTeamClick = useCallback(() => {
    onEdit({
      _id: "new",
      name: "",
    });
  }, [onEdit]);

  const handleTeamClick = useCallback(
    (team: ITeam) => () => {
      onSelect(team);
    },
    [onSelect],
  );

  return (
    <div className="mt-1 flex flex-col gap-2">
      {teamList.isLoading && <Skeleton className="h-[38px]" />}
      {teamList.data?.map((team) => (
        <Button
          variant="filled"
          key={team._id}
          className="min-h-[38px] justify-start rounded-lg py-px pl-3 pr-px text-left font-normal text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:active:border-zinc-500"
          onClick={handleTeamClick(team)}
        >
          <div className="flex-1">{team.name}</div>
          {team.canEdit && (
            <Button
              as="div"
              icon
              variant="text"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(team);
              }}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </Button>
      ))}
      <Button
        variant="text"
        className="justify-start rounded-lg px-3 py-2 text-left font-normal text-zinc-300"
        leading={<PlusIcon />}
        onClick={handleNewTeamClick}
      >
        New team
      </Button>
    </div>
  );
}

function TeamEditForm({
  _id,
  onGoBack,
}: {
  _id: string;
  onGoBack: () => void;
}) {
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const teamGet = teamGetApi.useQuery({ _id }, { enabled: _id !== "new" });
  useEffect(() => {
    if (teamGet.isSuccess) {
      form.setValue("name", teamGet.data?.name || "");
    }
  }, [form, teamGet.data?.name, teamGet.isSuccess]);

  const teamCreate = teamCreateApi.useMutation();
  useEffect(() => {
    if (teamCreate.isSuccess) {
      onGoBack();
    }
  }, [onGoBack, teamCreate.isSuccess]);
  const teamUpdate = teamUpdateApi.useMutation();
  useEffect(() => {
    if (teamUpdate.isSuccess) {
      onGoBack();
    }
  }, [onGoBack, teamUpdate.isSuccess]);
  const teamLeave = teamLeaveApi.useMutation();
  useEffect(() => {
    if (teamLeave.isSuccess) {
      onGoBack();
    }
  }, [onGoBack, teamLeave.isSuccess]);

  const onSubmit = () => {
    if (_id === "new") {
      teamCreate.mutate({
        name: form.watch("name"),
      });
    } else {
      teamUpdate.mutate({
        _id,
        name: form.getValues("name"),
      });
    }
  };

  const isLoading = teamCreate.isPending || teamUpdate.isPending;

  return (
    <form
      className="mt-1 flex flex-col gap-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex items-center gap-2 rounded-lg bg-zinc-800/50">
        <Button icon variant="text" className="rounded-lg" onClick={onGoBack}>
          <ArrowLeftIcon />
        </Button>
        <div>{teamGet.data?.name || "New team"}</div>
      </div>
      <Input
        label="Team name"
        {...form.register("name", { required: "Fill with the team name" })}
        required
        error={!!form.formState.errors.name}
        helpText={form.formState.errors.name?.message}
        autoFocus
      />
      <div className="flex w-full gap-2">
        {_id !== "new" && (
          <ConfirmationButton
            onConfirm={() => {
              teamLeave.mutate({
                _id,
              });
            }}
            confirmation="Are you sure you want to leave this team?"
            label="Leave"
            position="bottom-left"
            loading={teamLeave.isPending}
          />
        )}
        <Button
          variant="filled"
          color="primary"
          type="submit"
          loading={isLoading}
          className="w-full"
        >
          Save
        </Button>
      </div>
    </form>
  );
}

function TeamMembers({ _id, onGoBack }: { _id: string; onGoBack: () => void }) {
  const teamGet = teamGetApi.useQuery({ _id }, { retry: false });

  useEffect(() => {
    if (teamGet.isError) {
      onGoBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamGet.isError]);

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const teamInviteUser = teamInviteUserApi.useMutation();

  useEffect(() => {
    if (teamInviteUser.isSuccess) {
      form.reset();
    }
  }, [form, teamInviteUser.isSuccess]);

  const onInvite = () => {
    const email = form.watch("email");

    if (teamGet.data?.members.some((m) => m.email === email)) {
      form.setError("email", {
        type: "manual",
        message: "This email is already a member",
      });
      return;
    }

    teamInviteUser.mutate({
      email,
      teamId: _id,
    });
  };

  const teamLeave = teamLeaveApi.useMutation();
  useEffect(() => {
    if (teamLeave.isSuccess) {
      onGoBack();
    }
  }, [onGoBack, teamLeave.isSuccess]);

  const teamUpdateMemberRole = teamUpdateMemberRoleApi.useMutation();
  const handleMemberRoleChange = useCallback(
    (member: TeamGetApi["Response"]["members"][0]) => (role: MemberRole) => {
      teamUpdateMemberRole.mutate({
        teamId: _id,
        userId: member._id,
        role,
      });
    },
    [_id, teamUpdateMemberRole],
  );

  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex items-center gap-2 rounded-lg bg-zinc-800/50">
        <Button icon variant="text" className="rounded-lg" onClick={onGoBack}>
          <ArrowLeftIcon />
        </Button>
        {teamGet.isLoading && <Skeleton className="h-4 w-20" />}
        {teamGet.data?.name}
      </div>
      {teamGet.data?.canEdit && (
        <form
          className="flex items-start gap-2"
          onSubmit={form.handleSubmit(onInvite)}
        >
          <Input
            placeholder="Invite others by email"
            className="flex-1"
            type="email"
            {...form.register("email", {
              pattern: {
                value: emailRegExp,
                message: "Fill with a valid email",
              },
            })}
            error={!!form.formState.errors.email}
            helpText={form.formState.errors.email?.message}
          />
          <Button
            variant="filled"
            color="primary"
            type="submit"
            loading={teamInviteUser.isPending}
          >
            Invite
          </Button>
        </form>
      )}
      <div className="text-sm">Members</div>
      <div className="flex flex-col gap-2">
        {teamGet.isLoading && <Skeleton className="h-[24px]" />}
        {teamGet.data?.members.map((member) => (
          <div className="flex items-center gap-2" key={member._id}>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-center text-xs uppercase">
              {getInitials(member.name || member.email)}
            </div>
            <div className="grow">
              {member.name || member.email}
              {member.isMe ? (
                <>
                  {" "}
                  <span className="opacity-50">(you)</span>
                </>
              ) : null}
            </div>
            {teamGet.data.canEdit ? (
              <Select.Root
                value={member.role}
                onValueChange={handleMemberRoleChange(member)}
              >
                <Select.Trigger
                  variant="text"
                  size="sm"
                  className="-my-1.5"
                  trailingClassName="-mr-1"
                  loading={
                    teamUpdateMemberRole.isPending &&
                    teamUpdateMemberRole.variables.userId === member._id
                  }
                />
                <Select.Content>
                  <Select.Item value={MemberRole.MEMBER}>member</Select.Item>
                  <Select.Item value={MemberRole.ADMIN}>admin</Select.Item>
                  {!member.isMe && (
                    <Select.Item value="remove">remove</Select.Item>
                  )}
                </Select.Content>
              </Select.Root>
            ) : member.isMe ? (
              <ConfirmationButton
                onConfirm={() => {
                  teamLeave.mutate({
                    _id,
                  });
                }}
                confirmation="Are you sure you want to leave this team?"
                label="leave"
                position="bottom-right"
                loading={teamLeave.isPending}
                buttonProps={{
                  variant: "text",
                  size: "sm",
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamsDialogContent() {
  const [route, setRoute] = useState<"edit" | "members" | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleTeamSelect = useCallback((team: ITeam) => {
    setSelectedTeamId(team._id);
    setRoute("members");
  }, []);

  const handleTeamEdit = useCallback((team: ITeam) => {
    setSelectedTeamId(team._id);
    setRoute("edit");
  }, []);

  if (selectedTeamId) {
    if (route === "edit") {
      return (
        <TeamEditForm
          _id={selectedTeamId}
          onGoBack={() => {
            setSelectedTeamId(null);
            setRoute(null);
          }}
        />
      );
    } else {
      return (
        <TeamMembers
          _id={selectedTeamId}
          onGoBack={() => {
            setSelectedTeamId(null);
            setRoute(null);
          }}
        />
      );
    }
  }

  return <TeamList onSelect={handleTeamSelect} onEdit={handleTeamEdit} />;
}

export function UserSection() {
  const queryClient = useQueryClient();
  const { token, previousToken } = useAuthSnapshot();
  const { data: user, isLoading: isLoadingUser, isError } = useAuthGetUser();
  const router = useRouter();
  const { mutate: stopImpersonate, isPending: isStoppingImpersonate } =
    useAuthPanelUserStopImpersonate();
  const isAdmin = checkUserType(user, [UserType.ADMIN]);

  const handleLogOutClick = useCallback(async () => {
    authState.token = null;
    deleteCookie("auth", { path: "/" });
    setData_authGetUser(queryClient, null);
    await router.replace(Routes.Home);
  }, [queryClient, router]);

  const handleTeamsClick = useCallback(() => {
    showDialog({
      title: "Teams",
      content: <TeamsDialogContent />,
    });
  }, []);

  if (isError) {
    return (
      <Tooltip content="There was an unexpected error trying to get the logged in user data">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        </div>
      </Tooltip>
    );
  }

  const isLoading = isStoppingImpersonate || (!!token && isLoadingUser);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="filled"
          rounded
          className="group/myself pointer-events-auto relative h-7 w-7 p-0 text-xs uppercase dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
          onClick={stopPropagation}
        >
          {isLoading ? (
            <Loading className="h-4 w-4" />
          ) : user ? (
            getInitials(user.name || user.email)
          ) : (
            <UserIcon className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {user ? (
          <>
            <DropdownMenu.Label title={user.email}>
              {user.name || user.email}
            </DropdownMenu.Label>
            <DropdownMenu.Item href={Routes.Home}>Boards</DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleTeamsClick}>
              Teams
            </DropdownMenu.Item>
            {previousToken && (
              <DropdownMenu.Item onClick={() => stopImpersonate()}>
                Stop impersonating
              </DropdownMenu.Item>
            )}
            {isAdmin && (
              <DropdownMenu.Item href={Routes.Panel}>Panel</DropdownMenu.Item>
            )}
            <DropdownMenu.Item onClick={handleLogOutClick}>
              Log out
            </DropdownMenu.Item>
          </>
        ) : (
          <>
            <DropdownMenu.Item href={Routes.SignIn}>Sign in</DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
