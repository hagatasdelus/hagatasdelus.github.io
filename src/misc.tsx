import { SITE_DESCRIPTION } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const templateEngine = "jsx";

export const title = "MISC";
export const metas = {
  title: "=title",
  description: SITE_DESCRIPTION,
};

export default function () {
  return (
    <>
      <h2 className="text-2xl md:text-3xl text-left my-2">その他</h2>
      <div className="prose text-center mx-auto">
        <div className="grid grid-cols-2 justify-items-center gap-6 mt-24 md:mt-6">
          <img
            src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1f6a7.svg"
            alt="工事中"
            className="w-36 h-36 md:w-48 md:h-48"
          />
          <img
            src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/1f528.svg"
            alt="ハンマー"
            className="w-36 h-36 md:w-48 md:h-48"
          />
        </div>
        <p className="mt-8">工事中です。</p>
      </div>
    </>
  );
}
