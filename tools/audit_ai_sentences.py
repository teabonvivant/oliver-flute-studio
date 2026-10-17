# -*- coding: utf-8 -*-
from __future__ import annotations

import argparse
import csv
import html
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"
OUT = ROOT / "content-audit"


class ArticleTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_h1 = False
        self.in_article = False
        self.article_depth = 0
        self.capture_tag: str | None = None
        self.buffer: list[str] = []
        self.h1_parts: list[str] = []
        self.units: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = dict(attrs)
        cls = attrs_dict.get("class", "") or ""
        if tag == "h1":
            self.in_h1 = True
        if tag == "article" and "article-body" in cls:
            self.in_article = True
            self.article_depth = 1
        elif self.in_article:
            self.article_depth += 1
        if self.in_article and tag in {"p", "li", "summary"}:
            self.capture_tag = tag
            self.buffer = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "h1":
            self.in_h1 = False
        if self.capture_tag == tag:
            text = clean_text("".join(self.buffer))
            if text:
                self.units.append((tag, text))
            self.capture_tag = None
            self.buffer = []
        if self.in_article:
            self.article_depth -= 1
            if self.article_depth <= 0:
                self.in_article = False

    def handle_data(self, data: str) -> None:
        if self.in_h1:
            self.h1_parts.append(data)
        if self.capture_tag:
            self.buffer.append(data)


def clean_text(value: str) -> str:
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def split_sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[。！？；])", text)
    return [clean_text(part) for part in parts if clean_text(part)]


def extract_article(path: Path) -> dict:
    parser = ArticleTextParser()
    parser.feed(path.read_text(encoding="utf-8"))
    title = clean_text("".join(parser.h1_parts))
    category_match = re.search(r'<p class="eyebrow">([^<]+)</p>', path.read_text(encoding="utf-8"))
    category = clean_text(category_match.group(1).split("·")[0]) if category_match else ""
    sentences: list[tuple[str, str]] = []
    for tag, unit in parser.units:
        for sentence in split_sentences(unit):
            sentences.append((tag, sentence))
    return {
        "file": path.name,
        "title": title,
        "category": category,
        "sentences": sentences,
    }


RULES: list[tuple[str, str, int, str]] = [
    ("forced_template", r"張老師會把.+放回一段短句或一次練習裏聽", 4, "模板式教學總結"),
    ("forced_template", r"讓學生知道今天要改哪一點", 3, "過度整齊的 AI 式目的句"),
    ("forced_template", r"而不是回家盲目重複", 3, "常見 AI 對比套語"),
    ("forced_template", r"表面看似只是.+實際可能同時牽涉", 3, "抽象因果過度工整"),
    ("forced_template", r"不是孤立的一項；它會影響聲音、拍子、音準", 3, "跨題目通用句"),
    ("forced_template", r"做完後要能說出.+哪裏較穩", 3, "練習卡片硬塞題目詞"),
    ("forced_template", r"這一步主要聽.+有沒有改善", 3, "練習卡片硬塞題目詞"),
    ("forced_template", r"回到短句時，再確認.+是否仍然清楚", 3, "練習卡片硬塞題目詞"),
    ("forced_template", r"張老師會用這一步判斷.+是否需要再拆細", 3, "練習卡片硬塞題目詞"),
    ("forced_template", r"經常在同一個位置不穩、但未能判斷原因", 3, "受眾描述過度模板化"),
    ("forced_template", r"先把這一點拆開處理，不要急着把問題藏進完整曲裏", 3, "通用勸告句"),
    ("forced_template", r"要看原本習慣和練習密度", 3, "FAQ 套話"),
    ("forced_template", r"可聽、可改、可重複", 2, "三段式 AI 口號"),
    ("balanced_ai", r"不是.+而是", 2, "過度對稱轉折"),
    ("balanced_ai", r"不只是.+而是", 2, "過度對稱轉折"),
    ("balanced_ai", r"不應只.+而是", 2, "過度對稱轉折"),
    ("balanced_ai", r"先.+再.+再", 2, "步驟串接過整齊"),
    ("generic_marketing", r"打造|優質|高效|全面提升|在當今社會|總結來說|綜上所述", 4, "泛行銷或 AI 常用詞"),
]


