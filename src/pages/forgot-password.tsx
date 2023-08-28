import { GetServerSideProps } from "next";
import { getAuthCookieToken } from "@italodeandra/auth/collections/user/User.service";
import routes from "../Routes";
import { getCookies } from "cookies-next";
import ForgotPasswordView from "@italodeandra/auth/views/ForgotPasswordView";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = await getAuthCookieToken(req, res);
  if (token) {
    return {
      redirect: {
        destination: routes.Home,
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

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
