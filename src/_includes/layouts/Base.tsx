import Header from "../../_components/Header.tsx";
import Footer from "../../_components/Footer.tsx";
import { SITE_DESCRIPTION } from "../../consts.ts";

export default ({ title, children }: Lume.Data) => {
  // helpers: Lume.Helpers
  return (
    <>
      <html lang="ja">
        <head>
          <title>{title}</title>
          <link rel="stylesheet" href="/styles/base.css" />
          <meta name="description" content={SITE_DESCRIPTION} />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <script src="/scripts/themeInit.js"></script>
          <script type="module" src="/scripts/toggleTheme.js"></script>
        </head>
        <body className="grid grid-rows-[auto_1fr_auto] min-h-screen">
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </>
  );
};
