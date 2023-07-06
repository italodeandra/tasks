import "@fontsource/inter/variable.css";
import "@italodeandra/ui/bootstrap/suppressConsoleLog";
import { QueryClient } from "@tanstack/query-core";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DefaultSeo } from "next-seo";
import { useState } from "react";
import "focus-visible";
import "../globals.css";
import AppProps from "@italodeandra/ui/bootstrap/AppProps";
import routes from "../routes";
import { hydrateNavigationDrawerState } from "@italodeandra/ui/components/NavigationDrawer/navigationDrawer.state";
import setupNProgress from "@italodeandra/ui/bootstrap/nprogress";
import AuthProvider from "@italodeandra/auth/AuthProvider";
import { appDescription, appKeywords, appName, primaryColor } from "../consts";
import { IAuthContext } from "@italodeandra/auth/AuthContext";
import { hydrateAuthState } from "@italodeandra/auth/auth.state";

dayjs.extend(relativeTime);

const authIntl: IAuthContext["intl"] = {
  "Add user": "Adicionar usuário",
  "An user with the same email already exists":
    "Um usuário com o mesmo e-mail já existe",
  "Check your email inbox": "Verifique sua caixa de entrada de e-mail",
  Or: "Ou",
  "create a new account": "crie uma nova conta",
  "Create a new account": "Crie uma nova conta",
  "Click the link we sent you to create a new password":
    "Clique no link que enviamos para criar uma nova senha",
  "Did you remember your password?": "Você lembrou sua senha?",
  "Forgot your password?": "Esqueceu a senha?",
  "if you remembered the password": "se você lembrou sua senha",
  "It was not possible to create the user": "Não foi possível criar o usuário",
  "It was not possible to update the user":
    "Não foi possível atualizar o usuário",
  "New password": "Nova senha",
  "New user": "Novo usuário",
  "No records": "Nenhum resultado",
  Administrator: "Administrador",
  "Please fill with a valid email": "Por favor, preencher com um e-mail válido",
  "Please fill with an email": "Por favor, preencher com um e-mail",
  "Please fill with the new password": "Por favor, preencher com a nova senha",
  Email: "E-mail",
  Name: "Nome",
  "Please fill with your email": "Por favor, preencher com o seu e-mail",
  "Please fill with your password": "Por favor, preencher com a sua senha",
  "Reset password": "Redefinir senha",
  "Reset your password": "Redefinir sua senha",
  "Sign in": "Entrar",
  "Sign in to your account": "Entrar em sua conta",
  "sign in to your account": "entrar em sua conta",
  "Sign up": "Criar conta",
  "There was an unexpected error. Try again later.":
    "Ocorreu um erro inesperado. Tente novamente mais tarde.",
  "There was an unexpected error trying to list the users":
    "Ocorreu um erro inesperado tentando listar os usuários",
  "to your account": "na sua conta",
  "Try again": "Tentar novamente",
  "User not found or incorrect password":
    "Usuário não encontrado ou senha incorreta",
  "We sent a link to": "Nós enviamos um link para",
  "Your token expired. To generate a new one, make a new request to reset your password.":
    "Seu token expirou. Para gerar um novo, faça um novo pedido para redefinir sua senha.",
  Normal: "Normal",
  Password: "Senha",
  Save: "Salvar",
  Saved: "Salvo",
  Type: "Tipo",
  User: "Usuário",
  Users: "Usuários",
  "Created at": "Criado em",
  "Updated at": "Atualizado em",
};

setupNProgress(primaryColor);

function MyApp({ Component, pageProps }: AppProps) {
  hydrateNavigationDrawerState(pageProps.cookies);
  hydrateAuthState(pageProps.cookies);

  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <DefaultSeo
        titleTemplate={`%s - ${appName}`}
        defaultTitle={appName}
        description={appDescription}
        openGraph={{
          images: [
            {
              url: "/favicons/android-chrome-512x512.png",
              height: 512,
              width: 512,
              alt: appName,
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/favicons/apple-touch-icon.png",
          },
          {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            href: "/favicons/favicon-32x32.png",
          },
          {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: "/favicons/favicon-16x16.png",
          },
          {
            rel: "manifest",
            href: "/favicons/site.webmanifest",
          },
          {
            rel: "mask-icon",
            href: "/favicons/safari-pinned-tab.svg",
            color: primaryColor,
          },
        ]}
        additionalMetaTags={[
          {
            name: "apple-mobile-web-app-title",
            content: appName,
          },
          {
            name: "application-name",
            content: appName,
          },
          {
            name: "msapplication-TileColor",
            content: primaryColor,
          },
          {
            name: "theme-color",
            content: primaryColor,
          },
          {
            name: "viewport",
            content: "initial-scale=1, width=device-width, maximum-scale=1",
          },
          {
            name: "keywords",
            content: appKeywords,
          },
        ]}
      />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <AuthProvider Routes={routes} intl={authIntl}>
            {getLayout(<Component {...pageProps} />)}
            <ReactQueryDevtools position="bottom-right" />
          </AuthProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

// noinspection JSUnusedGlobalSymbols
export default MyApp;
