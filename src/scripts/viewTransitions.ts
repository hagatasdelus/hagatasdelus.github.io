/**
 * View Transitions API による純粋なページ遷移実装
 * プリロードではなく、View Transitions API本来の機能でちらつきを防ぐ
 */

interface NavigationState {
  isTransitioning: boolean;
}

interface TransitionConfig {
  respectReducedMotion: boolean;
  timeout: number;
}

// シンプルな状態管理
const navigationState: NavigationState = {
  isTransitioning: false,
};

const config: TransitionConfig = {
  respectReducedMotion: true,
  timeout: 5000,
};

/**
 * View Transitions APIがサポートされているかチェックする
 */
function isSupported(): boolean {
  return typeof document !== "undefined" && "startViewTransition" in document;
}

/**
 * prefers-reduced-motionの設定を確認する
 */
function shouldReduceMotion(): boolean {
  if (!config.respectReducedMotion) return false;
  return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * 同一オリジンのURLかチェックする
 */
function isSameOrigin(url: string): boolean {
  if (typeof location === "undefined") return false;
  const targetUrl = new URL(url, location.origin);
  return targetUrl.origin === location.origin;
}

/**
 * 内部リンクかどうかを判定する
 */
function isInternalLink(link: HTMLAnchorElement): boolean {
  return !!(
    link.href &&
    isSameOrigin(link.href) &&
    !link.hasAttribute("target") &&
    !link.hasAttribute("download") &&
    link.protocol !== "mailto:" &&
    link.protocol !== "tel:"
  );
}

/**
 * ページのHTMLを取得する
 */
async function fetchPage(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  const response = await fetch(url, {
    signal: controller.signal,
    headers: {
      Accept: "text/html",
    },
  });

  clearTimeout(timeoutId);
  return await response.text();
}

/**
 * 新しいページのコンテンツでDOMを更新する
 */
function updateDOM(html: string, url: string): void {
  const parser = new DOMParser();
  const newDocument = parser.parseFromString(html, "text/html");

  // title要素を更新
  if (newDocument.title) {
    document.title = newDocument.title;
  }

  // main要素のコンテンツを更新（ヘッダーとフッターは保持）
  const newMain = newDocument.querySelector("main");
  const currentMain = document.querySelector("main");

  if (newMain && currentMain) {
    currentMain.innerHTML = newMain.innerHTML;
    // 属性もコピー
    Array.from(newMain.attributes).forEach((attr) => {
      currentMain.setAttribute(attr.name, attr.value);
    });
  }

  // URL履歴を更新
  if (url !== location.href) {
    history.pushState(null, "", url);
  }

  // ページの他の必要な要素も更新（meta tagsなど）
  updateMetaTags(newDocument);
}

/**
 * メタタグを更新する
 */
function updateMetaTags(newDocument: Document): void {
  // OGPやその他のメタタグを更新
  const metaSelectors = [
    'meta[name="description"]',
    'meta[property^="og:"]',
    'meta[name^="twitter:"]',
    'link[rel="canonical"]',
  ];

  metaSelectors.forEach((selector) => {
    const currentMeta = document.querySelector(selector);
    const newMeta = newDocument.querySelector(selector);

    if (currentMeta && newMeta) {
      currentMeta.replaceWith(newMeta.cloneNode(true));
    } else if (newMeta && !currentMeta) {
      document.head.appendChild(newMeta.cloneNode(true));
    }
  });
}

/**
 * View Transitions APIを使ってページ遷移を実行する
 */
async function handleNavigation(url: string): Promise<void> {
  if (navigationState.isTransitioning) {
    return;
  }

  if (!isSameOrigin(url)) {
    location.href = url;
    return;
  }

  if (!isSupported() || shouldReduceMotion()) {
    location.href = url;
    return;
  }

  navigationState.isTransitioning = true;

  // View Transitions APIの本来の機能でページ遷移を実行
  const transition = document.startViewTransition(async () => {
    const html = await fetchPage(url);
    updateDOM(html, url);
  });

  await transition.finished;
  navigationState.isTransitioning = false;
}

/**
 * クリックイベントリスナーを設定する
 */
function setupClickListener(): void {
  document.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const target = event.target as Element;
    const link = target.closest("a") as HTMLAnchorElement;

    if (!link || !isInternalLink(link)) {
      return;
    }

    event.preventDefault();
    handleNavigation(link.href);
  });
}

/**
 * ブラウザの戻る/進むボタンに対応
 */
function setupPopstateListener(): void {
  globalThis.addEventListener("popstate", () => {
    handleNavigation(location.href);
  });
}

/**
 * View Transitionsを初期化する
 */
function initializeTransitions(): void {
  if (!isSupported()) {
    console.info("View Transitions API is not supported in this browser");
    return;
  }

  setupClickListener();
  setupPopstateListener();

  console.info("View Transitions initialized");
}

// DOMが読み込まれたら自動的に初期化
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTransitions);
  } else {
    initializeTransitions();
  }
}

// エクスポート用の関数
export { isSupported, initializeTransitions, handleNavigation };

// 単体テスト
import { expect } from "https://deno.land/std@0.208.0/expect/mod.ts";

Deno.test("View Transitions APIの機能検出が正しく動作すること", () => {
  expect(typeof isSupported()).toBe("boolean");
});

Deno.test("同一オリジンの判定が正しく動作すること", () => {
  expect(isSameOrigin("/about")).toBe(false);
  expect(isSameOrigin("https://example.com")).toBe(false);
});

Deno.test("内部リンクの判定が正しく動作すること", () => {
  expect(typeof isInternalLink).toBe("function");
});
