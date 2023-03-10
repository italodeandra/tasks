import { connectDb } from "../db";
import { GetServerSideProps } from "next";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import routes from "../routes";
import { getCookies } from "cookies-next";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import {
  AuthUserGetApiResponse,
  setData_authGetUser,
} from "@italodeandra/auth/api/getUser";
import bsonToJson from "@italodeandra/next/utils/bsonToJson";
import getLayout from "../views/layout";
import { HomeView } from "../views/home/HomeView";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    return {
      redirect: {
        destination: routes.SignIn,
        permanent: false,
      },
    };
  }

  let queryClient = new QueryClient();
  setData_authGetUser(queryClient, user as AuthUserGetApiResponse);

  return {
    props: {
      cookies: getCookies({ req, res }),
      dehydratedState: bsonToJson(dehydrate(queryClient)),
    },
  };
};

export default function Index() {
  return <HomeView />;
}

Index.getLayout = getLayout;
