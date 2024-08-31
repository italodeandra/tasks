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

    const boardId = isomorphicObjectId("66d1d93251475663bffb05fd");

    const board = await Board.upsert(
      {
        _id: boardId,
      },
      {
        $set: {
          name: "Test board",
          permissions: [{ userId: userId, level: PermissionLevel.ADMIN }],
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

    const project = await Project.upsert(
      {
        name: "Test project",
        boardId: board._id,
      },
      {
        $set: {},
      },
    );

    const subProject = await SubProject.upsert(
      {
        name: "Test sub-project",
        projectId: project._id,
      },
      {
        $set: {},
      },
    );

    await Team.upsert(
      {
        name: "Test team",
      },
      {
        $set: {
          members: [{ userId, role: MemberRole.ADMIN }],
        },
      },
    );

    const userB = (await User.findOne({
      email: "italodeandra+b@gmail.com",
    }))!;

    await Task.upsert(
      {
        title: "Develop tasks",
      },
      {
        $set: {
          order: 0,
          projectId: project._id,
          subProjectId: subProject._id,
          columnId: columDoing._id,
          statusId: statusDoing._id,
          assignees: [userId, userB._id],
        },
      },
    );
  }
}
