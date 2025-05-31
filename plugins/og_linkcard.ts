/**
 * OGP情報取得とリンクカード生成プラグイン
 *
 * 機能:
 * 1. URLからOGP情報（og:title, og:image, og:site_name, og:url, title）を取得
 * 2. キャッシュ機構による高速化（NO_CACHE環境変数で制御）
 * 3. ユーザーエージェント・ヘッダー制御（Chrome User-Agent使用）
 * 4. タイムアウト制御（デフォルト10000ms）
 * 5. valibotによるスキーマバリデーション
 * 6. Markdown AST内の単独URLをリンクカードに変換
 * 7. 非同期処理のバッチ実行
 * 8. エラーハンドリング
 * 9. @b-fuze/deno-domを使用したHTML解析
 * 10. core/unknownutilを使用した型安全な環境変数チェック
 */

import * as v from "npm:valibot";
import { is } from "jsr:@core/unknownutil";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { visit } from "npm:unist-util-visit";

/**
 * OGP情報のスキーマ定義
 */
const OgpInfoSchema = v.object({
  url: v.optional(v.string()),
  title: v.optional(v.string()),
  image: v.optional(v.string()),
  siteName: v.optional(v.string()),
  pageTitle: v.optional(v.string()),
  description: v.optional(v.string()),
});

export type OgpInfo = v.InferInput<typeof OgpInfoSchema>;

/**
 * ASTノードの基本構造を表すインターフェース
 */
interface ASTNode {
  type: string;
  children?: ASTNode[];
  value?: string;
  url?: string; // linkノード用
}

/**
 * 子ノードを持つAST親ノードのインターフェース
 */
interface ASTParent {
  children: ASTNode[];
}

/**
 * URL文字列を正規化する（Punycode対応）
 * @param urlString - 正規化対象のURL文字列
 * @returns 正規化されたURL文字列
 */
export function normalizeUrl(urlString: string): string {
  return URL.canParse(urlString) ? new URL(urlString).toString() : urlString;
}

/**
 * テキストからURLを抽出する
 * @param text - 検索対象のテキスト
 * @returns 抽出されたURL配列
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<>"']+/gi;
  const matches = text.match(urlRegex) || [];
  return matches.map(normalizeUrl);
}

/**
 * 指定されたURLからOGP情報を取得する
 * @param url - 取得対象のURL
 * @param timeout - タイムアウト値（ミリ秒、デフォルト10000ms）
 * @returns OGP情報のオブジェクト
 */
export async function fetchOgpInfo(
  url: string,
  timeout = 10000
): Promise<OgpInfo> {
  const useCache = is.Undefined(Deno.env.get("NO_CACHE"));

  const cache = await caches.open("fetchOgp");
  const targetUrl = new URL(url);

  const response = await (async () => {
    const cachedResponse = useCache ? await cache.match(url) : undefined;
    const isJSR = targetUrl.origin.includes("jsr.io");
    const baseHeaders = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
    };

    if (is.Undefined(cachedResponse)) {
      const request = new Request(targetUrl);
      const fetchResponse = await fetch(request, {
        headers: isJSR
          ? {
              ...baseHeaders,
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            }
          : baseHeaders,
        signal: AbortSignal.timeout(timeout),
      });

      if (!fetchResponse.ok) {
        throw new Error(`HTTP error! status: ${fetchResponse.status}`);
      }

      if (useCache) {
        await cache.put(request, fetchResponse.clone());
      }
      return fetchResponse;
    } else {
      return cachedResponse;
    }
  })();

  const html = await response.text();
  const ogpInfo = parseOgpFromHtml(html, url);
  return ogpInfo;
}

/**
 * HTMLからOGP情報を抽出する（DOMParserを使用）
 * @param html - パース対象のHTML
 * @param url - 元のURL（フォールバック用）
 * @returns 抽出されたOGP情報
 */
function parseOgpFromHtml(html: string, url: string): OgpInfo {
  const ogpInfo: Partial<OgpInfo> = { url };

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  if (!document) {
    console.warn(`[parseOgpFromHtml] Failed to parse HTML for ${url}`);
    return v.parse(OgpInfoSchema, ogpInfo);
  }

  const titleElement = document.querySelector("title");
  ogpInfo.pageTitle = titleElement?.textContent?.trim() || undefined;

  const metaTags = document.querySelectorAll("meta");

  for (const meta of metaTags) {
    if (!meta.hasAttribute("property")) continue;

    const property = meta.getAttribute("property");
    const content = meta.getAttribute("content");

    if (!property || !content) continue;

    switch (property) {
      case "og:title":
        ogpInfo.title = content.trim();
        break;
      case "og:image":
        ogpInfo.image = content.trim();
        break;
      case "og:site_name":
        ogpInfo.siteName = content.trim();
        break;
      case "og:url":
        ogpInfo.url = content.trim();
        break;
      case "og:description":
        ogpInfo.description = content.trim();
        break;
    }
  }

  return v.parse(OgpInfoSchema, ogpInfo);
}

/**
 * OGP情報からリンクカードのHTMLを生成する
 * @param ogpInfo - OGP情報
 * @returns リンクカードのHTML
 */
