class Routes {
  Home = "/";
  Panel = "/";
  SignUp = "/criar-conta";
  ForgotPassword = "/esqueci-minha-senha";
  SignIn = "/entrar";
  PanelUsers = "/usuarios";
  PanelNewUser = "/usuario/novo";
  PanelAssets = "/bens";
  PanelNewAsset = "/bem/novo";

  ResetPassword(token: string) {
    return `/redefinir-senha/${token}`;
  }

  PanelUser(id: string) {
    return `/usuario/${id}`;
  }

  PanelAsset(id: string) {
    return `/bem/${id}`;
  }
}

let routes = new Routes()

export default routes
