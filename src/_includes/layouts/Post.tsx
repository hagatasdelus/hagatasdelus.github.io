import Header from "../../_components/Header.tsx";
import Footer from "../../_components/Footer.tsx";
import { SITE_TITLE, SITE_DESCRIPTION } from "../../consts.ts";
import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";

export default function Post({ title, pubDate, tags, children }: Lume.Data) {
  const parsedDate = (() => {
    if (typeof pubDate === "undefined") {
      return "";
    }
    return parse(pubDate, "yyyy-MM-dd", new Date());
  })();

  const formattedDate = format(parsedDate, "yyyy年MM月dd日", { locale: ja });

  const displayTags = tags.filter((tag) => tag !== "posts");

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
          <div className="main-container container max-w-4xl mx-auto px-2">
            <article className="my-8">
              {title && (
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {title}
                  </h1>

                  <div className="grid grid-cols-[auto_auto] gap-4 items-center text-gray-500 dark:text-gray-400 sm:flex sm:flex-wrap">
                    {formattedDate && (
                      <time dateTime={pubDate.toString()} className="mr-4">
                        {formattedDate}
                      </time>
                    )}

                    {displayTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {displayTags.map((tag: string) => (
                          <span
                            key={tag}
                            className="border border-current opacity-70 px-2 py-1 rounded-md text-xs duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="prose prose-lg max-w-none dark:prose-invert">
                {children}
              </div>
            </article>
          </div>
          <Footer />
        </body>
      </html>
    </>
  );
}
