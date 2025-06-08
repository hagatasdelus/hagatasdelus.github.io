import { expect } from "jsr:@std/expect";
import { is } from "jsr:@core/unknownutil";
import {
  type OgpInfo,
  fetchOgpInfo,
  generateLinkCardHtml,
  extractUrls,
  normalizeUrl,
  processMarkdownForLinkCards,
} from "../plugins/og_linkcard.ts";

async function parseOgpFromHtmlTest(
  html: string,
  url: string
): Promise<OgpInfo> {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (() => {
    return Promise.resolve(
      new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      })
    );
  }) as typeof fetch;

  Deno.env.set("NO_CACHE", "true");

  try {
    const result = await fetchOgpInfo(url);
    return result;
  } finally {
    globalThis.fetch = originalFetch;
    Deno.env.delete("NO_CACHE");
  }
}

Deno.test(
  "parseOgpFromHtml should extract OGP information from HTML using DOMParser",
  async () => {
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
  Deno.env.delete("NO_CACHE");
  const useCache1 = !is.Undefined(Deno.env.get("NO_CACHE"));
  expect(useCache1).toBe(false);

  Deno.env.set("NO_CACHE", "true");
  const useCache2 = !is.Undefined(Deno.env.get("NO_CACHE"));
  expect(useCache2).toBe(true);

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
    "Check out https://example.com and https://example.org/ for more info";
  const urls = extractUrls(text);

  expect(urls).toEqual(["https://example.com/", "https://example.org/"]);
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
      Deno.env.set("NO_CACHE", "true");

      const result = await processMarkdownForLinkCards(markdown);

      expect(result).toContain("Test");
      expect(result).toContain("<a");
      expect(result).toContain('href="https://example.com/"');

      Deno.env.delete("NO_CACHE");
    } finally {
      globalThis.fetch = originalFetch;
    }
  }
);

Deno.test("fetchOgpInfo should handle network errors gracefully", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (() => {
    return Promise.reject(new Error("Network error"));
  }) as typeof fetch;

  Deno.env.set("NO_CACHE", "true");

  try {
    const result = await fetchOgpInfo("https://example.com", 100);

    expect(result.url).toBe("https://example.com");
    expect(result.pageTitle).toBe("https://example.com");
  } finally {
    globalThis.fetch = originalFetch;
    Deno.env.delete("NO_CACHE");
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
    expect(html).toContain("No title");
    expect(html).toContain("example.com");
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

  expect(normalized).toBe("not-a-url");
});
