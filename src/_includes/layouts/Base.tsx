import Header from "../../_components/Header.tsx";
import Footer from "../../_components/Footer.tsx";
import { SITE_TITLE, SITE_DESCRIPTION } from "../../consts.ts";

export default ({ title, children }: Lume.Data) => {
  // helpers: Lume.Helpers
  return (
    <>
      <html lang="ja">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="stylesheet" href="/styles/base.css" />
          <script src="/scripts/themeInit.js"></script>
          <script type="module" src="/scripts/toggleTheme.js"></script>
          <title>{title || SITE_TITLE}</title>
          <meta name="description" content={SITE_DESCRIPTION} />
        </head>
        <body className="grid grid-rows-[auto_1fr_auto] min-h-screen">
          <Header />
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            {children}
          </div>
          <Footer />
        </body>
      </html>
    </>
  );
};
