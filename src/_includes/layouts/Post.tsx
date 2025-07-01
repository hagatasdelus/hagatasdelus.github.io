import Header from "../../_components/Header.tsx";
import Footer from "../../_components/Footer.tsx";
import { SITE_DESCRIPTION } from "../../consts.ts";
import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";

export default function Post(data: Lume.Data) {
  // helpers: Lume.Helpers
  const { title, children, pubDate, tags } = data;
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
          <meta charSet="UTF-8" />
          <title>{title}</title>
          <link rel="stylesheet" href="/styles/base.css" />
          <link rel="stylesheet" href="/styles/blog.css" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content={SITE_DESCRIPTION} />
          <script src="/scripts/themeInit.js"></script>
          <script type="module" src="/scripts/toggleTheme.js"></script>
        </head>
        <body className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow w-full mx-auto">
            <div className="container max-w-4xl mx-auto px-4">
              <article className="my-8">
                {title && (
                  <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 break-words">
                      {title}
                    </h1>

                    <div className="flex flex-row gap-4 text-gray-500 dark:text-gray-400">
                      {formattedDate && (
                        <time dateTime={pubDate.toString()}>
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

                <div className="prose md:prose-lg max-w-none dark:prose-invert">
                  {children}
                </div>
              </article>
            </div>
          </main>
          <Footer />
        </body>
      </html>
    </>
  );
}
