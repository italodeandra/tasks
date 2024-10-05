import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import { useCallback } from "react";
import { timesheetAddExpenseApi } from "../../../../../pages/api/timesheet/add-expense";
import { parseFormattedTime } from "@italodeandra/ui/utils/formatTime";
import { closeDialog } from "@italodeandra/ui/components/Dialog";
import { Controller, useForm } from "@italodeandra/ui/form2";
import * as z from "zod";
import { ProjectsSelect } from "./ProjectsSelect";

const schema = z.object({
  description: z.string().min(1, "Fill with the description"),
  time: z.string().min(1, "Fill with the time"),
  projectsIds: z.array(z.string()).min(1, "Select at least one project"),
});

export function AddExpenseDialogContent({
  boardId,
  dialogId,
}: {
  boardId: string;
  dialogId: string;
}) {
  const form = useForm({
    schema,
  });

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
        time: parseFormattedTime(values.time),
      });
    }
  }, [form, timesheetAddExpense]);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="projectsIds"
        control={form.control}
        render={({ field, fieldState }) => (
          <ProjectsSelect
            boardId={boardId}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Input label="Description" {...form.register("description")} />
      <Input label="Time" {...form.register("time")} />
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
