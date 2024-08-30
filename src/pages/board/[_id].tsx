import { GetServerSideProps } from "next";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { getCookies } from "cookies-next";
import {
  AuthUserGetApiResponse,
  setData_authGetUser,
} from "@italodeandra/auth/api/getUser";
import bsonToJson from "@italodeandra/next/utils/bsonToJson";
import { connectDb } from "../../db";
import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/query-core";
import { Board } from "../../views/board/Board";
import Routes from "../../Routes";
import isomorphicObjectId from "@italodeandra/next/utils/isomorphicObjectId";
import getBoard from "../../collections/board";
import { PermissionLevel } from "../../collections/permission";
import { boardGetApi } from "../api/board/get";
import { useRouter } from "next/router";
import { getLayout } from "../../views/layout/layout";
import { BoardTitle } from "../../views/board/BoardTitle";
import { taskListApi } from "../api/task/list";
import getTaskColumn from "../../collections/taskColumn";
import getTaskStatus from "../../collections/taskStatus";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const queryClient = new QueryClient();
  const Board = getBoard();
  const TaskColumn = getTaskColumn();
  const TaskStatus = getTaskStatus();

  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    return {
      redirect: {
        destination: Routes.SignIn,
        permanent: false,
      },
    };
  }

  setData_authGetUser(queryClient, user as unknown as AuthUserGetApiResponse);

  const _id = params?._id as string;

  if (_id === "new") {
    const newBoardId = isomorphicObjectId();
    const newBoardDoc = {
      _id: newBoardId,
      name: "New board",
      permissions: [
        {
          userId: user._id,
          level: PermissionLevel.ADMIN,
        },
      ],
    };
    await Board.insertOne(newBoardDoc);

    await TaskColumn.insertMany([
      {
        boardId: newBoardId,
        title: "Todo",
        order: 1,
      },
      {
        boardId: newBoardId,
        title: "Doing",
        order: 2,
      },
      {
        boardId: newBoardId,
        title: "Done",
        order: 3,
      },
    ]);

    await TaskColumn.insertMany([
      {
        boardId: newBoardId,
        title: "Todo",
        order: 1,
      },
      {
        boardId: newBoardId,
        title: "Doing",
        order: 2,
      },
      {
        boardId: newBoardId,
        title: "Done",
        order: 3,
      },
    ]);

    await TaskStatus.insertMany([
      {
        boardId: newBoardId,
        title: "Todo",
      },
      {
        boardId: newBoardId,
        title: "Doing",
      },
      {
        boardId: newBoardId,
        title: "Done",
      },
    ]);

    return {
      redirect: {
        destination: Routes.Board(newBoardId.toString()),
        permanent: false,
      },
    };
  }

  await boardGetApi.prefetchQuery(
    queryClient,
    {
      _id,
    },
    req,
    res,
  );
  await taskListApi.prefetchQuery(
    queryClient,
    {
      boardId: _id,
    },
    req,
    res,
  );

  if (!boardGetApi.getQueryData(queryClient, { _id })) {
    return {
      redirect: {
        destination: Routes.Home,
        permanent: false,
      },
    };
  }

  await taskListApi.prefetchQuery(queryClient, { boardId: _id }, req, res);

  return {
    props: {
      cookies: getCookies({ req, res }),
      dehydratedState: bsonToJson(dehydrate(queryClient)),
    },
  };
};

export default function Page() {
  const router = useRouter();

  const _id = router.query._id as string;

  return <Board _id={_id} />;
}

Page.getLayout = getLayout;
Page.layoutProps = {
  headerContent: <BoardTitle />,
};
