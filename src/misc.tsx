import { SITE_DESCRIPTION } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const openGraphLayout = "layouts/BaseOGImage.tsx";
export const templateEngine = "jsx";

export const title = "MISC";
export const metas = {
  title: "=title",
  description: SITE_DESCRIPTION,
};

export default function () {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose md:prose-lg mx-auto md:mx-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-8">MISC</h1>
        </div>
        <div className="prose md:prose-lg text-center mx-auto">
          <div className="grid grid-cols-2 justify-items-center gap-6 mt-6">
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
      </div>
    </>
  );
}
