import { TrelloView } from "../views/trello/TrelloView";
import { GetServerSideProps } from "next";
import { connectDb } from "../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { deleteCookie, getCookies } from "cookies-next";
import routes from "../Routes";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import {
  AuthUserGetApiResponse,
  setData_authGetUser,
} from "@italodeandra/auth/api/getUser";
import bsonToJson from "@italodeandra/next/utils/bsonToJson";
import { taskListApi } from "./api/task2/list";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const queryClient = new QueryClient();

  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    deleteCookie("auth", { req, res });
    return {
      redirect: {
        destination: routes.SignIn,
        permanent: false,
      },
    };
  }

  setData_authGetUser(queryClient, user as unknown as AuthUserGetApiResponse);

  await taskListApi.prefetchQuery(queryClient, undefined, req, res);

  return {
    props: {
      cookies: getCookies({ req, res }),
      dehydratedState: bsonToJson(dehydrate(queryClient)),
    },
  };
};

export default function Page() {
  return <TrelloView />;
}
