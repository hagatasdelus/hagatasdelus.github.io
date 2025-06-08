import { SITE_DESCRIPTION } from "../../consts.ts";

export const tags = ["diary"];

export const layout = "layouts/Post.tsx";
export const openGraphLayout = "layouts/PostOGImage.tsx";
export const templateEngine = "md";
export const metas = {
  description: SITE_DESCRIPTION,
  robots: "noindex",
};

export function url(page) {
  return `/diary/${page.data.basename}/`;
}
