import { useForm } from "react-hook-form";
import { teamGetApi } from "../../../../../pages/api/team/get";
import { useEffect } from "react";
import { teamCreateApi } from "../../../../../pages/api/team/create";
import { teamUpdateApi } from "../../../../../pages/api/team/update";
import { teamLeaveApi } from "../../../../../pages/api/team/leave";
import Button from "@italodeandra/ui/components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Input from "@italodeandra/ui/components/Input";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";

export function TeamEditForm({
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

  const teamCreate = teamCreateApi.useMutation({
    onSuccess: () => {
      onGoBack();
    },
  });
  const teamUpdate = teamUpdateApi.useMutation({
    onSuccess: () => {
      onGoBack();
    },
  });
  const teamLeave = teamLeaveApi.useMutation({
    onSuccess: () => {
      onGoBack();
    },
  });

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
