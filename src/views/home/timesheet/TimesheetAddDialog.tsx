import { useTimesheetAdd } from "../../../pages/api/timesheet/add";
import { useForm } from "react-hook-form";
import { TimesheetType } from "../../../collections/timesheet";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Input from "@italodeandra/ui/components/Input/Input";
import Button from "@italodeandra/ui/components/Button/Button";
import React from "react";

interface FieldValues {
  type: TimesheetType;
  time: string;
  description: string;
}

export function TimesheetAddDialog({
                                     projectId,
                                     onSubmit: onSubmitDialog
                                   }: {
  projectId: string;
  onSubmit: () => void;
}) {
  const { mutate, isPending } = useTimesheetAdd({
    onSuccess() {
      onSubmitDialog();
    }
  });

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm<FieldValues>({
    defaultValues: {
      type: TimesheetType.MANUAL
    }
  });

  function onSubmit(values: FieldValues) {
    if (!isPending) {
      mutate({
        ...values,
        projectId
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack className="text-left">
        <Input
          label="Type"
          select
          {...register("type", {
            required: "Select the type"
          })}
          required
          error={!!errors.type}
          helpText={errors.type?.message}
        >
          <option value={TimesheetType.MANUAL}>Manual</option>
          <option value={TimesheetType.PAYMENT}>Payment</option>
        </Input>
        <Input
          label="Time"
          required
          {...register("time", {
            required: "Fill with the time"
          })}
          error={!!errors.time}
          helpText={errors.time?.message}
        />
        <Input
          label="Description"
          {...register("description")}
          error={!!errors.description}
          helpText={errors.description?.message}
        />
        <Button variant="filled" color="primary" type="submit">
          Save
        </Button>
      </Stack>
    </form>
  );
}
