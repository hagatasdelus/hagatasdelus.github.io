import { SITE_DESCRIPTION } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const templateEngine = "jsx";

export const title = "Info";
export const metas = {
  title: "=title",
  description: SITE_DESCRIPTION,
};

export default function () {
  const techs = [
    {
      name: "Lume",
      license: "MIT License",
      url: "https://lume.land/",
    },
    {
      name: "Tailwind CSS",
      license: "MIT License",
      url: "https://tailwindcss.com/",
    },
    {
      name: "daisyUI",
      license: "MIT License",
      url: "https://daisyui.com/",
    },
  ];

  return (
    <>
      <div className="prose max-w-none">
        <h2 className="text-xl md:text-2xl text-left my-2">ライセンス</h2>
        <p>
          このブログの記事は、
          <a
            rel="license"
            href="http://creativecommons.org/licenses/by-sa/4.0/deed.ja"
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
                {tech.name}
                <span className="text-sm font-normal ml-2 text-gray-500 dark:text-gray-400">
                  {tech.license}
                </span>
              </h4>
              <a
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary text-sm hover:text-secondary-focus"
              >
                公式サイト →
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
