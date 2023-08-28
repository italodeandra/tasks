import { getCookies } from "cookies-next";
import { GetServerSideProps } from "next";
import {
  checkUserType,
  getUserFromCookies,
} from "@italodeandra/auth/collections/user/User.service";
import { UserType } from "@italodeandra/auth/collections/user/User";
import { useAuthRequiredUserType } from "@italodeandra/auth/api/getUser";
import PanelUserView from "@italodeandra/auth/views/Panel/Users/PanelUserView";
import getPanelLayout from "../../../views/panel/layout/panelLayout";
import { connectDb } from "../../../db";
import Routes from "../../../Routes";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  await connectDb();
  const user = await getUserFromCookies(req, res);
  if (!checkUserType(user, [UserType.ADMIN])) {
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
    },
  };
};

export default function Page() {
  if (!useAuthRequiredUserType([UserType.ADMIN])) {
    return null;
  }

  return (
    <>
      <div className="h-16" />
      <PanelUserView />
    </>
  );
}

Page.getLayout = getPanelLayout;
