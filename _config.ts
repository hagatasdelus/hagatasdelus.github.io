import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx.ts";
import gzip from "lume/plugins/gzip.ts";
import pagefind from "lume/plugins/pagefind.ts";
import sitemap from "lume/plugins/sitemap.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import mdx from "lume/plugins/mdx.ts";
import metas from "lume/plugins/metas.ts";
import minify_html from "lume/plugins/minify_html.ts";
import base_path from "lume/plugins/base_path.ts";
import esbuild from "lume/plugins/esbuild.ts";
import ogImages from "lume/plugins/og_images.ts";
import extractDate from "lume/plugins/extract_date.ts";

import favicon from "lume/plugins/favicon.ts";
import feed from "lume/plugins/feed.ts";
import remark from "lume/plugins/remark.ts";
import remarkBreaks from "npm:remark-breaks";
import { createHighlighter } from "npm:shiki";
import rehypeShikiFromHighlighter from "npm:@shikijs/rehype/core";
import { read } from "lume/core/utils/read.ts";
import footnote from "./plugins/footnote.ts";
import ogLinkCard from "./plugins/og_linkcard.ts";

// import tailwindOptions from "./tailwind.config.js";
import {
  AUTHER,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "./src/consts.ts";

const highlighter = await createHighlighter({
  themes: ["everforest-dark"],
  // themes: ["everforest-light", "everforest-dark"],
  langs: ["html", "py", "ts", "js", "sh", "md", "lua", "go", "lisp"],
});

const site = lume({
  src: "./src",
  location: new URL("https://hagatasdelus.github.io"),
});

site.use(jsx());
site.use(mdx());
site.add("scripts/themeToggle.ts");
site.use(esbuild());

site.use(tailwindcss());
site.add("styles/base.css");
site.add("styles/theme.css");

site.use(minify_html());
site.use(gzip());
site.use(sitemap());
site.use(base_path());

site.add("public/assets", "/");

site.use(
  favicon({
    input: "/favicon.svg",
    favicons: [
      { url: "/favicon.ico", size: [48], rel: "icon", format: "ico" },
      {
        url: "/apple-touch-icon.png",
        size: [180],
        rel: "apple-touch-icon",
        format: "png",
      },
    ],
  }),
);

site.use(
  ogImages({
    options: {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "NotoSansJPBlack",
          weight: 900,
          style: "normal",
          data: await read("./static/fonts/NotoSansCJKjp-Black.otf", true),
        },
        {
          name: "NotoSansJPBold",
          weight: 800,
          style: "normal",
          data: await read("./static/fonts/NotoSansCJKjp-Bold.otf", true),
        },
      ],
    },
  }),
);
site.use(extractDate());

site.use(
  feed({
    output: ["api/feed.xml", "api/feed.json"],
    query: "posts",
    info: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      lang: "ja",
      authorName: AUTHER,
      authorUrl: SITE_URL,
      published: new Date(),
    },
  }),
);

site.use(
  feed({
    output: ["diary/api/feed.xml", "diary/api/feed.json"],
    query: "diary",
    info: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      lang: "ja",
      authorName: AUTHER,
      authorUrl: SITE_URL,
      published: new Date(),
    },
  }),
);

site.use(metas());
site.use(
  remark({
    remarkPlugins: [remarkBreaks, ogLinkCard],
    rehypePlugins: [
      [
        rehypeShikiFromHighlighter,
        highlighter,
        {
          // themes: { light: "everforest-light", dark: "everforest-dark" },
          theme: "everforest-dark",
        },
      ],
    ],
  }),
);

site.use(footnote());
site.use(pagefind());

site.ignore("README.md", "node_modules");

export default site;
