import Document, { Head, Html, Main, NextScript } from "next/document";
import scrolledScript from "@italodeandra/ui/bootstrap/scrolledScript";

export default class _Document extends Document {
  render() {
    return (
      <Html lang="pt" className="dark h-full antialiased">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: scrolledScript }} />
          {/*<script dangerouslySetInnerHTML={{ __html: modeScript }} />*/}
        </Head>
        <body className="ui-theme-default">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
