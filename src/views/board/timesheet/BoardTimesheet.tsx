import Button from "@italodeandra/ui/components/Button";
import Table from "@italodeandra/ui/components/Table";
import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CheckIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { FunnelIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import formatTime from "@italodeandra/ui/utils/formatTime";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import { timesheetListApi } from "../../../pages/api/timesheet/list";
import { translateTimesheetType } from "../../../utils/translateTimesheetType";
import Routes from "../../../Routes";
import DatePicker from "@italodeandra/ui/components/DatePicker";
import { useCallback, useState } from "react";
import { ProjectFilter } from "./ProjectFilter";
import { SubProjectFilter } from "./SubProjectFilter";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { AddExpenseDialogContent } from "./AddExpenseDialogContent";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { EditTimesheetDialogContent } from "./EditTimesheetDialogContent";
import { PencilIcon } from "@heroicons/react/24/solid";
import { TimesheetType } from "../../../collections/timesheet";

export function BoardTimesheet({ boardId }: { boardId: string }) {
  const [from, setFrom] = useState<Date | undefined>(
    dayjs().startOf("month").toDate(),
  );
  const [to, setTo] = useState<Date | undefined>(dayjs().endOf("day").toDate());
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedSubProjects, setSelectedSubProjects] = useState<string[]>([]);

  const timesheetList = timesheetListApi.useQuery({
    boardId,
    from: from && dayjs(from).startOf("day").toISOString(),
    to: to && dayjs(to).endOf("day").toISOString(),
    projectsIds: selectedProjects,
    subProjectsIds: selectedSubProjects,
  });

  const handleAddExpenseClick = useCallback(() => {
    const _id = isomorphicObjectId().toString();
    showDialog({
      _id,
      title: "Add expense",
      content: (
        <AddExpenseDialogContent
          dialogId={_id}
          projectId={selectedProjects[0]}
        />
      ),
    });
  }, [selectedProjects]);

  const handleEditTimesheetClick = useCallback(
    (timesheetId: string) => () => {
      const _id = isomorphicObjectId().toString();
      showDialog({
        _id,
        title: "Edit Timesheet",
        content: (
          <EditTimesheetDialogContent
            dialogId={_id}
            timesheetId={timesheetId}
          />
        ),
      });
    },
    [],
  );

  return (
    <div className="px-3">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-3 pb-3">
        <div className="text-2xl font-medium">Timesheet</div>
        <div className="flex gap-2 rounded-lg bg-zinc-900 p-2">
          <FunnelIcon className="mx-1 my-auto h-6 w-6" />
          <DatePicker value={from} onValueChange={setFrom} toDate={to}>
            {(text) => (
              <Button
                variant="light"
                color="gray"
                trailing={<CalendarIcon className="ml-3" />}
              >
                From
                <span className="font-normal">{text ? `: ${text}` : ""}</span>
              </Button>
            )}
          </DatePicker>
          <DatePicker
            value={to}
            onValueChange={setTo}
            fromDate={from}
            toDate={dayjs().endOf("day").toDate()}
          >
            {(text) => (
              <Button
                variant="light"
                color="gray"
                trailing={<CalendarIcon className="ml-3" />}
              >
                To<span className="font-normal">{text ? `: ${text}` : ""}</span>
              </Button>
            )}
          </DatePicker>
          <ProjectFilter
            boardId={boardId}
            selected={selectedProjects}
            setSelected={setSelectedProjects}
          />
          {!!selectedProjects.length && (
            <SubProjectFilter
              boardId={boardId}
              projectsIds={selectedProjects}
              selected={selectedSubProjects}
              setSelected={setSelectedSubProjects}
            />
          )}
          <div className="grow" />
          {selectedProjects.length === 1 && (
            <>
              <Button
                variant="text"
                leading={<PlusIcon />}
                onClick={handleAddExpenseClick}
              >
                Add expense
              </Button>
              <Button
                variant="filled"
                color="success"
                leading={<CheckIcon />}
                disabled={selectedProjects.length !== 1}
              >
                Time Closure
              </Button>
            </>
          )}
        </div>
        <Table hideBorder className="rounded-lg">
          <Table.Head>
            <Table.Row>
              <Table.Cell>Type</Table.Cell>
              <Table.Cell>Description</Table.Cell>
              <Table.Cell>Project</Table.Cell>
              <Table.Cell className="whitespace-nowrap">Sub-project</Table.Cell>
              <Table.Cell className="text-right">MaTime</Table.Cell>
              <Table.Cell className="text-right">Created</Table.Cell>
              <Table.Cell className="text-right">Updated</Table.Cell>
              <Table.Cell />
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {timesheetList.data?.map((timesheet) => (
              <Table.Row key={timesheet._id}>
                <Table.Cell>
                  {translateTimesheetType(timesheet.type)}
                </Table.Cell>
                <Table.Cell>{timesheet.description}</Table.Cell>
                <Table.Cell>{timesheet.project?.name}</Table.Cell>
                <Table.Cell>{timesheet.subProject?.name}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-1 text-right font-medium text-white">
                    {timesheet.time && formatTime(timesheet.time)}
                  </div>
                </Table.Cell>
                <Table.Cell className="text-right">
                  {dayjs(timesheet.createdAt).fromNow()}
                </Table.Cell>
                <Table.Cell className="text-right">
                  {dayjs(timesheet.updatedAt).fromNow()}
                </Table.Cell>
                <Table.Cell>
                  <div className="-m-1 flex justify-end gap-1">
                    {timesheet.type === TimesheetType.EXPENSE && (
                      <Tooltip content="Edit timesheet">
                        <Button
                          icon
                          variant="text"
                          className="p-1"
                          onClick={handleEditTimesheetClick(timesheet._id)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    )}
                    {timesheet.task && (
                      <Tooltip content="Open task in a new tab">
                        <Button
                          icon
                          variant="text"
                          className="p-1"
                          href={Routes.Task(boardId, timesheet.task._id)}
                          target="_blank"
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
            {/*<Table.Row>
              <Table.Cell>Time Closure</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>Majapi</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-end gap-1 text-right font-medium text-white">
                  {formatTime(random(100000, 10000000))}
                </div>
              </Table.Cell>
              <Table.Cell className="text-right">
                {dayjs(new Date()).subtract(1, "day").fromNow()}
              </Table.Cell>
              <Table.Cell className="text-right">
                {dayjs(new Date()).subtract(1, "hour").fromNow()}
              </Table.Cell>
              <Table.Cell>
                <div className="-m-1 flex justify-end gap-1">
                  <Tooltip content="Edit Time Closure">
                    <Button icon variant="text" className="p-1">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Carryover Time</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>Majapi</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-end gap-1 text-right font-medium text-white">
                  {formatTime(random(100000, 10000000))}
                </div>
              </Table.Cell>
              <Table.Cell className="text-right">
                {dayjs(new Date()).subtract(1, "day").fromNow()}
              </Table.Cell>
              <Table.Cell className="text-right">
                {dayjs(new Date()).subtract(1, "hour").fromNow()}
              </Table.Cell>
              <Table.Cell>
                <div className="-m-1 flex justify-end gap-1">
                  <Tooltip content="Edit Carryover Time">
                    <Button icon variant="text" className="p-1">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>
              </Table.Cell>
            </Table.Row>
            {fakeArray(10).map((n) => (
              <Table.Row key={n}>
                <Table.Cell>Task</Table.Cell>
                <Table.Cell>Implement the new Timesheet</Table.Cell>
                <Table.Cell>Done</Table.Cell>
                <Table.Cell>Production</Table.Cell>
                <Table.Cell>Majapi</Table.Cell>
                <Table.Cell>Tasks</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-1 text-right font-medium text-white">
                    {formatTime(random(100000, 10000000))}
                  </div>
                </Table.Cell>
                <Table.Cell className="text-right">
                  {dayjs(new Date()).subtract(1, "day").fromNow()}
                </Table.Cell>
                <Table.Cell className="text-right">
                  {dayjs(new Date()).subtract(1, "hour").fromNow()}
                </Table.Cell>
                <Table.Cell>
                  <div className="-m-1 flex justify-end gap-1">
                    <Tooltip content="Open task in a new tab">
                      <Button icon variant="text" className="p-1">
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </Button>
                    </Tooltip>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}*/}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
