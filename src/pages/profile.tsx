import { GetServerSideProps } from "next";
import { connectDb } from "../db";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { getCookies } from "cookies-next";
import routes from "../Routes";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import {
  AuthUserGetApiResponse,
  setData_authGetUser,
} from "@italodeandra/auth/api/getUser";
import bsonToJson from "@italodeandra/next/utils/bsonToJson";
import { getLayout } from "../views/layout/layout";
import { EditProfile } from "../views/profile/EditProfile";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const queryClient = new QueryClient();

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

  setData_authGetUser(queryClient, user as unknown as AuthUserGetApiResponse);

  return {
    props: {
      cookies: getCookies({ req, res }),
      dehydratedState: bsonToJson(dehydrate(queryClient)),
    },
  };
};

export default function Page() {
  return <EditProfile />;
}

Page.getLayout = getLayout;