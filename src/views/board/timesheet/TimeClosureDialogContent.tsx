import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import NumericInput from "@italodeandra/ui/components/Input/NumericInput";
import { timesheetTimeClosureGetCurrentApi } from "../../../pages/api/timesheet/time-closure/get-current";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import formatTime, {
  parseFormattedTime,
} from "@italodeandra/ui/utils/formatTime";
import useDebounce from "@italodeandra/ui/hooks/useDebouncedValue";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { timesheetTimeClosureAddApi } from "../../../pages/api/timesheet/time-closure/add";
import { closeDialog } from "@italodeandra/ui/components/Dialog";

export function TimeClosureDialogContent({
  dialogId,
  projectId,
}: {
  dialogId: string;
  projectId: string;
}) {
  const form = useForm<{
    users: { _id: string; multiplier: number }[];
    timeClosure: string;
    hourlyRate: number;
  }>();

  const debouncedUsersTimeMultipliers = useDebounce(
    form
      .watch("users")
      ?.map((user) => [user._id, user.multiplier?.toString()].join(","))
      .join(";"),
    "500ms",
  );
  const timesheetTimeClosureGetCurrent =
    timesheetTimeClosureGetCurrentApi.useQuery({
      projectId,
      usersTimeMultipliers: debouncedUsersTimeMultipliers,
    });
  useEffect(() => {
    if (timesheetTimeClosureGetCurrent.data) {
      if (form.watch("users")?.some((user) => !user._id)) {
        form.setValue(
          "users",
          timesheetTimeClosureGetCurrent.data.users.map((user) => ({
            _id: user._id,
            multiplier: user.previousMultiplier || 1,
          })),
        );
      }
      if (!form.watch("hourlyRate")) {
        form.setValue(
          "hourlyRate",
          timesheetTimeClosureGetCurrent.data.hourlyRate || 0,
        );
      }
      const newTimeClosure = formatTime(
        timesheetTimeClosureGetCurrent.data.totalTime || 0,
      );
      if (form.watch("timeClosure") !== newTimeClosure) {
        form.setValue("timeClosure", newTimeClosure);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesheetTimeClosureGetCurrent.data]);

  const timesheetTimeClosureAdd = timesheetTimeClosureAddApi.useMutation({
    onSuccess() {
      closeDialog(dialogId);
    },
  });

  const totalTime = timesheetTimeClosureGetCurrent.data?.totalTime || 0;
  const timeClosure = parseFormattedTime(form.watch("timeClosure"));
  const closurePercentage = Math.round((100 / totalTime) * timeClosure);
  const totalAmount = (timeClosure / 1000 / 60 / 60) * form.watch("hourlyRate");

  const onSubmit = useCallback(() => {
    if (!timesheetTimeClosureAdd.isPending) {
      const values = form.getValues();
      timesheetTimeClosureAdd.mutate({
        ...values,
        projectId,
        time: timeClosure,
        usersMultipliers: values.users,
        carryover: totalTime - timeClosure,
      });
    }
  }, [form, projectId, timeClosure, timesheetTimeClosureAdd, totalTime]);

  form.register("hourlyRate", {
    required: "Fill with the hourly rate",
  });

  if (totalTime === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg bg-zinc-800 px-3 py-2">
          No new timesheet for closure.
        </div>
        <Button
          variant="filled"
          color="gray"
          className="flex-1"
          onClick={() => closeDialog(dialogId)}
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {(timesheetTimeClosureGetCurrent.isLoading ||
        !!timesheetTimeClosureGetCurrent.data?.users.length) && (
        <div className="text-base font-medium">Multipliers</div>
      )}
      {timesheetTimeClosureGetCurrent.isLoading && (
        <Skeleton className="h-[62px]" />
      )}
      {timesheetTimeClosureGetCurrent.data?.users.map((user, index) => {
        form.register(`users.${index}.multiplier`, {
          required: "Fill with the multiplier",
        });

        return (
          <NumericInput
            key={user._id}
            label={`${user.name || user.email} time multiplier`}
            required
            value={form.watch(`users.${index}.multiplier`)}
            onValueChange={(value) =>
              form.setValue(`users.${index}.multiplier`, value.floatValue || 1)
            }
            error={!!form.formState.errors.users?.[index]?.multiplier}
            helpText={form.formState.errors.users?.[index]?.multiplier?.message}
          />
        );
      })}
      <div className="text-base font-medium">Closure</div>
      <Input label="Total Time" readOnly value={formatTime(totalTime)} />
      <Input
        label="Time closure"
        required
        {...form.register("timeClosure", {
          required: "Fill with the time closure",
        })}
        error={!!form.formState.errors.timeClosure}
        helpText={
          form.formState.errors.timeClosure?.message ||
          `Closure of ${closurePercentage}%.${closurePercentage < 100 ? " The rest will be added as Carryover." : ""}`
        }
      />
      <NumericInput
        prefix="$"
        label="Hourly rate"
        required
        value={form.watch("hourlyRate")}
        onValueChange={(value) =>
          form.setValue("hourlyRate", value.floatValue || 0)
        }
        error={!!form.formState.errors.hourlyRate}
        helpText={form.formState.errors.hourlyRate?.message}
      />
      <NumericInput
        prefix="$"
        label="Total amount"
        readOnly
        value={totalAmount}
      />
      <div className="flex w-full gap-2">
        <Button
          variant="filled"
          color="primary"
          className="flex-1"
          type="submit"
          loading={timesheetTimeClosureAdd.isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
