import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import formatTime, {
  parseFormattedTime,
} from "@italodeandra/ui/utils/formatTime";
import { closeDialog } from "@italodeandra/ui/components/Dialog";
import { timesheetGetApi } from "../../../pages/api/timesheet/get";
import { timesheetUpdateApi } from "../../../pages/api/timesheet/update";
import ConfirmationButton from "@italodeandra/ui/components/ConfirmationButton";
import { timesheetDeleteApi } from "../../../pages/api/timesheet/delete";

export function EditTimesheetDialogContent({
  dialogId,
  timesheetId,
}: {
  dialogId: string;
  timesheetId: string;
}) {
  const form = useForm<{ description: string; time: string }>();

  const timesheetGet = timesheetGetApi.useQuery({
    _id: timesheetId,
  });
  useEffect(() => {
    if (timesheetGet.data) {
      form.reset({
        description: timesheetGet.data.description,
        time: timesheetGet.data.time ? formatTime(timesheetGet.data.time) : "",
      });
    }
  }, [form, timesheetGet.data]);

  const timesheetUpdate = timesheetUpdateApi.useMutation({
    onSuccess() {
      closeDialog(dialogId);
    },
  });
  const timesheetDelete = timesheetDeleteApi.useMutation({
    onSuccess() {
      closeDialog(dialogId);
    },
  });

  const onSubmit = useCallback(() => {
    if (!timesheetUpdate.isPending) {
      const values = form.getValues();
      timesheetUpdate.mutate({
        ...values,
        _id: timesheetId,
        time: parseFormattedTime(values.time),
      });
    }
  }, [form, timesheetId, timesheetUpdate]);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Input
        label="Description"
        {...form.register("description", {
          required: "Fill with the description",
        })}
        required
        error={!!form.formState.errors.description}
        helpText={form.formState.errors.description?.message}
      />
      <Input
        label="Time"
        {...form.register("time", {
          required: "Fill with the time",
        })}
        required
        error={!!form.formState.errors.time}
        helpText={form.formState.errors.time?.message}
      />
      <div className="flex w-full gap-2">
        <ConfirmationButton
          onConfirm={() => {
            timesheetDelete.mutate({
              _id: timesheetId,
            });
          }}
          confirmation="Are you sure you want to delete this timesheet?"
          label="Delete"
          position="bottom-left"
          loading={timesheetDelete.isPending}
        />
        <Button
          variant="filled"
          color="primary"
          className="flex-1"
          type="submit"
          loading={timesheetUpdate.isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
