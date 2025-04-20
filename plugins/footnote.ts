import type Site from "lume/core/site.ts";

export interface FootnoteOptions {
  extensions?: string[];
  headingText?: string;
  marginValue?: string;
}

const defaults: FootnoteOptions = {
  extensions: [".html"],
  headingText: "脚注",
  marginValue: "0.25rem",
};

export default function (userOptions?: FootnoteOptions) {
  const options = { ...defaults, ...userOptions };

  return (site: Site) => {
    site.process(options.extensions!, (pages) => {
      for (const page of pages) {
        if (!page.document) continue;

        const footnoteSection = page.document.querySelector(".footnotes");
        if (!footnoteSection) continue;

        const hr = page.document.createElement("hr");
        hr.setAttribute("style", "margin-top: 4rem; margin-bottom: 1rem;");

        const heading = page.document.createElement("h3");
        heading.textContent = options.headingText!;
        heading.setAttribute("style", "margin-bottom: 1rem; font-weight: 600;");

        footnoteSection.insertBefore(heading, footnoteSection.firstChild);
        footnoteSection.insertBefore(hr, footnoteSection.firstChild);

        const footnoteItems = footnoteSection.querySelectorAll("li");
        footnoteItems.forEach((item) => {
          item.setAttribute(
            "style",
            `margin-top: ${options.marginValue}; margin-bottom: ${options.marginValue};`
          );
        });

        const footnoteParagraphs = footnoteSection.querySelectorAll("li p");
        footnoteParagraphs.forEach((p) => {
          p.setAttribute(
            "style",
            `margin-top: ${options.marginValue}; margin-bottom: ${options.marginValue};`
          );
        });
      }
    });
  };
}
