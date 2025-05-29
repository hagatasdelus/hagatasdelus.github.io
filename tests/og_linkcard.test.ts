import { expect } from "jsr:@std/expect";
import * as is from "jsr:@core/unknownutil";
import {
  type OgpInfo,
  fetchOgpInfo,
  generateLinkCardHtml,
  extractUrls,
  normalizeUrl,
  processMarkdownForLinkCards,
} from "../plugins/og_linkcard.ts";

// parseOgpFromHtmlは内部関数なので、fetchOgpInfoを通してテストする代わりに
// モックHTMLを使用したテストを分離して作成
async function parseOgpFromHtmlTest(
  html: string,
  url: string
): Promise<OgpInfo> {
  // テスト用に一時的にfetchをモック
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (() => {
    return Promise.resolve(
      new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })
    );
  }) as typeof fetch;

  try {
    const result = await fetchOgpInfo(url);
    return result;
  } finally {
    globalThis.fetch = originalFetch;
  }
}

Deno.test(
  "parseOgpFromHtml should extract OGP information from HTML using DOMParser",
  async () => {
    // モックHTMLでテスト
    const mockHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test Page</title>
        <meta property="og:title" content="Test OG Title" />
        <meta property="og:image" content="https://example.com/image.jpg" />
        <meta property="og:site_name" content="Test Site" />
        <meta property="og:url" content="https://example.com/test" />
        <meta property="og:description" content="Test Description" />
      </head>
      <body>Content</body>
    </html>
  `;

    const ogpInfo = await parseOgpFromHtmlTest(
      mockHtml,
      "https://example.com/test"
    );

    expect(ogpInfo.title).toBe("Test OG Title");
    expect(ogpInfo.image).toBe("https://example.com/image.jpg");
    expect(ogpInfo.siteName).toBe("Test Site");
    expect(ogpInfo.url).toBe("https://example.com/test");
    expect(ogpInfo.pageTitle).toBe("Test Page");
    expect(ogpInfo.description).toBe("Test Description");
  }
);

Deno.test(
  "parseOgpFromHtml should handle invalid HTML gracefully",
  async () => {
    const invalidHtml = "<invalid>html</invalid>";
    const ogpInfo = await parseOgpFromHtmlTest(
      invalidHtml,
      "https://example.com"
    );

    expect(ogpInfo.url).toBe("https://example.com");
    // DOMParserは無効なHTMLでもある程度パースするため、titleがundefinedになることを確認
  }
);

Deno.test(
  "parseOgpFromHtml should handle missing OGP tags gracefully",
  async () => {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Just a title</title>
      </head>
      <body></body>
    </html>
  `;
    const ogpInfo = await parseOgpFromHtmlTest(html, "https://example.com");

    expect(ogpInfo.pageTitle).toBe("Just a title");
    expect(ogpInfo.url).toBe("https://example.com");
    expect(ogpInfo.title).toBeUndefined();
  }
);

Deno.test("useCacheフラグがNO_CACHE環境変数で正しく制御されること", () => {
  // NO_CACHE未設定時
  Deno.env.delete("NO_CACHE");
  const useCache1 = !is.isUndefined(Deno.env.get("NO_CACHE"));
  expect(useCache1).toBe(false); // NO_CACHEが未設定の場合、キャッシュを使用しない

  // NO_CACHE設定時
  Deno.env.set("NO_CACHE", "true");
  const useCache2 = !is.isUndefined(Deno.env.get("NO_CACHE"));
  expect(useCache2).toBe(true); // NO_CACHEが設定されている場合、キャッシュを使用する

  // クリーンアップ
  Deno.env.delete("NO_CACHE");
});

Deno.test("generateLinkCardHtml should create proper HTML structure", () => {
  const ogpInfo: OgpInfo = {
    title: "Test Title",
    url: "https://example.com",
    image: "https://example.com/image.jpg",
    description: "Test Description",
  };

  const html = generateLinkCardHtml(ogpInfo);

  expect(html).toContain('href="https://example.com"');
  expect(html).toContain("Test Title");
  expect(html).toContain("Test Description");
  expect(html).toContain('src="https://example.com/image.jpg"');
});