export function generateLinkCardHtml(ogpInfo: OgpInfo): string {
  const title = ogpInfo.title || ogpInfo.pageTitle || "No title";
  const url = ogpInfo.url || "";
  const description =
    ogpInfo.description || ogpInfo.siteName || new URL(url).hostname;
  const image = ogpInfo.image;

  return `
<a
  href="${url}"
  class="not-prose group flex flex-col md:flex-row border-[1.5px] border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden no-underline shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:border-accent transition-all duration-200"
>
  <div class="flex-shrink-0 md:w-44 md:h-29 overflow-hidden flex items-center justify-center">
    ${
      image
        ? `<div class="md:px-2 w-full h-full flex items-center justify-center">
          <img
            src="${image}"
            alt="Link Preview"
            class="w-full max-h-80 md:max-w-40 md:max-h-[90px] md:w-auto md:h-auto  rounded-md object-cover md:object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>`
        : `<div class="w-full md:px-2">
        <div class="aspect-[1.91/1] md:aspect-auto w-full md:h-[84px] md:border md:border-gray-300 md:dark:border-gray-600 md:rounded-md flex items-center justify-center object-cover md:object-contain group-hover:scale-105 transition-transform duration-300">
          <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </div>
      </div>`
    }
  </div>
  ${
    image
      ? `
  <div class="flex flex-col text-left px-4 py-3 md:pl-1 md:pr-3 md:py-3 flex-1 min-w-0">`
      : `<div class="flex flex-col text-left px-4 py-3 md:pl-1 md:pr-3 md:py-3 flex-1 min-w-0 border-t border-gray-300 dark:border-gray-600 md:border-none">`
  }
    <div class="h-12 mb-1 flex items-start">
      <p class="text-md text-base font-semibold text-accent line-clamp-2">
        ${title}
      </p>
    </div>
    <div class="h-9 mb-1">
      <p class="text-sm line-clamp-2">
        ${description}
      </p>
    </div>
  </div>
</a>
  `.trim();
}

export default function ogLinkCard() {
  return async function transformer(tree: ASTNode, _file?: unknown) {
    const transformPromises: Promise<void>[] = [];

    visit(
      tree,
      "paragraph",
      (
        node: ASTNode,
        index: number | undefined,
        parent: ASTParent | undefined
      ) => {
        if (node.children?.length === 1 && parent && index !== undefined) {
          const child = node.children[0];

          if (child.type === "text") {
            const text = child.value?.trim() || "";
            const urls = extractUrls(text);

            if (
              urls.length === 1 &&
              (text === urls[0] || normalizeUrl(text) === urls[0])
            ) {
              const promise = fetchOgpInfo(urls[0])
                .then((ogpInfo) => {
                  return generateLinkCardHtml(ogpInfo);
                })
                .then((html) => {
                  parent.children[index] = {
                    type: "html",
                    value: html,
                  } as ASTNode;
                })
                .catch((error) => {
                  console.error(
                    `[ogLinkCard] Error processing ${urls[0]}:`,
                    error
                  );
                });

              transformPromises.push(promise);
            }
          } else if (child.type === "link" && child.children?.length === 1) {
            const linkChild = child.children[0];
            if (linkChild.type === "text" && linkChild.value) {
              const linkText = linkChild.value.trim();
              const linkUrl = child.url;

              if (
                linkUrl &&
                (linkText === linkUrl ||
                  normalizeUrl(linkText) === normalizeUrl(linkUrl))
              ) {
                const promise = fetchOgpInfo(linkUrl)
                  .then((ogpInfo) => {
                    return generateLinkCardHtml(ogpInfo);
                  })
                  .then((html) => {
                    parent.children[index] = {
                      type: "html",
                      value: html,
                    } as ASTNode;
                  })
                  .catch((error) => {
                    console.error(
                      `[ogLinkCard] Error processing ${linkUrl}:`,
                      error
                    );
                  });

                transformPromises.push(promise);
              }
            }
          }
        }
      }
    );

    await Promise.all(transformPromises);

    return tree;
  };
}

/**
 * Markdownコンテンツ内の単独URLをリンクカードに変換する
 * @param markdown - 変換対象のMarkdownコンテンツ
 * @returns 変換されたコンテンツ
 */
export async function processMarkdownForLinkCards(
  markdown: string
): Promise<string> {
  const lines = markdown.split("\n");
  const promises: Array<Promise<string>> = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (
      trimmedLine &&
      !trimmedLine.includes("<a") &&
      !trimmedLine.includes("```") &&
      !trimmedLine.startsWith("#")
    ) {
      const urls = extractUrls(trimmedLine);

      if (
        urls.length === 1 &&
        (trimmedLine === urls[0] || normalizeUrl(trimmedLine) === urls[0])
      ) {
        promises.push(
          fetchOgpInfo(urls[0])
            .then(generateLinkCardHtml)
            .catch((error) => {
              console.error(
                `[processMarkdownForLinkCards] Error processing ${urls[0]}:`,
                error
              );
              return line;
            })
        );
        continue;
      }
    }

    promises.push(Promise.resolve(line));
  }

  const processedLines = await Promise.all(promises);
  return processedLines.join("\n");
}
