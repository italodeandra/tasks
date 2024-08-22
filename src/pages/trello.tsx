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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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

  const queryClient = new QueryClient();
  setData_authGetUser(queryClient, user as unknown as AuthUserGetApiResponse);

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
