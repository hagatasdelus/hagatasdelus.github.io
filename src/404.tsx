import { SITE_TITLE, SITE_DESCRIPTION } from "./consts.ts";

export const layout = "layouts/Base.tsx";
export const title = `404 Page Not Found - ${SITE_TITLE}`;
export const metas = {
  title: "=title",
  description: SITE_DESCRIPTION,
};

export default function () {
  return (
    <>
      <h2>404 Not Found</h2>
    </>
  );
}