def title_terms(title: str) -> list[str]:
    raw = [part for part in re.split(r"[：、，。｜\s]+", title) if len(part) >= 3]
    terms: list[str] = []
    for part in raw:
        terms.append(part)
        if len(part) >= 7:
            terms.append(part[:4])
    return list(dict.fromkeys(terms))


def audit_sentence(sentence: str, title: str) -> list[dict]:
    hits: list[dict] = []
    for rule, pattern, weight, note in RULES:
        if re.search(pattern, sentence):
            hits.append({"rule": rule, "weight": weight, "note": note})
    terms = title_terms(title)
    matched_terms = [term for term in terms if term in sentence]
    if len(matched_terms) >= 2 and len(sentence) < 80:
        hits.append({
            "rule": "keyword_stuffing",
            "weight": 2,
            "note": "短句內題目詞過密",
        })
    if any(sentence.count(term) >= 2 for term in terms):
        hits.append({
            "rule": "keyword_stuffing",
            "weight": 3,
            "note": "同一句重複題目詞",
        })
    return hits


def audit_articles() -> list[dict]:
    rows: list[dict] = []
    for path in sorted(BLOG.glob("*.html")):
        article = extract_article(path)
        for tag, sentence in article["sentences"]:
            hits = audit_sentence(sentence, article["title"])
            if not hits:
                continue
            rows.append({
                "file": article["file"],
                "category": article["category"],
                "title": article["title"],
                "tag": tag,
                "sentence": sentence,
                "rules": ",".join(hit["rule"] for hit in hits),
                "notes": "；".join(dict.fromkeys(hit["note"] for hit in hits)),
                "severity": sum(hit["weight"] for hit in hits),
            })
    return rows


def write_outputs(rows: list[dict], label: str) -> None:
    OUT.mkdir(exist_ok=True)
    csv_path = OUT / f"ai_sentence_audit_{label}.csv"
    md_path = OUT / f"ai_sentence_audit_{label}.md"
    fieldnames = ["file", "category", "title", "tag", "severity", "rules", "notes", "sentence"]
    with csv_path.open("w", encoding="utf-8-sig", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    by_file = Counter(row["file"] for row in rows)
    by_rule = Counter(rule for row in rows for rule in row["rules"].split(","))
    obvious_rows = [row for row in rows if int(row["severity"]) >= 3]
    forced_rows = [row for row in rows if "forced_template" in row["rules"].split(",")]
    total_articles = len(list(BLOG.glob("*.html")))
    flagged_articles = len(by_file)
    lines = [
        f"# AI句式審核（{label}）",
        "",
        "用途：找出中文文章中最像 AI 生成的句子，尤其是模板句、題目詞硬塞、抽象對稱句和 FAQ 套話。",
        "",
        "## 總覽",
        "",
        f"- 文章總數：{total_articles}",
        f"- 有標記文章：{flagged_articles}",
        f"- 標記句子：{len(rows)}",
        f"- 明顯 AI 句（嚴重度 >= 3）：{len(obvious_rows)}",
        f"- 強模板句：{len(forced_rows)}",
        f"- 平均每篇標記：{round(len(rows) / total_articles, 2) if total_articles else 0}",
        "",
        "## 規則分佈",
        "",
    ]
    for rule, count in by_rule.most_common():
        lines.append(f"- {rule}：{count}")
    lines.extend(["", "## 標記最多的文章", ""])
    for file, count in by_file.most_common(20):
        row = next(row for row in rows if row["file"] == file)
        lines.append(f"- {file}｜{row['title']}：{count}句")
    lines.extend(["", "## 高風險句子樣本", ""])
    for row in sorted(rows, key=lambda item: (-item["severity"], item["file"]))[:80]:
        lines.append(f"### {row['title']}（{row['file']}）")
        lines.append(f"- 規則：{row['notes']}｜嚴重度 {row['severity']}")
        lines.append(f"- 句子：{row['sentence']}")
        lines.append("")
    md_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"rows={len(rows)}")
    print(f"flagged_articles={flagged_articles}")
    print(f"report={md_path}")
    print(f"csv={csv_path}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--label", default="latest")
    args = parser.parse_args()
    write_outputs(audit_articles(), args.label)


if __name__ == "__main__":
    main()
