import { GetServerSideProps } from "next";
import { getAuthCookieToken } from "@italodeandra/auth/collections/user/User.service";
import SignInView from "@italodeandra/auth/views/SignInView";
import routes from "../routes";
import { getCookies } from "cookies-next";

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

export default function SignInPage() {
  return <SignInView />;
}
