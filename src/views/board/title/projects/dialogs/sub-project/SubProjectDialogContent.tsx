import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
  const { register, handleSubmit, watch, reset } = useForm<{ name: string }>();

  useEffect(() => {
    if (query?._id) {
      reset({
        name: query.name,
      });
    }
  }, [query, reset]);

  const subProjectCreate = subProjectCreateApi.useMutation();
  useEffect(() => {
    if (subProjectCreate.isSuccess) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subProjectCreate.isSuccess]);

  const subProjectUpdate = subProjectUpdateApi.useMutation();
  useEffect(() => {
    if (subProjectUpdate.isSuccess) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subProjectUpdate.isSuccess]);

  const isSaving = subProjectCreate.isPending || subProjectUpdate.isPending;

  const onSubmit = () => {
    if (!isSaving && query?.project?._id) {
      if (query?._id) {
        subProjectUpdate.mutate({
          ...watch(),
          _id: query._id,
          projectId: query.project._id,
        });
      } else {
        subProjectCreate.mutate({
          ...watch(),
          projectId: query.project._id,
        });
      }
    }
  };

  const subProjectDelete = subProjectDeleteApi.useMutation();
  useEffect(() => {
    if (subProjectDelete.isSuccess) {
      closeDialog(dialogId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subProjectDelete.isSuccess]);

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Name"
        {...register("name", { required: "Fill with the project name" })}
        required
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
