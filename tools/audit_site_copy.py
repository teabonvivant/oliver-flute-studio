# -*- coding: utf-8 -*-
from __future__ import annotations

import argparse
import csv
import html
import re
from collections import Counter, defaultdict
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content-audit"


BLOCK_TAGS = {"title", "h1", "h2", "h3", "p", "li", "summary", "button", "a", "figcaption"}
SKIP_TAGS = {"script", "style", "svg", "noscript", "template"}


class CopyParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.skip_depth = 0
        self.capture_tag: str | None = None
        self.buffer: list[str] = []
        self.units: list[tuple[str, str]] = []
        self.meta_descriptions: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = dict(attrs)
        if tag in SKIP_TAGS:
            self.skip_depth += 1
            return
        if tag == "meta" and (attrs_dict.get("name") or "").lower() == "description":
            content = clean_text(attrs_dict.get("content") or "")
            if content:
                self.meta_descriptions.append(content)
            return
        if self.skip_depth:
            return
        if tag in BLOCK_TAGS and self.capture_tag is None:
            self.capture_tag = tag
            self.buffer = []

    def handle_endtag(self, tag: str) -> None:
        if tag in SKIP_TAGS and self.skip_depth:
            self.skip_depth -= 1
            return
        if self.skip_depth:
            return
        if self.capture_tag == tag:
            text = clean_text("".join(self.buffer))
            if useful_unit(text):
                self.units.append((tag, text))
            self.capture_tag = None
            self.buffer = []

    def handle_data(self, data: str) -> None:
        if self.skip_depth or self.capture_tag is None:
            return
        self.buffer.append(data)


def clean_text(value: str) -> str:
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def useful_unit(text: str) -> bool:
    if not text:
        return False
    if len(text) < 5:
        return False
    if re.fullmatch(r"[\d\s/|:：.-]+", text):
        return False
    return True


def split_sentences(text: str) -> list[str]:
    if len(text) <= 28 and not re.search(r"[。！？；]", text):
        return [text]
    parts = re.split(r"(?<=[。！？；])", text)
    return [clean_text(part) for part in parts if useful_unit(clean_text(part))]


def title_terms(title: str) -> list[str]:
    raw = [part for part in re.split(r"[：、，。｜\s|-]+", title) if len(part) >= 3]
    terms: list[str] = []
    for part in raw:
        terms.append(part)
        if len(part) >= 7:
            terms.append(part[:4])
    return list(dict.fromkeys(terms))


RULES: list[tuple[str, str, int, str]] = [
    ("forced_template", r"張老師會把.+放回一段短句或一次練習裏聽", 4, "模板式教學總結"),
    ("forced_template", r"讓學生知道今天要改哪一點", 3, "過度整齊的目的句"),
    ("forced_template", r"而不是回家盲目重複", 3, "常見 AI 對比套語"),
    ("forced_template", r"表面看似只是.+實際可能同時牽涉", 3, "抽象因果過度工整"),
    ("forced_template", r"不是孤立的一項；它會影響聲音、拍子、音準", 3, "跨題目通用句"),
    ("balanced_ai", r"不是.+而是", 2, "過度對稱轉折"),
    ("balanced_ai", r"不只是.+而是", 2, "過度對稱轉折"),
    ("balanced_ai", r"不應只.+而是", 2, "過度對稱轉折"),
    ("balanced_ai", r"重點不是.+而是", 2, "過度對稱轉折"),
    ("generic_marketing", r"打造|優質|高效|全面提升|在當今社會|總結來說|綜上所述|這不僅是", 4, "泛行銷或 AI 常用詞"),
    ("mainland_tone", r"視頻|線下|門店|哪裡|裡面", 3, "非香港常用字詞"),
    ("seo_artifact", r"主要關鍵字|搜尋意圖|Alt Text|AIEO|SEO", 4, "製作備註漏出"),
]


def audit_sentence(sentence: str, title: str, tag: str) -> list[dict]:
    hits: list[dict] = []
    if len(sentence) < 10 and tag not in {"title", "meta"}:
        return hits
    for rule, pattern, weight, note in RULES:
        if re.search(pattern, sentence):
            hits.append({"rule": rule, "weight": weight, "note": note})
    terms = title_terms(title)
    matched_terms = [term for term in terms if term in sentence]
    if tag in {"p", "li", "summary", "meta"} and len(matched_terms) >= 2 and len(sentence) < 90:
        hits.append({"rule": "keyword_stuffing", "weight": 2, "note": "短句內題目詞過密"})
    if any(sentence.count(term) >= 2 for term in terms):
        hits.append({"rule": "keyword_stuffing", "weight": 3, "note": "同一句重複題目詞"})
    return hits


