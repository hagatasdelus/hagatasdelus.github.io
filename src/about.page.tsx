import { SITE_DESCRIPTION } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const openGraphLayout = "layouts/BaseOGImage.tsx";
export const templateEngine = "jsx";
export const title = "About Me";
export const metas = {
  title: "=title",
  description: SITE_DESCRIPTION,
};

export default function () {
  // children, title
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose md:prose-lg mx-auto md:mx-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">About Me</h1>
      </div>
      <div className="prose md:prose-lg mx-auto">
        <figure className="flex justify-center">
          <img
            src={`/icons/hagata.png`}
            alt="hagata"
            className="h-48 w-48 rounded-full"
          />
        </figure>
        <p>こんにちは、Hagataです。</p>
        <p>
          現在は京都の大学でコンピュータサイエンスを学んでいます。
          よろしくお願いします。
        </p>
        <h5>好きな言語は</h5>
        <ul className="prose-ul:list-disc">
          <li>Python</li>
          <li>Swift</li>
          <li>Go</li>
        </ul>
        <p>Common Lisp勉強中です。</p>
      </div>
    </div>
  );
}
