import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { projectCreateApi } from "../../../../pages/api/project/create";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";
import { projectDeleteApi } from "../../../../pages/api/project/delete";
import { projectUpdateApi } from "../../../../pages/api/project/update";
import { closeDialog } from "@italodeandra/ui/components/Dialog";

export function ProjectForm({
  query,
  dialogId,
}: {
  dialogId: string;
  query?: {
    _id?: string;
    name?: string;
    client?: { _id: string; name: string };
  };
}) {
  const { register, handleSubmit, watch, reset } = useForm<{ name: string }>();

  useEffect(() => {
    if (query?._id) {
      reset({
        name: query.name,
      });
    }
  }, [query, reset]);

  const projectCreate = projectCreateApi.useMutation();
  useEffect(() => {
    if (projectCreate.isSuccess) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectCreate.isSuccess]);

  const projectUpdate = projectUpdateApi.useMutation();
  useEffect(() => {
    if (projectUpdate.isSuccess) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectUpdate.isSuccess]);

  const isSaving = projectCreate.isPending || projectUpdate.isPending;

  const onSubmit = () => {
    if (!isSaving && query?.client?._id) {
      if (query?._id) {
        projectUpdate.mutate({
          ...watch(),
          _id: query._id,
          clientId: query.client._id,
        });
      } else {
        projectCreate.mutate({
          ...watch(),
          clientId: query.client._id,
        });
      }
    }
  };

  const projectDelete = projectDeleteApi.useMutation();
  useEffect(() => {
    if (projectDelete.isSuccess) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDelete.isSuccess]);

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        {...register("name", { required: "Fill with the client name" })}
        required
      />
      <div className="flex w-full gap-2">
        {query?._id && (
          <ConfirmationButton
            onConfirm={() => {
              if (query._id && query.client?._id) {
                projectDelete.mutate({
                  _id: query._id,
                  clientId: query.client._id,
                });
              }
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