def extract_file(path: Path) -> dict:
    raw = path.read_text(encoding="utf-8")
    parser = CopyParser()
    parser.feed(raw)
    title_match = re.search(r"<title>(.*?)</title>", raw, flags=re.S | re.I)
    page_title = clean_text(title_match.group(1)) if title_match else path.stem
    units = [("meta", item) for item in parser.meta_descriptions] + parser.units
    return {"path": path, "title": page_title, "units": units}


def html_files() -> list[Path]:
    files = [path for path in ROOT.glob("*.html") if path.is_file()]
    files.extend(path for path in (ROOT / "blog").glob("*.html") if path.is_file())
    return sorted(files)


def audit_site() -> list[dict]:
    rows: list[dict] = []
    seen_long: defaultdict[str, list[str]] = defaultdict(list)
    for path in html_files():
        page = extract_file(path)
        rel = path.relative_to(ROOT).as_posix()
        for tag, unit in page["units"]:
            for sentence in split_sentences(unit):
                if len(sentence) >= 24:
                    seen_long[sentence].append(rel)
                hits = audit_sentence(sentence, page["title"], tag)
                if hits:
                    rows.append({
                        "file": rel,
                        "tag": tag,
                        "severity": sum(hit["weight"] for hit in hits),
                        "rules": ",".join(hit["rule"] for hit in hits),
                        "notes": "；".join(dict.fromkeys(hit["note"] for hit in hits)),
                        "sentence": sentence,
                    })
    for sentence, files in seen_long.items():
        unique_files = sorted(set(files))
        if len(unique_files) >= 8 and "張老師" in sentence:
            rows.append({
                "file": ",".join(unique_files[:4]) + ("..." if len(unique_files) > 4 else ""),
                "tag": "duplicate",
                "severity": 3,
                "rules": "duplicate_copy",
                "notes": f"同一句跨 {len(unique_files)} 頁重複",
                "sentence": sentence,
            })
    return rows


def write_outputs(rows: list[dict], label: str) -> None:
    OUT.mkdir(exist_ok=True)
    csv_path = OUT / f"site_copy_audit_{label}.csv"
    md_path = OUT / f"site_copy_audit_{label}.md"
    fieldnames = ["file", "tag", "severity", "rules", "notes", "sentence"]
    with csv_path.open("w", encoding="utf-8-sig", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    by_file = Counter(row["file"] for row in rows)
    by_rule = Counter(rule for row in rows for rule in row["rules"].split(","))
    high_rows = [row for row in rows if int(row["severity"]) >= 4]
    forced_rows = [row for row in rows if "forced_template" in row["rules"].split(",")]
    lines = [
        f"# 全站中文文案審核（{label}）",
        "",
        "用途：檢查所有 HTML 可見文案與 meta 描述，找出 AI 模板句、過度對稱轉折、製作備註外漏、非香港常用詞和跨頁重複句。",
        "",
        "## 總覽",
        "",
        f"- HTML頁面：{len(html_files())}",
        f"- 有標記頁面：{len(by_file)}",
        f"- 標記句子：{len(rows)}",
        f"- 高風險句（嚴重度 >= 4）：{len(high_rows)}",
        f"- 強模板句：{len(forced_rows)}",
        "",
        "## 規則分佈",
        "",
    ]
    for rule, count in by_rule.most_common():
        lines.append(f"- {rule}：{count}")
    lines.extend(["", "## 標記最多的頁面", ""])
    for file, count in by_file.most_common(20):
        lines.append(f"- {file}：{count}句")
    lines.extend(["", "## 高風險句子樣本", ""])
    for row in sorted(rows, key=lambda item: (-int(item["severity"]), item["file"]))[:120]:
        lines.append(f"### {row['file']}｜{row['tag']}")
        lines.append(f"- 規則：{row['notes']}｜嚴重度 {row['severity']}")
        lines.append(f"- 句子：{row['sentence']}")
        lines.append("")
    md_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"rows={len(rows)}")
    print(f"high_risk={len(high_rows)}")
    print(f"forced_template={len(forced_rows)}")
    print(f"report={md_path}")
    print(f"csv={csv_path}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--label", default="latest")
    args = parser.parse_args()
    write_outputs(audit_site(), args.label)


if __name__ == "__main__":
    main()
