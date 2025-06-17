import { SITE_DESCRIPTION, SITE_TITLE } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const openGraphLayout = "layouts/BaseOGImage.tsx";
export const title = SITE_TITLE;
export const metas = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function Home({}: Lume.Data) {
  // helpers: Lume.Helpers
  return (
    <div className="grid place-items-center w-full h-full">
      <p className="text-3xl">Hi! I'm Hagata</p>
    </div>
  );
}
