export const tags = ["posts"];

export const layout = "layouts/Post.tsx";
export const openGraphLayout = "layouts/PostOGImage.tsx";
export const templateEngine = "md";
export const metas = {
  description: "=description",
};

export function url(page) {
  const yymmddDate = page.data.pubDate;
  return `/blog/${yymmddDate}-${page.data.basename}/`;
}
