import { TeamGetApi, teamGetApi } from "../../../../../pages/api/team/get";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { teamInviteUserApi } from "../../../../../pages/api/team/invite-user";
import { teamLeaveApi } from "../../../../../pages/api/team/leave";
import { teamUpdateMemberRoleApi } from "../../../../../pages/api/team/update-member-role";
import { MemberRole } from "../../../../../collections/team";
import Button from "@italodeandra/ui/components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import Input from "@italodeandra/ui/components/Input";
import emailRegExp from "@italodeandra/ui/utils/emailRegExp";
import getInitials from "@italodeandra/ui/utils/getInitials";
import Select from "@italodeandra/ui/components/Select";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";

export function TeamMembers({
  _id,
  onGoBack,
}: {
  _id: string;
  onGoBack: () => void;
}) {
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
                label="Leave"
                position="bottom-right"
                loading={teamLeave.isPending}
                buttonProps={{
                  variant: "text",
                  size: "sm",
                  className: "lowercase",
                }}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
