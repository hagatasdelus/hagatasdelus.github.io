import { SITE_DESCRIPTION } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const templateEngine = "jsx";
export const title = "About Me";
export const metas = {
  title: "=title",
  description: SITE_DESCRIPTION,
};

export default function () {
  // children, title
  return (
    <>
      <div>
        <h2 className="text-2xl md:text-4xl text-left my-4">About Me</h2>
      </div>
      <div className="prose text-center mx-auto">
        <img
          src={`/icons/hagata.png`}
          alt="hagata"
          className="mx-auto h-48 w-48 rounded-full md:mb-18 mt-24 md:mt-6"
        />
        <main className="mt-4 text-left">
          <p>こんにちは、Hagataです。</p>
          <p>
            現在は京都の大学でコンピュータサイエンスを学んでいます。
            よろしくお願いします。
          </p>
          <h5>好きな言語は</h5>
          <ul>
            <li>Python</li>
            <li>Swift</li>
            <li>Go</li>
          </ul>
          <p>Common Lisp勉強中です。</p>
        </main>
      </div>
    </>
  );
}
