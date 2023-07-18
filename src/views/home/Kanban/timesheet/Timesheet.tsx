import {
  TimesheetListFromProjectApiResponse,
  useTimesheetListFromProject,
} from "../../../../pages/api/timesheet/list-from-project";
import React, { useMemo } from "react";
import { ProjectListApiResponse } from "../../../../pages/api/project/list";
import { useTimesheetDelete } from "../../../../pages/api/timesheet/delete";
import DataTable, {
  DataTableProps,
} from "@italodeandra/ui/components/Table/DataTable";
import { TimesheetType } from "../../../../collections/timesheet";
import _ from "lodash";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Button from "@italodeandra/ui/components/Button/Button";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { formatMoney } from "../../../../utils/formatMoney";
import { TimesheetItem } from "./TimesheetItem";
import Text from "@italodeandra/ui/components/Text";
import { closeDialog, showDialog } from "@italodeandra/ui/components/Dialog";
import Input from "@italodeandra/ui/components/Input/Input";
import { useForm } from "react-hook-form";
import { useTimesheetAdd } from "../../../../pages/api/timesheet/add";
import { prettyMilliseconds } from "../../../../utils/prettyMilliseconds";

interface FieldValues {
  type: TimesheetType;
  time: string;
}

function TimesheetAddDialog({
  projectId,
  onSubmit: onSubmitDialog,
}: {
  projectId: string;
  onSubmit: () => void;
}) {
  let { mutate, isLoading } = useTimesheetAdd({
    onSuccess() {
      onSubmitDialog();
    },
  });

  let {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>({
    defaultValues: {
      type: TimesheetType.MANUAL,
    },
  });

  function onSubmit(values: FieldValues) {
    if (!isLoading) {
      mutate({
        ...values,
        projectId,
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
            required: "Select the type",
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
            required: "Fill with the time",
          })}
          error={!!errors.time}
          helpText={errors.time?.message}
        />
        <Button variant="filled" type="submit">
          Save
        </Button>
      </Stack>
    </form>
  );
}

export function Timesheet({ project }: { project: ProjectListApiResponse[0] }) {
  let { data: timesheet, isLoading } = useTimesheetListFromProject({
    projectId: project._id,
  });

  let { mutate: deleteTimesheet, isLoading: isDeleting } = useTimesheetDelete();

  let columns = useMemo<
    DataTableProps<TimesheetListFromProjectApiResponse[0]>["columns"]
  >(
    () => [
      {
        title: "Time",
        render: (item) => <TimesheetItem timesheet={item} />,
      },
      {
        title: "Type",
        render: (item) =>
          ({
            [TimesheetType.CLOCK_IN_OUT]: "Clock in/out",
            [TimesheetType.MANUAL]: "Manual",
            [TimesheetType.PAYMENT]: "Payment",
          }[item.type]),
      },
    ],
    []
  );

  let { totalClocked, totalPaid, pendingPayment } = useMemo(() => {
    let totalClocked = _(timesheet)
      .filter(
        (t) =>
          [TimesheetType.CLOCK_IN_OUT, TimesheetType.MANUAL].includes(t.type) &&
          !!t.time
      )
      .map("time")
      .sum();
    let totalPaid = _(timesheet)
      .filter((t) => t.type === TimesheetType.PAYMENT && !!t.time)
      .map("time")
      .sum();
    let pendingPayment = totalClocked - totalPaid;
    return { totalClocked, totalPaid, pendingPayment };
  }, [timesheet]);

  let handleAddClick = () => {
    showDialog({
      title: `Add time to ${project.name}`,
      content: (_id) => (
        <TimesheetAddDialog
          projectId={project._id}
          onSubmit={() => closeDialog(_id)}
        />
      ),
    });
  };

  return (
    <Stack>
      <DataTable
        title={`Timesheet ${project.name}`}
        data={timesheet}
        columns={columns}
        headerContent={
          <Button icon onClick={handleAddClick}>
            <PlusIcon />
          </Button>
        }
        isLoading={isLoading || isDeleting}
        actions={[
          {
            title: "Delete",
            icon: <TrashIcon />,
            onClick: (item) => deleteTimesheet(item),
          },
        ]}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Text variant="label">Total clocked</Text>
          <Text>{prettyMilliseconds(totalClocked)}</Text>
        </div>
        <div>
          <Text variant="label">Total paid</Text>
          <Text>{prettyMilliseconds(totalPaid)}</Text>
        </div>
        <div>
          <Text variant="label">Pending payment</Text>
          <Text>
            {prettyMilliseconds(pendingPayment)} (
            {formatMoney((pendingPayment / 3600000) * 150)})
          </Text>
        </div>
      </div>
    </Stack>
  );
}
