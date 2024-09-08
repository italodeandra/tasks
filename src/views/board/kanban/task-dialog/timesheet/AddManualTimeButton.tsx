import { ClockIcon, PlusIcon } from "@heroicons/react/16/solid";
import Button from "@italodeandra/ui/components/Button";
import Popover from "@italodeandra/ui/components/Popover";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import Input from "@italodeandra/ui/components/Input";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useCallback } from "react";
import { Time } from "../../../../../components/Time";
import { timesheetAddTaskApi } from "../../../../../pages/api/timesheet/add-task";

export function AddManualTimeButton({ taskId }: { taskId: string }) {
  const form = useForm({
    defaultValues: {
      from: dayjs().format("YYYY-MM-DDTHH:mm"),
      to: "",
    },
  });

  const timesheetAdd = timesheetAddTaskApi.useMutation({
    onSuccess() {
      form.reset();
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    },
  });

  const onSubmit = useCallback(() => {
    timesheetAdd.mutate({
      taskId,
      from: dayjs(form.watch("from")).toDate().toISOString(),
      to: dayjs(form.watch("to")).toDate().toISOString(),
    });
  }, [form, taskId, timesheetAdd]);

  return (
    <Popover.Root>
      <Tooltip content="Manually add time for yourself">
        <Popover.Trigger asChild>
          <Button
            rounded
            size="sm"
            className="h-[34px]"
            loading={timesheetAdd.isPending}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </Popover.Trigger>
      </Tooltip>
      <Popover.Content>
        <form
          className="flex flex-col gap-3 p-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Input
            label="From"
            type="datetime-local"
            trailing={<ClockIcon className="h-4 w-4" />}
            {...form.register("from", {
              required: "Fill the time start",
              onBlur: () => {
                if (!form.watch("to")) {
                  form.setValue("to", form.watch("from"));
                }
              },
            })}
            required
            error={!!form.formState.errors.from}
            helpText={form.formState.errors.from?.message}
          />
          <Input
            label="To"
            type="datetime-local"
            trailing={<ClockIcon className="h-4 w-4" />}
            {...form.register("to", {
              required: "Fill the time end",
              validate: (value) =>
                dayjs(value).isAfter(dayjs(form.watch("from"))) ||
                "End time must be after start time",
            })}
            required
            error={!!form.formState.errors.to}
            helpText={form.formState.errors.to?.message}
          />
          <Button
            variant="filled"
            color="primary"
            type="submit"
            loading={timesheetAdd.isPending}
          >
            <span>
              Add{" "}
              <Time
                value={dayjs(form.watch("to")).diff(
                  dayjs(form.watch("from")),
                  "milliseconds",
                )}
              />{" "}
              for me
            </span>
          </Button>
        </form>
      </Popover.Content>
    </Popover.Root>
  );
}
