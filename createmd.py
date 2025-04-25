import os
import sys
from datetime import date, timedelta

BLOG_DIR = os.path.join("src", "contents", "blog")
DIARY_DIR = os.path.join("src", "contents", "diary")


def get_date(use_yesterday=False):
    target_date = date.today()
    if use_yesterday:
        target_date -= timedelta(days=1)
    return target_date


def generate_diary_template(date_str):
    return f"""---
title: "{date_str}の日記"
pubDate: "{date_str}"
---

## 今日やったこと

## 明日以降やりたいこと

"""


def generate_blog_template(date_str):
    return f"""---
title: ""
description: ""
pubDate: "{date_str}"
tags: []
published: false
---
"""


def create_markdown_file(file_path, content):
    dir_name = os.path.dirname(file_path)
    os.makedirs(dir_name, exist_ok=True)

    if os.path.exists(file_path):
        overwrite = input(
            f"ファイル '{file_path}' は既に存在します。上書きしますか？ (y/N): "
        ).lower()
        if overwrite not in ["y", "yes"]:
            print("ファイル作成をキャンセルしました。")
            return False

    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"ファイル '{file_path}' を作成しました。")
        return True
    except IOError as e:
        print(f"ファイルの書き込み中にエラーが発生しました: {e}")
        return False


def main():
    mode = "blog"
    if len(sys.argv) > 1 and sys.argv[1].lower() == "diary":
        mode = "diary"

    target_date = None
    date_str = ""

    if mode == "diary":
        use_yesterday_input = input("昨日の日付を使用しますか？ (y/N): ").lower()
        use_yesterday = use_yesterday_input in ["y", "yes"]
        target_date = get_date(use_yesterday)
        date_str = target_date.strftime("%Y-%m-%d")
        file_name = f"{date_str}.md"
        file_path = os.path.join(DIARY_DIR, file_name)
        content = generate_diary_template(date_str)
        create_markdown_file(file_path, content)

    elif mode == "blog":
        target_date = get_date()
        date_str = target_date.strftime("%Y-%m-%d")
        slug = ""
        try:
            while not slug:
                slug = input("記事のスラッグを入力してください: ")
        except KeyboardInterrupt:
            return
        final_slug = slug.strip().replace(" ", "-").lower()
        file_name = f"{date_str}-{final_slug}.md"
        file_path = os.path.join(BLOG_DIR, file_name)
        content = generate_blog_template(date_str)
        create_markdown_file(file_path, content)


if __name__ == "__main__":
    main()
