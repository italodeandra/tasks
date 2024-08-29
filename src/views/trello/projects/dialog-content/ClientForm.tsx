import { useForm } from "react-hook-form";
import { clientCreateApi } from "../../../../pages/api/client/create";
import { useEffect } from "react";
import { projectsDialogState } from "../projectsDialog.state";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { useSnapshot } from "valtio";
import { clientUpdateApi } from "../../../../pages/api/client/update";

export function ClientForm() {
  const { query } = useSnapshot(projectsDialogState);
  const { register, handleSubmit, watch, reset } = useForm<{ name: string }>();

  useEffect(() => {
    if (query?._id) {
      reset({
        name: query.name,
      });
    }
  }, [query, reset]);

  const clientCreate = clientCreateApi.useMutation();
  useEffect(() => {
    if (clientCreate.isSuccess) {
      projectsDialogState.route = "list";
    }
  }, [clientCreate.isSuccess]);

  const clientUpdate = clientUpdateApi.useMutation();
  useEffect(() => {
    if (clientUpdate.isSuccess) {
      projectsDialogState.route = "list";
    }
  }, [clientUpdate.isSuccess]);

  const isSaving = clientCreate.isPending || clientUpdate.isPending;

  const onSubmit = () => {
    if (!isSaving) {
      if (query?._id) {
        clientUpdate.mutate({
          ...watch(),
          _id: query._id,
        });
      } else {
        clientCreate.mutate(watch());
      }
    }
  };

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
