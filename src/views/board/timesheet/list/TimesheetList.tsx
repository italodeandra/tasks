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
import { timesheetListApi } from "../../../../pages/api/timesheet/list";
import { translateTimesheetType } from "../../../../utils/translateTimesheetType";
import Routes from "../../../../Routes";
import DatePicker from "@italodeandra/ui/components/DatePicker";
import { useCallback, useState } from "react";
import { ProjectFilter } from "./ProjectFilter";
import { SubProjectFilter } from "./SubProjectFilter";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { AddExpenseDialogContent } from "./AddExpenseDialogContent";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import { EditTimesheetDialogContent } from "./EditTimesheetDialogContent";
import { PencilIcon } from "@heroicons/react/24/solid";
import { TimesheetType } from "../../../../collections/timesheet";
import fakeArray from "@italodeandra/ui/utils/fakeArray";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { TimeClosureDialogContent } from "./TimeClosureDialogContent";
import { reactQueryDialogContentProps } from "../../../../utils/reactQueryDialogContentProps";
import { UserAvatarAndName } from "../../../../components/UserAvatarAndName";

export function TimesheetList({ boardId }: { boardId: string }) {
  const [defaultFrom] = useState(() => dayjs().startOf("month").toDate());
  const [defaultTo] = useState(() => dayjs().startOf("day").toDate());

  const [from, setFrom] = useState<Date | undefined>(defaultFrom);
  const [to, setTo] = useState<Date | undefined>(defaultTo);
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

  const handleTimeClosureClick = useCallback(() => {
    const _id = isomorphicObjectId().toString();
    showDialog({
      _id,
      title: "Time Closure",
      content: (
        <TimeClosureDialogContent
          dialogId={_id}
          projectId={selectedProjects[0]}
        />
      ),
      contentProps: reactQueryDialogContentProps,
    });
  }, [selectedProjects]);

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
                color={!dayjs(from).isSame(defaultFrom) ? "primary" : "gray"}
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
                color={!dayjs(to).isSame(defaultTo) ? "primary" : "gray"}
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
          {selectedProjects.length === 1 &&
            selectedSubProjects.length === 0 && (
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
                  onClick={handleTimeClosureClick}
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
              <Table.Cell className="text-right">Time</Table.Cell>
              <Table.Cell>User</Table.Cell>
              <Table.Cell>Created</Table.Cell>
              <Table.Cell>Updated</Table.Cell>
              <Table.Cell />
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {timesheetList.isLoading && (
              <Table.Row>
                {fakeArray(9).map((n) => (
                  <Table.Cell key={n}>
                    <Skeleton className="my-0.5 h-[17px]" />
                  </Table.Cell>
                ))}
              </Table.Row>
            )}
            {!timesheetList.isLoading && !timesheetList.data?.length && (
              <Table.Row>
                <Table.Cell colSpan={9}>
                  <span className="font-normal opacity-50">
                    No timesheet found
                  </span>
                </Table.Cell>
              </Table.Row>
            )}
            {timesheetList.data?.map((timesheet) => (
              <Table.Row key={timesheet._id}>
                <Table.Cell>
                  {translateTimesheetType(timesheet.type)}
                </Table.Cell>
                <Table.Cell>
                  {timesheet.description}
                  {timesheet.task?.archived ? (
                    <span className="opacity-50"> (archived)</span>
                  ) : null}
                </Table.Cell>
                <Table.Cell>
                  {timesheet.primaryProject
                    ? `${timesheet.primaryProject.name} + `
                    : ""}
                  {timesheet.project?.name}
                </Table.Cell>
                <Table.Cell>{timesheet.subProject?.name}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-1 text-right font-medium text-white">
                    {timesheet.time && formatTime(timesheet.time)}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {timesheet.user && (
                    <UserAvatarAndName
                      {...timesheet.user}
                      className="-my-1"
                      avatarClassName="w-5 h-5"
                      nameClassName="mt-0"
                    />
                  )}
                </Table.Cell>
                <Table.Cell>{dayjs(timesheet.createdAt).fromNow()}</Table.Cell>
                <Table.Cell>{dayjs(timesheet.updatedAt).fromNow()}</Table.Cell>
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
                    {timesheet.type === TimesheetType.CLOSURE && (
                      <Tooltip content="Time closure">
                        <Button
                          icon
                          variant="text"
                          className="p-1"
                          href={Routes.TimesheetClosure(boardId, timesheet._id)}
                        >
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    )}
                    {timesheet.task && !timesheet.task.archived && (
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
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
