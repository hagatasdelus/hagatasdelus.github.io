import { SITE_DESCRIPTION } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const openGraphLayout = "layouts/BaseOGImage.tsx";
export const title = "404 Not Found";
export const metas = {
  title: "=title",
  description: SITE_DESCRIPTION,
  robots: "noindex",
};

export default function () {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose md:prose-lg mx-auto md:mx-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-8">404 Not Found</h1>
        </div>
      </div>
    </>
  );
}
