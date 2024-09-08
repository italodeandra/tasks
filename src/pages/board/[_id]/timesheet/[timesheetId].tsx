import { GetServerSideProps } from "next";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { getCookies } from "cookies-next";
import {
  AuthUserGetApiResponse,
  setData_authGetUser,
} from "@italodeandra/auth/api/getUser";
import bsonToJson from "@italodeandra/next/utils/bsonToJson";
import { connectDb } from "../../../../db";
import { QueryClient } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/query-core";
import { useRouter } from "next/router";
import { TimesheetClosure } from "../../../../views/board/timesheet/closure/TimesheetClosure";
import { timesheetTimeClosureGetApi } from "../../../api/timesheet/time-closure/get";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const queryClient = new QueryClient();

  await connectDb();
  const user = await getUserFromCookies(req, res);

  setData_authGetUser(queryClient, user as unknown as AuthUserGetApiResponse);

  const timesheetId = params?.timesheetId as string;

  await timesheetTimeClosureGetApi.prefetchQuery(
    queryClient,
    {
      _id: timesheetId,
    },
    req,
    res,
  );

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
  const timesheetId = router.query.timesheetId as string;

  return <TimesheetClosure boardId={_id} timesheetId={timesheetId} />;
}
