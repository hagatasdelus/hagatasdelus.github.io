import { SITE_TITLE, SITE_DESCRIPTION } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const templateEngine = "jsx";

export const title = `Info - ${SITE_TITLE}`;
export const metas = {
  title: "=title",
  description: SITE_DESCRIPTION,
};

export default function () {
  const techs = [
    {
      name: "Lume",
      license: "MIT License",
      url: "https://github.com/lumeland/lume",
    },
    {
      name: "Tailwind CSS",
      license: "MIT License",
      url: "https://github.com/tailwindlabs/tailwindcss",
    },
    {
      name: "daisyUI",
      license: "MIT License",
      url: "https://github.com/saadeghi/daisyui",
    },
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="prose md:prose-lg hidden">Info</h1>
        <div className="mx-auto text-left">
          <div className="prose md:prose-lg max-w-none md:mx-6">
            <h3 className="text-xl md:text-2xl mx-auto my-2">ライセンス</h3>
            <p>
              このブログの記事は、
              <a
                rel="license"
                href="http://creativecommons.org/licenses/by-sa/4.0/deed.ja"
                className="underline-offset-4"
              >
                クリエイティブ・コモンズ 表示-継承 4.0 国際 ライセンス
              </a>
              の下に提供されています。
            </p>
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/deed.ja"
              rel="license"
            >
              <img
                alt="クリエイティブ・コモンズ・ライセンス"
                src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
              />
            </a>

            <h3 className="text-xl text-left my-4 mt-8">サイトの詳細</h3>
            <p className="mb-4">このサイトは以下の技術で構築されています。</p>

            <div className="ml-2">
              {techs.map((tech) => (
                <div key={tech.name} className="mb-4">
                  <h4 className="text-lg font-semibold mb-1 text-accent">
                    <a
                      href={tech.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-4"
                    >
                      {tech.name}
                    </a>
                    <span className="text-sm font-normal ml-2 text-gray-500 dark:text-gray-400">
                      {tech.license}
                    </span>
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
