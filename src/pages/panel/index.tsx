import { GetServerSideProps } from "next";
import { getCookies } from "cookies-next";
import { getUserFromCookies } from "@italodeandra/auth/collections/user/User.service";
import { useAuthRequiredUser } from "@italodeandra/auth/api/getUser";
import getPanelLayout from "../../views/panel/layout/panelLayout";
import { connectDb } from "../../db";
import Routes from "../../Routes";
import { PanelHomeView } from "../../views/panel/PanelHomeView";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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

  return {
    props: {
      cookies: getCookies({ req, res }),
    },
  };
};

export default function Page() {
  if (!useAuthRequiredUser()) {
    return null;
  }
  return (
    <>
      <div className="h-16" />
      <PanelHomeView />
    </>
  );
}

Page.getLayout = getPanelLayout;
