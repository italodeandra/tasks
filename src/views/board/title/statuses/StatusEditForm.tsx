import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Button from "@italodeandra/ui/components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Input from "@italodeandra/ui/components/Input";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";
import { taskStatusCreateApi } from "../../../../pages/api/task-status/create";
import { taskStatusUpdateApi } from "../../../../pages/api/task-status/update";
import { taskStatusDeleteApi } from "../../../../pages/api/task-status/delete";

export function StatusEditForm({
  _id,
  title,
  boardId,
  onGoBack,
}: {
  _id: string;
  title: string;
  boardId: string;
  onGoBack: () => void;
}) {
  const form = useForm({
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    form.setValue("title", title);
  }, [form, title]);

  const taskStatusCreate = taskStatusCreateApi.useMutation({
    onSuccess: () => {
      onGoBack();
    },
  });
  const taskStatusUpdate = taskStatusUpdateApi.useMutation({
    onSuccess: () => {
      onGoBack();
    },
  });
  const taskStatusDelete = taskStatusDeleteApi.useMutation({
    onSuccess: () => {
      onGoBack();
    },
  });

  const onSubmit = () => {
    if (_id === "new") {
      taskStatusCreate.mutate({
        boardId,
        title: form.watch("title"),
      });
    } else {
      taskStatusUpdate.mutate({
        _id,
        title: form.getValues("title"),
      });
    }
  };

  const isLoading = taskStatusCreate.isPending || taskStatusUpdate.isPending;

  return (
    <form
      className="mt-1 flex flex-col gap-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex items-center gap-2 rounded-lg bg-zinc-800/50">
        <Button icon variant="text" className="rounded-lg" onClick={onGoBack}>
          <ArrowLeftIcon />
        </Button>
        <div>{title || "New status"}</div>
      </div>
      <Input
        label="Status title"
        {...form.register("title", { required: "Fill with the status title" })}
        required
        error={!!form.formState.errors.title}
        helpText={form.formState.errors.title?.message}
        autoFocus
      />
      <div className="flex w-full gap-2">
        {_id !== "new" && (
          <ConfirmationButton
            onConfirm={() => {
              taskStatusDelete.mutate({
                _id,
              });
            }}
            confirmation="Are you sure you want to delete this status?"
            label="Delete"
            position="bottom-left"
            loading={taskStatusDelete.isPending}
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
