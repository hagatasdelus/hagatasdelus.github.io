export const tags = ["diary"];

export const layout = "layouts/Post.tsx";
export const templateEngine = "md";
export const metas = {
  description: "=description",
};

export function url(page) {
  return `/diary/${page.data.basename}/`;
}
