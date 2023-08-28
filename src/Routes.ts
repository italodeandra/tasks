class Routes {
  static Home = "/";
  static SignUp = "/sign-up";
  static SignIn = "/sign-in";
  static ForgotPassword = "/forgot-password";
  static ResetPassword(token: string) {
    return `/reset-password/${token}`;
  }

  static Panel = "/panel";
  static PanelUsers = `${Routes.Panel}/users`;
  static PanelNewUser = `${Routes.Panel}/user/new`;
  static PanelUser(id: string) {
    return `${Routes.Panel}/user/${id}`;
  }
}

export default Routes;
