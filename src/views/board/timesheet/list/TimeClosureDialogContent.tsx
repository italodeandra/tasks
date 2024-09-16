import Input from "@italodeandra/ui/components/Input";
import Button from "@italodeandra/ui/components/Button";
import NumericInput from "@italodeandra/ui/components/Input/NumericInput";
import { timesheetTimeClosureGetNextApi } from "../../../../pages/api/timesheet/time-closure/get-next";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import formatTime, {
  parseFormattedTime,
} from "@italodeandra/ui/utils/formatTime";
import useDebounce from "@italodeandra/ui/hooks/useDebouncedValue";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { timesheetTimeClosureAddApi } from "../../../../pages/api/timesheet/time-closure/add";
import { closeDialog } from "@italodeandra/ui/components/Dialog";
import Routes from "../../../../Routes";
import { useRouter } from "next/router";

export function TimeClosureDialogContent({
  dialogId,
  projectId,
}: {
  dialogId: string;
  projectId: string;
}) {
  const form = useForm<{
    users: { _id: string; multiplier: number; overheadRate: number }[];
    timeClosure: string;
    hourlyRate: number;
  }>();

  const debouncedUsersTimeMultipliers = useDebounce(
    JSON.stringify(form.watch("users")),
    "500ms",
  );
  const timesheetTimeClosureGetNext = timesheetTimeClosureGetNextApi.useQuery({
    projectId,
    usersTimeMultipliers: debouncedUsersTimeMultipliers,
  });
  useEffect(() => {
    if (timesheetTimeClosureGetNext.data) {
      if (form.watch("users")?.some((user) => !user._id)) {
        form.setValue(
          "users",
          timesheetTimeClosureGetNext.data.users.map((user) => ({
            _id: user._id,
            multiplier: user.previousMultiplier || 1,
            overheadRate: user.previousOverheadRate || 0,
          })),
        );
      }
      if (!form.watch("hourlyRate")) {
        form.setValue(
          "hourlyRate",
          timesheetTimeClosureGetNext.data.hourlyRate || 0,
        );
      }
      const newTimeClosure = formatTime(
        timesheetTimeClosureGetNext.data.totalTime || 0,
      );
      if (form.watch("timeClosure") !== newTimeClosure) {
        form.setValue("timeClosure", newTimeClosure || "0s");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesheetTimeClosureGetNext.data]);

  const router = useRouter();
  const timesheetTimeClosureAdd = timesheetTimeClosureAddApi.useMutation({
    async onSuccess(data) {
      closeDialog(dialogId);
      await router.push(Routes.TimesheetClosure(data.boardId, data._id));
    },
  });

  const totalTime = timesheetTimeClosureGetNext.data?.totalTime || 0;
  const closureTime = parseFormattedTime(form.watch("timeClosure")) || 0;
  const closurePercentage = Math.round(
    (100 / Math.round(totalTime / 2000)) * Math.round(closureTime / 2000),
  );
  const totalAmount = (closureTime / 1000 / 60 / 60) * form.watch("hourlyRate");

  const onSubmit = useCallback(() => {
    if (!timesheetTimeClosureAdd.isPending) {
      const values = form.getValues();
      timesheetTimeClosureAdd.mutate({
        ...values,
        projectId,
        usersMultipliers: values.users,
        totalTime,
        closureTime,
      });
    }
  }, [closureTime, form, projectId, timesheetTimeClosureAdd, totalTime]);

  form.register("hourlyRate", {
    required: "Fill with the hourly rate",
  });

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {(timesheetTimeClosureGetNext.isLoading ||
        !!timesheetTimeClosureGetNext.data?.users.length) && (
        <div className="text-base font-medium">Multipliers</div>
      )}
      {timesheetTimeClosureGetNext.isLoading && (
        <Skeleton className="h-[62px]" />
      )}
      {timesheetTimeClosureGetNext.data?.users.map((user, index) => {
        form.register(`users.${index}.multiplier`, {
          required: "Fill with the multiplier",
        });

        return (
          <div key={user._id}>
            <div>{user.name || user.email}</div>
            <div className="flex gap-3">
              <NumericInput
                label="Time multiplier"
                required
                value={form.watch(`users.${index}.multiplier`)}
                onValueChange={(value) =>
                  form.setValue(
                    `users.${index}.multiplier`,
                    value.floatValue || 0,
                  )
                }
                error={!!form.formState.errors.users?.[index]?.multiplier}
                helpText={
                  form.formState.errors.users?.[index]?.multiplier?.message
                }
              />
              <NumericInput
                label="Overhead rate"
                required
                value={form.watch(`users.${index}.overheadRate`)}
                onValueChange={(value) =>
                  form.setValue(
                    `users.${index}.overheadRate`,
                    value.floatValue || 0,
                  )
                }
                error={!!form.formState.errors.users?.[index]?.overheadRate}
                helpText={
                  form.formState.errors.users?.[index]?.overheadRate?.message
                }
              />
            </div>
          </div>
        );
      })}
      <div className="text-base font-medium">Closure</div>
      <Input
        label="Total Time"
        readOnly
        value={formatTime(totalTime) || "0s"}
      />
      <Input
        label="Time closure"
        required
        {...form.register("timeClosure", {
          required: "Fill with the time closure",
        })}
        error={!!form.formState.errors.timeClosure}
        helpText={
          form.formState.errors.timeClosure?.message ||
          !isNaN(closurePercentage)
            ? `Closure of ${closurePercentage}%.${closurePercentage < 100 ? " The rest will be added as Carryover." : ""}`
            : undefined
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
