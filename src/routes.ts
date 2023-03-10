class Routes {
  Home = "/";
  Panel = "/";
  SignUp = "/sign-up";
  ForgotPassword = "/forgot-password";
  SignIn = "/sign-in";
  PanelUsers = "/users";
  PanelNewUser = "/user/new";

  ResetPassword(token: string) {
    return `/reset-password/${token}`;
  }

  PanelUser(id: string) {
    return `/user/${id}`;
  }
}

let routes = new Routes();

export default routes;
