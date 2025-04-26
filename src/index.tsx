import { SITE_TITLE, SITE_DESCRIPTION } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const title = SITE_TITLE;
export const metas = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export default function Home({}: Lume.Data) {
  // helpers: Lume.Helpers
  return (
    <div className="grid place-items-center w-full h-full min-h-[calc(100vh-var(--header-height)-var(--footer-height))]">
      <h3 className="text-3xl">Hi! I'm Hagata</h3>
    </div>
  );
}
