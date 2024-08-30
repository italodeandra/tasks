import { useForm } from "react-hook-form";
import { clientCreateApi } from "../../../../pages/api/client/create";
import { useEffect } from "react";
import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { clientUpdateApi } from "../../../../pages/api/client/update";
import { closeDialog } from "@italodeandra/ui/components/Dialog";

export function ClientForm({
  boardId,
  query,
  dialogId,
}: {
  boardId: string;
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

  const clientCreate = clientCreateApi.useMutation();
  useEffect(() => {
    if (clientCreate.isSuccess) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientCreate.isSuccess]);

  const clientUpdate = clientUpdateApi.useMutation();
  useEffect(() => {
    if (clientUpdate.isSuccess) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientUpdate.isSuccess]);

  const isSaving = clientCreate.isPending || clientUpdate.isPending;

  const onSubmit = () => {
    if (!isSaving) {
      if (query?._id) {
        clientUpdate.mutate({
          ...watch(),
          _id: query._id,
          boardId,
        });
      } else {
        clientCreate.mutate({
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
        {...register("name", { required: "Fill with the client name" })}
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
