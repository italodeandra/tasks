import getBoard from "../collections/board";
import getTaskColumn from "../collections/taskColumn";
import getTaskStatus from "../collections/taskStatus";
import getProject from "../collections/project";
import getSubProject from "../collections/subProject";
import { userId } from "@italodeandra/auth/db/seed";
import { PermissionLevel } from "../collections/permission";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getTeam, { MemberRole } from "../collections/team";

export async function devSeed() {
  if (process.env.APP_ENV === "development") {
    const Board = getBoard();
    const TaskColumn = getTaskColumn();
    const TaskStatus = getTaskStatus();
    const Project = getProject();
    const SubProject = getSubProject();
    const Team = getTeam();

    const boardId = isomorphicObjectId("66d1d93251475663bffb05fd");

    const board = (await Board.findOneAndUpdate(
      {
        _id: boardId,
      },
      {
        $set: {
          name: "Test board",
          permissions: [{ userId: userId, level: PermissionLevel.ADMIN }],
        },
      },
      { upsert: true },
    ))!;

    await TaskColumn.findOneAndUpdate(
      {
        title: "Todo",
        boardId: board._id,
      },
      {
        $set: {
          order: 0,
        },
      },
      { upsert: true },
    );
    await TaskColumn.findOneAndUpdate(
      {
        title: "Doing",
        boardId: board._id,
      },
      {
        $set: {
          order: 1,
        },
      },
      { upsert: true },
    );
    await TaskColumn.findOneAndUpdate(
      {
        title: "Done",
        boardId: board._id,
      },
      {
        $set: {
          order: 2,
        },
      },
      { upsert: true },
    );

    await TaskStatus.findOneAndUpdate(
      {
        title: "Todo",
        boardId: board._id,
      },
      {
        $set: {},
      },
      { upsert: true },
    );
    await TaskStatus.findOneAndUpdate(
      {
        title: "Doing",
        boardId: board._id,
      },
      {
        $set: {},
      },
      { upsert: true },
    );
    await TaskStatus.findOneAndUpdate(
      {
        title: "Done",
        boardId: board._id,
      },
      {
        $set: {},
      },
      { upsert: true },
    );

    const project = (await Project.findOneAndUpdate(
      {
        name: "Test project",
        boardId: board._id,
      },
      {
        $set: {},
      },
      { upsert: true },
    ))!;

    await SubProject.findOneAndUpdate(
      {
        name: "Test sub-project",
        projectId: project._id,
      },
      {
        $set: {},
      },
      { upsert: true },
    );

    await Team.findOneAndUpdate(
      {
        name: "Test team",
      },
      {
        $set: {
          members: [{ userId, role: MemberRole.ADMIN }],
        },
      },
      {
        upsert: true,
      },
    );
  }
}
