import "@fontsource-variable/inter";
import "@italodeandra/ui/bootstrap/suppressConsoleLog";
import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DefaultSeo } from "next-seo";
import "../globals.css";
import AppProps from "@italodeandra/ui/bootstrap/AppProps";
import routes from "../Routes";
import { hydrateNavigationDrawerState } from "@italodeandra/ui/components/NavigationDrawer/navigationDrawer.state";
import setupNProgress from "@italodeandra/ui/bootstrap/nprogress";
import AuthProvider from "@italodeandra/auth/AuthProvider";
import { appDescription, appKeywords, appName, primaryColor } from "../consts";
import { hydrateAuthState } from "@italodeandra/auth/auth.state";
import { Dialogs } from "@italodeandra/ui/components/Dialog";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { MutationWindowCloseProtection } from "@italodeandra/ui/hooks/useMutationWindowCloseProtection";
import "highlight.js/styles/github-dark.css";
import { hydrateHomeState } from "../views/home/home.state";
import getQueryClient from "@italodeandra/next/api/getQueryClient";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

setupNProgress(primaryColor);

function MyApp({ Component, pageProps }: AppProps) {
  hydrateNavigationDrawerState(pageProps.cookies);
  hydrateAuthState(pageProps.cookies);
  hydrateHomeState(pageProps.cookies);

  const queryClient = getQueryClient();

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
              alt: appName
            }
          ]
        }}
        additionalLinkTags={[
          {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/favicons/apple-touch-icon.png"
          },
          {
            rel: "icon",
            type: "image/png",
            sizes: "32x32",
            href: "/favicons/favicon-32x32.png"
          },
          {
            rel: "icon",
            type: "image/png",
            sizes: "16x16",
            href: "/favicons/favicon-16x16.png"
          },
          {
            rel: "mask-icon",
            href: "/favicons/safari-pinned-tab.svg",
            color: primaryColor
          },
          {
            rel: "manifest",
            href: "/favicons/site.webmanifest"
          }
        ]}
        additionalMetaTags={[
          {
            name: "apple-mobile-web-app-title",
            content: appName
          },
          {
            name: "application-name",
            content: appName
          },
          {
            name: "msapplication-TileColor",
            content: primaryColor
          },
          {
            name: "msapplication-config",
            content: "/favicons/browserconfig.xml"
          },
          {
            name: "theme-color",
            content: primaryColor
          },
          {
            name: "viewport",
            content: "initial-scale=1, width=device-width, maximum-scale=1"
          },
          {
            name: "keywords",
            content: appKeywords
          }
        ]}
      />
      <QueryClientProvider client={queryClient}>
        <MutationWindowCloseProtection />
        <HydrationBoundary state={pageProps.dehydratedState}>
          <Dialogs />
          <AuthProvider Routes={routes}>
            {getLayout(<Component {...pageProps} />)}
            <ReactQueryDevtools buttonPosition="bottom-right" />
          </AuthProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}

// noinspection JSUnusedGlobalSymbols
export default MyApp;
