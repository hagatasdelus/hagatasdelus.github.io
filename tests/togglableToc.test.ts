/**
 * togglableToc.test.ts - Tests for the togglableToc plugin
 */

import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import togglableToc, { createSlug } from "../plugins/togglableToc.ts";

// 型定義
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

type TreeNode = ElementNode | TextNode;

// テスト用のサンプルツリー
function createSampleTree() {
  return {
    type: "root" as const,
    children: [
      {
        type: "element" as const,
        tagName: "h1",
        properties: {},
        children: [{ type: "text" as const, value: "メインタイトル" }],
      },
      {
        type: "element" as const,
        tagName: "p",
        properties: {},
        children: [{ type: "text" as const, value: "はじめの段落です。" }],
      },
      {
        type: "element" as const,
        tagName: "h2",
        properties: {},
        children: [{ type: "text" as const, value: "章1: 概要" }],
      },
      {
        type: "element" as const,
        tagName: "p",
        properties: {},
        children: [{ type: "text" as const, value: "章1の内容です。" }],
      },
      {
        type: "element" as const,
        tagName: "h3",
        properties: {},
        children: [{ type: "text" as const, value: "章1-1: 詳細説明" }],
      },
      {
        type: "element" as const,
        tagName: "h2",
        properties: {},
        children: [{ type: "text" as const, value: "章2: 実装" }],
      },
    ],
  };
}

Deno.test("togglableToc - 基本的な目次生成", () => {
  const tree = {
    type: "root" as const,
    children: [
      {
        type: "element" as const,
        tagName: "h2",
        properties: {},
        children: [{ type: "text" as const, value: "セクション1" }],
      },
      {
        type: "element" as const,
        tagName: "h3",
        properties: {},
        children: [{ type: "text" as const, value: "サブセクション1-1" }],
      },
    ],
  };

  const plugin = togglableToc();
  const result = plugin(tree);

  // モバイル用とPC用のTOCが挿入されていることを確認
  const tocElements = result.children.filter(
    (child: TreeNode) =>
      child.type === "element" &&
      (child as ElementNode).properties?.class?.toString().includes("toc")
  );

  assertEquals(tocElements.length, 2, "TOC要素が2つ生成される");

  // モバイル用TOCが先頭に挿入されているか確認
  const mobileElement = result.children.find(
    (child: TreeNode) =>
      child.type === "element" &&
      (child as ElementNode).properties?.class
        ?.toString()
        .includes("toc-mobile")
  );
  assertExists(mobileElement, "モバイル用TOCが存在する");

  // PC用TOCが末尾付近に挿入されているか確認
  const pcElement = result.children.find(
    (child: TreeNode) =>
      child.type === "element" &&
      (child as ElementNode).properties?.class?.toString().includes("toc-pc")
  );
  assertExists(pcElement, "PC用TOCが存在する");

  console.log("✅ 基本的な目次生成テスト通過");
});

Deno.test("togglableToc - 日本語スラッグ生成", () => {
  const existingIds = new Set<string>();

  const slug1 = createSlug("日本語の見出し", existingIds);
  const slug2 = createSlug("English Heading", existingIds);
  const slug3 = createSlug("日本語の見出し", existingIds); // 重複

  assertEquals(slug1, "日本語の見出し", "日本語スラッグが正しく生成される");
  assertEquals(slug2, "english-heading", "英語スラッグが正しく生成される");
  assertEquals(slug3, "日本語の見出し-1", "重複回避が機能する");

  console.log("✅ 日本語スラッグ生成テスト通過");
});

Deno.test("togglableToc - 見出しがない場合", () => {
  const tree = {
    type: "root" as const,
    children: [
      {
        type: "element" as const,
        tagName: "p",
        properties: {},
        children: [{ type: "text" as const, value: "段落のみ" }],
      },
    ],
  };

  const plugin = togglableToc();
  const result = plugin(tree);

  // TOCが挿入されていないことを確認
  const tocElements = result.children.filter(
    (child: TreeNode) =>
      child.type === "element" &&
      (child as ElementNode).properties?.class?.toString().includes("toc")
  );

  assertEquals(tocElements.length, 0, "見出しがない場合はTOCが生成されない");

  console.log("✅ 見出しがない場合のテスト通過");
});

Deno.test("togglableToc - PC用とモバイル用の分離", () => {
  const tree = createSampleTree();

  const plugin = togglableToc({
    pcTitle: "📋 目次（PC）",
    mobileTitle: "📚 目次（モバイル）",
  });

  const result = plugin(tree);

  // PC用TOCがtoc-pcクラスを持っているか確認
  const pcElement = result.children.find(
    (child: TreeNode) =>
      child.type === "element" &&
      (child as ElementNode).properties?.class?.toString().includes("toc-pc")
  ) as ElementNode | undefined;

  assertExists(pcElement, "PC用TOCが存在する");

  // モバイル用TOCがtoc-mobileクラスを持っているか確認
  const mobileElement = result.children.find(
    (child: TreeNode) =>
      child.type === "element" &&
      (child as ElementNode).properties?.class
        ?.toString()
        .includes("toc-mobile")
  ) as ElementNode | undefined;

  assertExists(mobileElement, "モバイル用TOCが存在する");

  console.log("✅ PC用とモバイル用の分離テスト通過");
});