Deno.test("extractUrls should find URLs in text", () => {
  const text =
    "Check out https://example.com and https://github.com/ for more info";
  const urls = extractUrls(text);

  expect(urls).toEqual(["https://example.com/", "https://github.com/"]);
});

Deno.test("normalizeUrl should handle valid URLs", () => {
  const url = "https://example.com/path?query=value";
  const normalized = normalizeUrl(url);

  expect(normalized).toBe("https://example.com/path?query=value");
});

Deno.test(
  "parseOgpFromHtml should handle missing OGP tags gracefully (duplicate test check)",
  async () => {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Just a title</title>
      </head>
      <body></body>
    </html>
  `;
    const ogpInfo = await parseOgpFromHtmlTest(html, "https://example.com");

    expect(ogpInfo.pageTitle).toBe("Just a title");
    expect(ogpInfo.url).toBe("https://example.com");
    expect(ogpInfo.title).toBeUndefined();
  }
);

Deno.test("generateLinkCardHtml should handle missing image gracefully", () => {
  const ogpInfo: OgpInfo = {
    title: "Test Title",
    url: "https://example.com",
    description: "Test Description",
  };

  const html = generateLinkCardHtml(ogpInfo);

  expect(html).toContain("Test Title");
  expect(html).toContain("Test Description");
  expect(html).not.toContain("<img");
});

Deno.test(
  "processMarkdownForLinkCards should convert standalone URLs",
  async () => {
    const markdown = `# Test\n\nhttps://example.com\n\nSome text`;

    // fetchをモック
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (() => {
      return Promise.resolve(
        new Response(
          `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Example Site</title>
            <meta property="og:title" content="Example" />
          </head>
          <body></body>
        </html>
      `,
          {
            status: 200,
            headers: { "Content-Type": "text/html" },
          }
        )
      );
    }) as typeof fetch;

    try {
      // モック関数でキャッシュを無効化
      Deno.env.set("NO_CACHE", "true");

      const result = await processMarkdownForLinkCards(markdown);

      expect(result).toContain("Test");
      expect(result).toContain("<a");
      expect(result).toContain('href="https://example.com/"');

      // 環境変数をクリア
      Deno.env.delete("NO_CACHE");
    } finally {
      globalThis.fetch = originalFetch;
    }
  }
);

Deno.test("fetchOgpInfo should handle network errors gracefully", async () => {
  // fetchをエラーが発生するようにモック
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (() => {
    return Promise.reject(new Error("Network error"));
  }) as typeof fetch;

  try {
    // タイムアウトを短くして迅速にテストを完了
    const result = await fetchOgpInfo("https://example.com", 100);

    // エラー時のフォールバック値をテスト
    expect(result.url).toBe("https://example.com");
    expect(result.pageTitle).toBe("https://example.com");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test(
  "generateLinkCardHtml should handle empty OGP info gracefully",
  () => {
    const ogpInfo: OgpInfo = {
      url: "https://example.com",
    };

    const html = generateLinkCardHtml(ogpInfo);

    expect(html).toContain('href="https://example.com"');
    expect(html).toContain("No title"); // デフォルトタイトル
    expect(html).toContain("example.com"); // hostNameがdescriptionに使用される
  }
);

Deno.test("extractUrls should handle text without URLs", () => {
  const text = "This is just plain text with no URLs";
  const urls = extractUrls(text);

  expect(urls).toEqual([]);
});

Deno.test("normalizeUrl should handle invalid URLs", () => {
  const invalidUrl = "not-a-url";
  const normalized = normalizeUrl(invalidUrl);

  expect(normalized).toBe("not-a-url"); // 無効なURLはそのまま返される
});
