import { connectDb } from "../db";
import { GetServerSideProps } from "next";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import routes from "../Routes";
import { deleteCookie, getCookies } from "cookies-next";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { AuthUserGetApiResponse, setData_authGetUser } from "@italodeandra/auth/api/getUser";
import bsonToJson from "@italodeandra/next/utils/bsonToJson";
import getLayout from "../views/layout/layout";
import { HomeView } from "../views/home/HomeView";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!user) {
    deleteCookie("auth", { req, res });
    return {
      redirect: {
        destination: routes.SignIn,
        permanent: false
      }
    };
  }

  const queryClient = new QueryClient();
  setData_authGetUser(queryClient, user as unknown as AuthUserGetApiResponse);

  return {
    props: {
      cookies: getCookies({ req, res }),
      dehydratedState: bsonToJson(dehydrate(queryClient))
    }
  };
};

export default function Index() {
  return <HomeView />;
}

Index.getLayout = getLayout;