Deno.test("togglableToc - CSSクラスベースのインデント設定", () => {
  const tree = {
    type: "root" as const,
    children: [
      {
        type: "element" as const,
        tagName: "h2",
        properties: {},
        children: [{ type: "text" as const, value: "レベル2" }],
      },
      {
        type: "element" as const,
        tagName: "h3",
        properties: {},
        children: [{ type: "text" as const, value: "レベル3" }],
      },
      {
        type: "element" as const,
        tagName: "h4",
        properties: {},
        children: [{ type: "text" as const, value: "レベル4" }],
      },
    ],
  };

  const plugin = togglableToc();
  const result = plugin(tree);

  // TOC内のリストアイテムを確認
  const tocElement = result.children.find(
    (child: TreeNode) =>
      child.type === "element" &&
      (child as ElementNode).properties?.class
        ?.toString()
        .includes("toc-mobile")
  ) as ElementNode | undefined;

  assertExists(tocElement, "モバイル用TOCが存在する");

  // details要素内のulを探す
  if (tocElement && tocElement.type === "element") {
    const detailsElement = tocElement.children?.[0] as ElementNode | undefined;
    const ulElement = detailsElement?.children?.find(
      (child: TreeNode) =>
        child.type === "element" && (child as ElementNode).tagName === "ul"
    ) as ElementNode | undefined;

    assertExists(ulElement, "TOCリストが存在する");

    // リストアイテムのクラス名を確認（CSSでインデントが制御される）
    const listItems = ulElement?.children || [];
    const h2Item = listItems.find(
      (item: TreeNode) =>
        item.type === "element" &&
        (item as ElementNode).properties?.class
          ?.toString()
          .includes("toc-level-2")
    ) as ElementNode | undefined;
    const h3Item = listItems.find(
      (item: TreeNode) =>
        item.type === "element" &&
        (item as ElementNode).properties?.class
          ?.toString()
          .includes("toc-level-3")
    ) as ElementNode | undefined;
    const h4Item = listItems.find(
      (item: TreeNode) =>
        item.type === "element" &&
        (item as ElementNode).properties?.class
          ?.toString()
          .includes("toc-level-4")
    ) as ElementNode | undefined;

    assertExists(h2Item, "h2レベルのアイテムが存在する");
    assertExists(h3Item, "h3レベルのアイテムが存在する");
    assertExists(h4Item, "h4レベルのアイテムが存在する");

    // CSSクラス名が正しく設定されているかチェック
    if (h2Item && h2Item.type === "element") {
      assertEquals(
        (h2Item.properties?.class as string).includes("toc-level-2"),
        true,
        "h2アイテムに正しいクラスが設定される"
      );
    }
    if (h3Item && h3Item.type === "element") {
      assertEquals(
        (h3Item.properties?.class as string).includes("toc-level-3"),
        true,
        "h3アイテムに正しいクラスが設定される"
      );
    }
    if (h4Item && h4Item.type === "element") {
      assertEquals(
        (h4Item.properties?.class as string).includes("toc-level-4"),
        true,
        "h4アイテムに正しいクラスが設定される"
      );
    }
  }

  console.log("✅ CSSクラスベースのインデント設定テスト通過");
});

Deno.test("togglableToc - TOCハイライトスクリプトの挿入", async () => {
  const tree = createSampleTree();
  const plugin = togglableToc();
  const result = await plugin(tree);

  // スクリプトタグが追加されているかチェック
  const scriptElements = result.children.filter(
    (child: TreeNode) =>
      child.type === "element" && (child as ElementNode).tagName === "script"
  ) as ElementNode[];

  // PC用TOCが存在する場合にのみスクリプトタグが追加される
  const pcTocExists = result.children.some(
    (child: TreeNode) =>
      child.type === "element" &&
      (child as ElementNode).properties?.class?.toString().includes("toc-pc")
  );

  if (pcTocExists) {
    assertEquals(
      scriptElements.length >= 1,
      true,
      "PC用TOCが存在する場合、スクリプトタグが追加される"
    );

    const tocHighlightScript = scriptElements.find(
      (script) =>
        script.properties?.src === "/scripts/tocHighlight.js" &&
        script.properties?.type === "module"
    );

    assertExists(
      tocHighlightScript,
      "TOCハイライト用のスクリプトタグが正しく追加される"
    );
  }

  console.log("✅ TOCハイライトスクリプトの挿入テスト通過");
});
