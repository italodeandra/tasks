import {
  TimesheetListFromProjectApiResponse,
  useTimesheetListFromProject,
} from "../../../../pages/api/timesheet/list-from-project";
import React, { useMemo, useState } from "react";
import { ProjectListApiResponse } from "../../../../pages/api/project/list";
import { useTimesheetDelete } from "../../../../pages/api/timesheet/delete";
import DataTable, {
  DataTableProps,
} from "@italodeandra/ui/components/Table/DataTable";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Button from "@italodeandra/ui/components/Button/Button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { TimesheetItem } from "./TimesheetItem";
import Text from "@italodeandra/ui/components/Text";
import { closeDialog, showDialog } from "@italodeandra/ui/components/Dialog";
import { prettyMilliseconds } from "../../../../utils/prettyMilliseconds";
import dayjs from "dayjs";
import copy2DToClipboard from "@italodeandra/ui/utils/copy2DToClipboard";
import { translateTimesheetType } from "../../../../utils/translateTimesheetType";
import Group from "@italodeandra/ui/components/Group/Group";
import { TimesheetAddDialog } from "./TimesheetAddDialog";

export function Timesheet({ project }: { project: ProjectListApiResponse[0] }) {
  let [startDate, setStartDate] = useState(() => new Date());
  let { data: timesheet, isLoading } = useTimesheetListFromProject({
    projectId: project._id,
    startDate,
  });

  let { mutate: deleteTimesheet, isLoading: isDeleting } = useTimesheetDelete();

  let columns = useMemo<
    DataTableProps<TimesheetListFromProjectApiResponse["data"][0]>["columns"]
  >(
    () => [
      {
        title: "Time",
        render: (item) => <TimesheetItem timesheet={item} />,
      },
      {
        title: "Type",
        render: (item) => translateTimesheetType(item.type),
      },
      {
        title: "Descrição",
        render: (item) => item.task?.content,
        cellClassName: "max-w-[300px] truncate",
      },
      {
        title: "Data",
        render: (item) => dayjs(item.createdAt).format("lll"),
      },
    ],
    []
  );

  let { totalClocked, totalPaid, pendingPayment } = useMemo(() => {
    let totalClocked = timesheet?.timeClocked || 0;
    let totalPaid = timesheet?.timePaid || 0;
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
    <Stack className="w-full p-4">
      <DataTable
        title={
          <Group className="items-center gap-4">
            <span>Timesheet {project.name}</span>
            <Group className="mx-auto items-center">
              <Button
                icon
                size="sm"
                onClick={() =>
                  setStartDate(dayjs(startDate).subtract(1, "month").toDate())
                }
              >
                <ChevronLeftIcon />
              </Button>
              <Text className="w-[8rem] text-center text-sm">
                {dayjs(startDate).format("MMMM YYYY")}
              </Text>
              <Button
                icon
                size="sm"
                onClick={() =>
                  setStartDate(dayjs(startDate).add(1, "month").toDate())
                }
              >
                <ChevronRightIcon />
              </Button>
            </Group>
          </Group>
        }
        data={timesheet?.data}
        columns={columns}
        autoHeight
        headerContent={
          <Button icon onClick={handleAddClick}>
            <PlusIcon />
          </Button>
        }
        isLoading={isLoading || isDeleting}
        actions={[
          {
            title: "Copy",
            icon: <ClipboardIcon />,
            onClick: (item) =>
              copy2DToClipboard([
                [
                  item.time ? prettyMilliseconds(item.time) : "",
                  item.task?.content || "",
                  dayjs(item.createdAt).format("lll"),
                ],
              ]),
          },
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
          <Text>{prettyMilliseconds(pendingPayment)}</Text>
        </div>
      </div>
    </Stack>
  );
}
