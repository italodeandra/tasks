import "@fontsource-variable/inter";
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
import { hydrateAuthState } from "@italodeandra/auth/auth.state";
import Notifications from "@italodeandra/ui/components/Notifications/Notifications";
import Dialogs from "@italodeandra/ui/components/Dialog";

dayjs.extend(relativeTime);

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
          <Notifications />
          <Dialogs />
          <AuthProvider Routes={routes}>
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
