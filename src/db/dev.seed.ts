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
import papr from "@italodeandra/next/db";

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

    await User.updateOne(
      {
        email: "italodeandra@gmail.com",
      },
      {
        $set: {
          profilePicture: "https://i.imgur.com/Bqg81fX.png",
        },
      },
    );

    const userB = (await User.findOneAndUpdate(
      {
        email: "italodeandra+b@gmail.com",
      },
      {
        $set: {
          profilePicture: "https://i.imgur.com/GUmpdgL.png",
          name: "Cairo Andrade",
        },
        $unset: {
          // profilePicture: "",
        },
      },
    ))!;

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
    const columnDone = await TaskColumn.upsert(
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

    await TaskColumn.upsert(
      {
        title: "Column 1",
        boardId: board._id,
      },
      {
        $set: {
          order: 3,
        },
      },
    );

    await TaskColumn.upsert(
      {
        title: "Column 2",
        boardId: board._id,
      },
      {
        $set: {
          order: 4,
        },
      },
    );

    await TaskColumn.upsert(
      {
        title: "Column 3",
        boardId: board._id,
      },
      {
        $set: {
          order: 5,
        },
      },
    );

    await TaskColumn.upsert(
      {
        title: "Column 4",
        boardId: board._id,
      },
      {
        $set: {
          order: 6,
        },
      },
    );

    await TaskColumn.upsert(
      {
        title: "Column 5",
        boardId: board._id,
      },
      {
        $set: {
          order: 7,
        },
      },
    );

    await TaskColumn.upsert(
      {
        title: "Column 6",
        boardId: board._id,
      },
      {
        $set: {
          order: 8,
        },
      },
    );

    await TaskColumn.upsert(
      {
        title: "Column 7",
        boardId: board._id,
      },
      {
        $set: {
          order: 9,
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
    const statusDone = await TaskStatus.upsert(
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
    const project2 = await Project.upsert(
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
          projectId: project1._id,
          subProjectId: subProject._id,
          columnId: columDoing._id,
          statusId: statusDoing._id,
          assignees: [userId, userB._id],
        },
      },
    );

    const task2 = await Task.upsert(
      {
        _id: isomorphicObjectId("66dd2528a20a163184c7b1c8"),
      },
      {
        $set: {
          title: "Shared task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columDoing._id,
          statusId: statusDoing._id,
        },
      },
    );

    await Task.upsert(
      {
        _id: isomorphicObjectId("66e0aa3f85a44b9dc61f9e1e"),
      },
      {
        $set: {
          title: "Third Doing task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columDoing._id,
          statusId: statusDoing._id,
        },
      },
    );

    await Task.upsert(
      {
        _id: isomorphicObjectId("66ff1ce4cf01c33f5889fdf0"),
      },
      {
        $set: {
          title: "4 Doing task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columDoing._id,
          statusId: statusDoing._id,
        },
      },
    );

    await Task.upsert(
      {
        _id: isomorphicObjectId("66ff1d068114b17d98ffc796"),
      },
      {
        $set: {
          title: "5 Doing task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columDoing._id,
          statusId: statusDoing._id,
        },
      },
    );

    await Task.upsert(
      {
        _id: isomorphicObjectId("66ff1d01e6b035944d47655e"),
      },
      {
        $set: {
          title: "6 Doing task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columDoing._id,
          statusId: statusDoing._id,
        },
      },
    );

    await Task.upsert(
      {
        _id: isomorphicObjectId("66ff1d1ce052ab5753b71f3f"),
      },
      {
        $set: {
          title: "7 Doing task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columDoing._id,
          statusId: statusDoing._id,
        },
      },
    );

    await Task.upsert(
      {
        _id: isomorphicObjectId("66ff1d3d367c8c0819a27357"),
      },
      {
        $set: {
          title: "8 Doing task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columDoing._id,
          statusId: statusDoing._id,
        },
      },
    );

    await Task.upsert(
      {
        _id: isomorphicObjectId("66ff1d48dfbd3cf644be07b6"),
      },
      {
        $set: {
          title: "9 Doing task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columDoing._id,
          statusId: statusDoing._id,
        },
      },
    );

    await Task.upsert(
      {
        _id: isomorphicObjectId("66ff1d5a7e967c607d00ab36"),
      },
      {
        $set: {
          title: "10 Doing task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columDoing._id,
          statusId: statusDoing._id,
        },
      },
    );

    await Task.upsert(
      {
        _id: isomorphicObjectId("66e0907d09610a3aae3a09b9"),
      },
      {
        $set: {
          title: "Done task",
          projectId: project2._id,
          secondaryProjectsIds: [project1._id],
          columnId: columnDone._id,
          statusId: statusDone._id,
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

    await Timesheet.upsert(
      {
        _id: isomorphicObjectId("66dd25377d4e76c43605d90b"),
      },
      {
        $set: {
          boardId,
          type: TimesheetType.TASK,
          taskId: task2._id,
          startedAt: startedAt.toDate(),
          stoppedAt: stoppedAt.toDate(),
          time: stoppedAt.diff(startedAt, "millisecond"),
          userId,
        },
      },
    );
  }

  await papr.updateSchemas();
}
