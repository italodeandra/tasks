import { GetServerSideProps } from "next";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { getCookies } from "cookies-next";
import {
  AuthUserGetApiResponse,
  setData_authGetUser,
} from "@italodeandra/auth/api/getUser";
import bsonToJson from "@italodeandra/next/utils/bsonToJson";
import { connectDb } from "../../../db";
import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/query-core";
import Routes from "../../../Routes";
import { boardGetApi } from "../../api/board/get";
import { useRouter } from "next/router";
import { getLayout } from "../../../views/layout/layout";
import { BoardTitle } from "../../../views/board/title/BoardTitle";
import { BoardTimesheet } from "../../../views/board/timesheet/BoardTimesheet";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const queryClient = new QueryClient();

  await connectDb();
  const user = await getUserFromCookies(req, res);

  setData_authGetUser(queryClient, user as unknown as AuthUserGetApiResponse);

  const _id = params?._id as string;

  await boardGetApi.prefetchQuery(
    queryClient,
    {
      _id,
    },
    req,
    res,
  );

  const board = boardGetApi.getQueryData(queryClient, { _id });

  if (!board) {
    return {
      redirect: {
        destination: Routes.Home,
        permanent: false,
      },
    };
  }

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

  return <BoardTimesheet boardId={_id} />;
}

Page.getLayout = getLayout;
Page.layoutProps = {
  headerContent: <BoardTitle route="timesheet" />,
};
