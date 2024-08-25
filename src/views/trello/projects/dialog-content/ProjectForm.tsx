import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { projectsDialogState } from "../projectsDialog.state";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { useSnapshot } from "valtio";
import { projectCreateApi } from "../../../../pages/api/project2/create";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";
import { projectDeleteApi } from "../../../../pages/api/project2/delete";
import { projectUpdateApi } from "../../../../pages/api/project2/update";

export function ProjectForm() {
  const { query } = useSnapshot(projectsDialogState);
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
      projectsDialogState.route = "list";
    }
  }, [projectCreate.isSuccess]);
  const projectUpdate = projectUpdateApi.useMutation();
  useEffect(() => {
    if (projectUpdate.isSuccess) {
      projectsDialogState.route = "list";
    }
  }, [projectUpdate.isSuccess]);

  const isSaving = projectCreate.isPending || projectUpdate.isPending;

  const onSubmit = () => {
    if (!isSaving) {
      if (query?._id) {
        projectUpdate.mutate({
          ...watch(),
          _id: query._id,
        });
      } else {
        projectCreate.mutate({
          ...watch(),
          clientId: query?.client?._id,
        });
      }
    }
  };

  const projectDelete = projectDeleteApi.useMutation();
  useEffect(() => {
    if (projectDelete.isSuccess) {
      projectsDialogState.route = "list";
    }
  }, [projectDelete.isSuccess]);

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        {...register("name", { required: "Fill with the client name" })}
        required
      />
      <div className="flex w-full gap-2">
        <Button
          variant="filled"
          onClick={() => (projectsDialogState.route = "list")}
        >
          Go back
        </Button>
        {query?._id && (
          <ConfirmationButton
            onConfirm={() => {
              projectDelete.mutate({ _id: query._id! });
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
