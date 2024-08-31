import { useForm } from "react-hook-form";
import { projectCreateApi } from "../../../../pages/api/project/create";
import { useEffect } from "react";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { projectUpdateApi } from "../../../../pages/api/project/update";
import { closeDialog } from "@italodeandra/ui/components/Dialog";

export function ProjectForm({
  boardId,
  query,
  dialogId,
}: {
  boardId: string;
  dialogId: string;
  query?: {
    _id?: string;
    name?: string;
    project?: { _id: string; name: string };
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
    if (!isSaving) {
      if (query?._id) {
        projectUpdate.mutate({
          ...watch(),
          _id: query._id,
          boardId,
        });
      } else {
        projectCreate.mutate({
          ...watch(),
          boardId,
        });
      }
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        {...register("name", { required: "Fill with the project name" })}
        required
      />
      <div className="flex w-full gap-2">
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
