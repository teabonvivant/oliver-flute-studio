# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urldefrag, urlparse


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "validation" / "static_content_validation.json"


class StaticParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_title = False
        self.in_heading: str | None = None
        self.buffer: list[str] = []
        self.title = ""
        self.meta_description = ""
        self.h1: list[str] = []
        self.headings: list[tuple[str, str]] = []
        self.links: list[str] = []
        self.images: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = dict(attrs)
        if tag == "title":
            self.in_title = True
            self.buffer = []
        elif tag in {"h1", "h2", "h3"}:
            self.in_heading = tag
            self.buffer = []
        elif tag == "meta" and (attrs_dict.get("name") or "").lower() == "description":
            self.meta_description = clean(attrs_dict.get("content") or "")
        elif tag == "a" and attrs_dict.get("href"):
            self.links.append(attrs_dict["href"] or "")
        elif tag == "img":
            self.images.append({"src": attrs_dict.get("src") or "", "alt": attrs_dict.get("alt") or ""})

    def handle_endtag(self, tag: str) -> None:
        if tag == "title" and self.in_title:
            self.title = clean("".join(self.buffer))
            self.in_title = False
            self.buffer = []
        elif self.in_heading == tag:
            text = clean("".join(self.buffer))
            if tag == "h1" and text:
                self.h1.append(text)
            if text:
                self.headings.append((tag, text))
            self.in_heading = None
            self.buffer = []

    def handle_data(self, data: str) -> None:
        if self.in_title or self.in_heading:
            self.buffer.append(data)


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def html_files() -> list[Path]:
    files = [path for path in ROOT.glob("*.html") if path.is_file()]
    files.extend(path for path in (ROOT / "blog").glob("*.html") if path.is_file())
    return sorted(files)


def parse_html(path: Path) -> StaticParser:
    parser = StaticParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def local_target_exists(source: Path, href: str) -> bool:
    parsed = urlparse(href)
    if parsed.scheme or parsed.netloc or href.startswith(("mailto:", "tel:", "#")):
        return True
    target, _ = urldefrag(href)
    if not target:
        return True
    if target.startswith("/"):
        candidate = ROOT / target.lstrip("/")
    else:
        candidate = (source.parent / target).resolve()
    if candidate.is_dir():
        candidate = candidate / "index.html"
    return candidate.exists()


def validate() -> dict:
    files = html_files()
    blog_files = sorted((ROOT / "blog").glob("*.html"))
    errors: list[str] = []
    warnings: list[str] = []
    meta_lengths: list[int] = []
    title_counter: Counter[str] = Counter()
    heading_counter: Counter[str] = Counter()
    missing_alt: list[str] = []
    broken_links: list[str] = []
    artifact_hits: list[str] = []

    artifact_terms = ["主要關鍵字", "搜尋意圖", "Alt Text", "AIEO", "SEO", "在當今社會", "總結來說", "綜上所述"]

    for path in files:
        rel = path.relative_to(ROOT).as_posix()
        raw = path.read_text(encoding="utf-8")
        parser = parse_html(path)
        if not parser.title:
            errors.append(f"{rel}: missing <title>")
        else:
            title_counter[parser.title] += 1
        if not parser.meta_description:
            errors.append(f"{rel}: missing meta description")
        else:
            meta_lengths.append(len(parser.meta_description))
            if len(parser.meta_description) < 80:
                warnings.append(f"{rel}: short meta description ({len(parser.meta_description)})")
        if not parser.h1:
            errors.append(f"{rel}: missing h1")
        for tag, text in parser.headings:
            if tag in {"h2", "h3"}:
                heading_counter[text] += 1
        for image in parser.images:
            if image["src"] and not clean(image["alt"]):
                missing_alt.append(f"{rel}: {image['src']}")
        for href in parser.links:
            if not local_target_exists(path, href):
                broken_links.append(f"{rel}: {href}")
        for term in artifact_terms:
            if term in raw:
                artifact_hits.append(f"{rel}: {term}")

    duplicate_titles = {title: count for title, count in title_counter.items() if count > 1}
    duplicate_headings_over_20 = {heading: count for heading, count in heading_counter.items() if count > 20}

    if len(blog_files) != 100:
        errors.append(f"blog article count expected 100, got {len(blog_files)}")
    if missing_alt:
        errors.extend(f"missing image alt: {item}" for item in missing_alt[:20])
    if broken_links:
        errors.extend(f"broken local link: {item}" for item in broken_links[:30])
    if artifact_hits:
        errors.extend(f"copy artifact: {item}" for item in artifact_hits[:30])
    if duplicate_titles:
        errors.append(f"duplicate titles: {len(duplicate_titles)}")

    report = {
        "html_pages": len(files),
        "blog_articles": len(blog_files),
        "min_meta_length": min(meta_lengths) if meta_lengths else 0,
        "max_meta_length": max(meta_lengths) if meta_lengths else 0,
        "duplicate_titles": duplicate_titles,
        "duplicate_h2_h3_over_20": duplicate_headings_over_20,
        "missing_alt_count": len(missing_alt),
        "broken_local_link_count": len(broken_links),
        "artifact_hit_count": len(artifact_hits),
        "warnings": warnings[:50],
        "errors": errors,
    }
    return report


def main() -> None:
    OUT.parent.mkdir(exist_ok=True)
    report = validate()
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"html_pages={report['html_pages']}")
    print(f"blog_articles={report['blog_articles']}")
    print(f"errors={len(report['errors'])}")
    print(f"report={OUT}")


if __name__ == "__main__":
    main()
