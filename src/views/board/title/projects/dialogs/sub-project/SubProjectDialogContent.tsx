import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { subProjectCreateApi } from "../../../../../../pages/api/sub-project/create";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";
import { subProjectDeleteApi } from "../../../../../../pages/api/sub-project/delete";
import { subProjectUpdateApi } from "../../../../../../pages/api/sub-project/update";
import { closeDialog } from "@italodeandra/ui/components/Dialog";

export function SubProjectDialogContent({
  query,
  dialogId,
}: {
  dialogId: string;
  query?: {
    _id?: string;
    name?: string;
    project?: { _id: string; name: string };
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

  const subProjectCreate = subProjectCreateApi.useMutation({
    onSuccess: () => {
      closeDialog(dialogId);
    },
  });

  const subProjectUpdate = subProjectUpdateApi.useMutation({
    onSuccess: () => {
      closeDialog(dialogId);
    },
  });

  const isSaving = subProjectCreate.isPending || subProjectUpdate.isPending;

  const onSubmit = useCallback(() => {
    if (!isSaving && query?.project?._id) {
      if (query?._id) {
        subProjectUpdate.mutate({
          ...form.getValues(),
          _id: query._id,
          projectId: query.project._id,
        });
      } else {
        subProjectCreate.mutate({
          ...form.getValues(),
          projectId: query.project._id,
        });
      }
    }
  }, [
    form,
    isSaving,
    query?._id,
    query?.project?._id,
    subProjectCreate,
    subProjectUpdate,
  ]);

  const subProjectDelete = subProjectDeleteApi.useMutation({
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
              if (query._id && query.project?._id) {
                subProjectDelete.mutate({
                  _id: query._id,
                  projectId: query.project._id,
                });
              }
            }}
            confirmation="Are you sure you want to delete this sub project?"
            label="Delete"
            position="bottom-left"
            loading={subProjectDelete.isPending}
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
