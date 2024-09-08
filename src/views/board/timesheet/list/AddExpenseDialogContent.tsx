import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { timesheetAddExpenseApi } from "../../../../pages/api/timesheet/add-expense";
import { parseFormattedTime } from "@italodeandra/ui/utils/formatTime";
import { closeDialog } from "@italodeandra/ui/components/Dialog";

export function AddExpenseDialogContent({
  dialogId,
  projectId,
}: {
  dialogId: string;
  projectId: string;
}) {
  const form = useForm<{ description: string; time: string }>();

  const timesheetAddExpense = timesheetAddExpenseApi.useMutation({
    onSuccess() {
      closeDialog(dialogId);
    },
  });

  const onSubmit = useCallback(() => {
    if (!timesheetAddExpense.isPending) {
      const values = form.getValues();
      timesheetAddExpense.mutate({
        ...values,
        projectId,
        time: parseFormattedTime(values.time),
      });
    }
  }, [form, projectId, timesheetAddExpense]);

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
        <Button
          variant="filled"
          color="primary"
          className="flex-1"
          type="submit"
          loading={timesheetAddExpense.isPending}
        >
          Add expense
        </Button>
      </div>
    </form>
  );
}
