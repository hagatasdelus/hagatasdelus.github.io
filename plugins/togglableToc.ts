/**
 * togglableToc.ts - Rehype plugin for automatic Table of Contents generation
 */

import { visit } from "npm:unist-util-visit";
import { toString } from "npm:hast-util-to-string";

interface ElementNode {
  type: "element";
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Array<ElementNode | TextNode>;
}

interface TextNode {
  type: "text";
  value: string;
}

interface RootNode {
  type: "root";
  children: Array<ElementNode | TextNode>;
}

interface HeadingInfo {
  id: string;
  text: string;
  level: number;
  index: number;
}

interface TocOptions {
  headingLevels?: number[];
  mobileTitle?: string;
  pcTitle?: string;
  mobileClass?: string;
  pcClass?: string;
  enableCollapse?: boolean;
  mobileOpenDefault?: boolean;
  pcOpenDefault?: boolean;
  titleClassName?: string;
  listClassName?: string;
  listItemClassName?: string;
  linkClassName?: string;
}

const defaultOptions: Required<TocOptions> = {
  headingLevels: [2, 3, 4],
  mobileTitle: "目次",
  pcTitle: "目次",
  mobileClass: "toc-mobile",
  pcClass: "toc-pc",
  enableCollapse: true,
  mobileOpenDefault: true,
  pcOpenDefault: true,
  titleClassName: "toc-title",
  listClassName: "toc-list",
  listItemClassName: "toc-item",
  linkClassName: "toc-link",
};

/**
 * Generate slug from string (Japanese support)
 */
export function createSlug(text: string, existingIds: Set<string>): string {
  const baseSlug =
    text
      .toLowerCase()
      .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "heading";

  // Helper functions to avoid duplication
  const generateUniqueSlug = (base: string, counter = 0): string => {
    const candidate = counter === 0 ? base : `${base}-${counter}`;
    return existingIds.has(candidate)
      ? generateUniqueSlug(base, counter + 1)
      : candidate;
  };

  const uniqueSlug = generateUniqueSlug(baseSlug);
  existingIds.add(uniqueSlug);
  return uniqueSlug;
}

/**
 * Collects headline information and assigns IDs
 */
function collectHeadings(
  tree: RootNode,
  options: Required<TocOptions>
): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  const existingIds = new Set<string>();

  visit(tree, "element", (node: ElementNode) => {
    if (node.properties?.id) {
      existingIds.add(node.properties.id as string);
    }
  });

  visit(tree, "element", (node: ElementNode, index?: number) => {
    if (node.tagName && node.tagName.startsWith("h")) {
      const level = parseInt(node.tagName.slice(1));
      if (options.headingLevels.includes(level)) {
        const text = toString(
          node as unknown as Parameters<typeof toString>[0]
        ).trim();
        if (text) {
          const id =
            (node.properties?.id as string) || createSlug(text, existingIds);
          if (!node.properties?.id) {
            node.properties = node.properties || {};
            node.properties.id = id;
          }

          headings.push({
            id,
            text,
            level,
            index: index || 0,
          });
        }
      }
    }
  });

  return headings;
}

function createTocItems(
  headings: HeadingInfo[],
  options: Required<TocOptions>
): ElementNode[] {
  return headings.map((heading) => {
    const link: ElementNode = {
      type: "element",
      tagName: "a",
      properties: {
        class: options.linkClassName,
        href: `#${heading.id}`,
        "data-heading-id": heading.id,
      },
      children: [{ type: "text", value: heading.text }],
    };

    return {
      type: "element",
      tagName: "li",
      properties: {
        class: `${options.listItemClassName} toc-level-${heading.level}`,
      },
      children: [link],
    };
  });
}

function createTocElement(
  headings: HeadingInfo[],
  title: string,
  className: string,
  enableCollapse: boolean,
  openDefault: boolean,
  options: Required<TocOptions>
): ElementNode | null {
  if (headings.length === 0) return null;

  const tocItems = createTocItems(headings, options);

  const tocList: ElementNode = {
    type: "element",
    tagName: "ul",
    properties: {
      class: options.listClassName,
    },
    children: tocItems,
  };

  if (enableCollapse) {
    const tocDetails: ElementNode = {
      type: "element",
      tagName: "details",
      properties: {
        class: `${className}-details`,
        ...(openDefault && { open: true }),
      },
      children: [
        {
          type: "element",
          tagName: "summary",
          properties: { class: options.titleClassName },
          children: [{ type: "text", value: title }],
        },
        tocList,
      ],
    };

    return {
      type: "element",
      tagName: "div",
      properties: {
        class: `toc ${className}`,
      },
      children: [tocDetails],
    };
  } else {
    return {
      type: "element",
      tagName: "nav",
      properties: {
        class: `toc ${className}`,
      },
      children: [
        {
          type: "element",
          tagName: "h3",
          properties: { class: options.titleClassName },
          children: [{ type: "text", value: title }],
        },
        tocList,
      ],
    };
  }
}

function findMobileInsertionPoint(tree: RootNode): number {
  const indices = {
    firstHeading: -1,
    firstParagraph: -1,
  };

  visit(
    tree,
    "element",
    (node: ElementNode, index?: number, parent?: RootNode) => {
      if (parent === tree && typeof index === "number") {
        // Find the first heading (h1, h2)
        if (
          indices.firstHeading === -1 &&
          node.tagName &&
          (node.tagName === "h1" || node.tagName === "h2")
        ) {
          indices.firstHeading = index;
        }

        if (indices.firstParagraph === -1 && node.tagName === "p") {
          indices.firstParagraph = index;
        }
      }
    }
  );

  // Determination of insertion position for mobile
  return indices.firstHeading !== -1
    ? indices.firstHeading
    : indices.firstParagraph !== -1
    ? indices.firstParagraph
    : 0;
}

export default function togglableToc(userOptions: TocOptions = {}) {
  const options = { ...defaultOptions, ...userOptions };

  return (tree: RootNode) => {
    const headings = collectHeadings(tree, options);

    if (headings.length === 0) {
      return tree;
    }

    const mobileToc = createTocElement(
      headings,
      options.mobileTitle,
      options.mobileClass,
      options.enableCollapse,
      options.mobileOpenDefault,
      options
    );

    const pcToc = createTocElement(
      headings,
      options.pcTitle,
      options.pcClass,
      options.enableCollapse,
      options.pcOpenDefault,
      options
    );

    const mobileIndex = findMobileInsertionPoint(tree);

    if (mobileToc) {
      tree.children.splice(mobileIndex, 0, mobileToc);
    }

    if (pcToc) {
      tree.children.push(pcToc);

      // Added script for TOC highlighting function
      const scriptElement: ElementNode = {
        type: "element",
        tagName: "script",
        properties: {
          type: "module",
          src: "/scripts/tocHighlight.js",
        },
        children: [],
      };
      tree.children.push(scriptElement);
    }

    // 脚注ラベルの「Footnotes」を「脚注」に変更
    visit(tree, "element", (node: ElementNode) => {
      if (
        node.tagName === "h2" &&
        node.properties?.id === "footnote-label" &&
        node.properties?.class === "sr-only"
      ) {
        // テキストノードを探して変更
        visit(node, "text", (textNode: TextNode) => {
          if (textNode.value === "Footnotes") {
            textNode.value = "脚注";
          }
        });
      }
    });

    return tree;
  };
}
