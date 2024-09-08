import getBoard from "../collections/board";
import getTaskColumn from "../collections/taskColumn";
import getTaskStatus from "../collections/taskStatus";
import getProject from "../collections/project";
import getSubProject from "../collections/subProject";
import { userId } from "@italodeandra/auth/db/seed";
import { PermissionLevel } from "../collections/permission";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTeam, { MemberRole } from "../collections/team";
import getTask from "../collections/task";
import getUser from "@italodeandra/auth/collections/user/User";
import getTaskActivity, { ActivityType } from "../collections/taskActivity";
import getTimesheet, { TimesheetType } from "../collections/timesheet";
import dayjs from "dayjs";

export async function devSeed() {
  if (process.env.APP_ENV === "development") {
    const Board = getBoard();
    const TaskColumn = getTaskColumn();
    const TaskStatus = getTaskStatus();
    const Project = getProject();
    const SubProject = getSubProject();
    const Team = getTeam();
    const Task = getTask();
    const User = getUser();
    const TaskActivity = getTaskActivity();
    const Timesheet = getTimesheet();

    const userB = (await User.findOne({
      email: "italodeandra+b@gmail.com",
    }))!;

    const boardId = isomorphicObjectId("66d1d93251475663bffb05fd");

    const team = await Team.upsert(
      {
        name: "Test team",
      },
      {
        $set: {
          members: [{ userId, role: MemberRole.ADMIN }],
        },
      },
    );

    const board = await Board.upsert(
      {
        _id: boardId,
      },
      {
        $set: {
          name: "Test board",
          permissions: [
            { userId: userId, level: PermissionLevel.ADMIN },
            { userId: userB._id, level: PermissionLevel.WRITE },
            { teamId: team._id, level: PermissionLevel.READ },
            {
              public: true,
              level: PermissionLevel.READ,
            },
          ],
        },
      },
    );

    await TaskColumn.upsert(
      {
        title: "Todo",
        boardId: board._id,
      },
      {
        $set: {
          order: 0,
        },
      },
    );
    const columDoing = await TaskColumn.upsert(
      {
        title: "Doing",
        boardId: board._id,
      },
      {
        $set: {
          order: 1,
        },
      },
    );
    await TaskColumn.upsert(
      {
        title: "Done",
        boardId: board._id,
      },
      {
        $set: {
          order: 2,
        },
      },
    );

    await TaskStatus.upsert(
      {
        title: "Todo",
        boardId: board._id,
      },
      {
        $set: {},
      },
    );
    const statusDoing = await TaskStatus.upsert(
      {
        title: "Doing",
        boardId: board._id,
      },
      {
        $set: {},
      },
    );
    await TaskStatus.upsert(
      {
        title: "Done",
        boardId: board._id,
      },
      {
        $set: {},
      },
    );

    const project1 = await Project.upsert(
      {
        name: "Test project",
        boardId: board._id,
      },
      {
        $set: {},
      },
    );
    await Project.upsert(
      {
        name: "Test project 2",
        boardId: board._id,
      },
      {
        $set: {},
      },
    );
    await Project.upsert(
      {
        name: "Test project 3",
        boardId: board._id,
      },
      {
        $set: {},
      },
    );

    const subProject = await SubProject.upsert(
      {
        name: "Test sub-project",
        projectId: project1._id,
      },
      {
        $set: {},
      },
    );

    const task = await Task.upsert(
      {
        _id: isomorphicObjectId("66d3e6c8798581f14ad19f51"),
      },
      {
        $set: {
          title: "Develop tasks",
          order: 0,
          projectId: project1._id,
          subProjectId: subProject._id,
          columnId: columDoing._id,
          statusId: statusDoing._id,
          assignees: [userId, userB._id],
        },
      },
    );

    await TaskActivity.upsert(
      {
        type: ActivityType.CREATE,
      },
      {
        $set: {
          taskId: task._id,
          userId,
        },
      },
    );

    const startedAt = dayjs().subtract(1, "hour");
    const stoppedAt = dayjs();

    await Timesheet.upsert(
      {
        _id: isomorphicObjectId("66dcd2e7adcfce1c6e71fd07"),
      },
      {
        $set: {
          boardId,
          type: TimesheetType.TASK,
          taskId: task._id,
          startedAt: startedAt.toDate(),
          stoppedAt: stoppedAt.toDate(),
          time: stoppedAt.diff(startedAt, "millisecond"),
          userId,
        },
      },
    );
  }
}
