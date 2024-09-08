import { useForm } from "react-hook-form";
import { projectCreateApi } from "../../../../../../pages/api/project/create";
import { useCallback, useEffect } from "react";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { projectUpdateApi } from "../../../../../../pages/api/project/update";
import { closeDialog } from "@italodeandra/ui/components/Dialog";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";
import { projectDeleteApi } from "../../../../../../pages/api/project/delete";

export function ProjectDialogContent({
  boardId,
  query,
  dialogId,
}: {
  boardId: string;
  dialogId: string;
  query?: {
    _id?: string;
    name?: string;
  };
}) {
  const form = useForm<{ name: string }>();

  useEffect(() => {
    if (query?._id) {
      form.reset({
        name: query.name,
      });
    }
  }, [form, query]);

  const projectCreate = projectCreateApi.useMutation({
    onSuccess: () => {
      closeDialog(dialogId);
    },
  });

  const projectUpdate = projectUpdateApi.useMutation({
    onSuccess: () => {
      closeDialog(dialogId);
    },
  });

  const isSaving = projectCreate.isPending || projectUpdate.isPending;

  const onSubmit = useCallback(() => {
    if (!isSaving) {
      if (query?._id) {
        projectUpdate.mutate({
          ...form.getValues(),
          _id: query._id,
          boardId,
        });
      } else {
        projectCreate.mutate({
          ...form.getValues(),
          boardId,
        });
      }
    }
  }, [boardId, form, isSaving, projectCreate, projectUpdate, query?._id]);

  const projectDelete = projectDeleteApi.useMutation({
    onSuccess: () => {
      closeDialog(dialogId);
    },
  });

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Input
        label="Name"
        {...form.register("name", { required: "Fill with the project name" })}
        required
        error={!!form.formState.errors.name}
        helpText={form.formState.errors.name?.message}
      />
      <div className="flex w-full gap-2">
        {query?._id && (
          <ConfirmationButton
            onConfirm={() => {
              projectDelete.mutate({
                _id: query._id!,
              });
            }}
            confirmation="Are you sure you want to delete this project?"
            label="Delete"
            position="bottom-left"
            loading={projectDelete.isPending}
          />
        )}
        <Button
          variant="filled"
          color="primary"
          className="flex-1"
          type="submit"
          loading={isSaving}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
