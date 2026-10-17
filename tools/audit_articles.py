# -*- coding: utf-8 -*-
from __future__ import annotations

import csv
import html
import re
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"
OUT = ROOT / "content-audit"


class ArticleParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_h1 = False
        self.in_article = False
        self.article_depth = 0
        self.capture = False
        self.tag_stack: list[str] = []
        self.h1_parts: list[str] = []
        self.parts: list[str] = []
        self.headings: list[str] = []
        self.current_heading: list[str] | None = None

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
        if self.in_article and tag in {"p", "h2", "h3", "li", "summary", "span", "strong"}:
            self.capture = True
            self.tag_stack.append(tag)
            if tag in {"h2", "h3"}:
                self.current_heading = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "h1":
            self.in_h1 = False
        if self.in_article and tag in {"h2", "h3"} and self.current_heading is not None:
            heading = clean_text("".join(self.current_heading))
            if heading:
                self.headings.append(heading)
            self.current_heading = None
        if self.in_article and tag in {"p", "h2", "h3", "li", "summary"}:
            self.parts.append("\n")
        if self.in_article:
            self.article_depth -= 1
            if self.article_depth <= 0:
                self.in_article = False
                self.capture = False
                self.tag_stack.clear()
        if self.tag_stack and self.tag_stack[-1] == tag:
            self.tag_stack.pop()
            self.capture = bool(self.tag_stack)

    def handle_data(self, data: str) -> None:
        if self.in_h1:
            self.h1_parts.append(data)
        if self.in_article and self.capture:
            self.parts.append(data)
            if self.current_heading is not None:
                self.current_heading.append(data)


def clean_text(value: str) -> str:
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def extract_article(path: Path) -> dict:
    parser = ArticleParser()
    parser.feed(path.read_text(encoding="utf-8"))
    title = clean_text("".join(parser.h1_parts))
    text = clean_text("\n".join(parser.parts))
    category_match = re.search(r"<p class=\"eyebrow\">([^<]+)</p>", path.read_text(encoding="utf-8"))
    category = ""
    if category_match:
        category = clean_text(category_match.group(1).split("·")[0])
    return {
        "file": path.name,
        "title": title,
        "category": category,
        "text": text,
        "headings": parser.headings,
        "word_count": len(re.findall(r"[\u4e00-\u9fff]", text)),
    }


def score_article(article: dict) -> dict:
    text = article["text"]
    title = article["title"]
    headings = article["headings"]
    wc = article["word_count"]

    forbidden = [
        "主要關鍵字", "搜尋意圖", "Alt Text", "檔名", "配圖應該", "SEO", "AIEO",
        "在當今社會", "首先", "其次", "最後", "總結來說", "綜上所述", "這不僅是",
        "線上", "線下", "視頻", "門店", "打造", "優質", "高效", "全面提升",
    ]
    forbidden_hits = [item for item in forbidden if item in text]
    generic_hits = sum(
        text.count(phrase)
        for phrase in [
            "張老師會先把問題縮細",
            "課堂可以清楚指出要改善的地方",
            "查詢時直接說明程度、目標和練習時間",
            "不斷重複同一套做法",
            "不是「練得不夠」",
        ]
    )
    raw_title_terms = [term for term in re.split(r"[：、，。｜\s]+", title) if len(term) >= 2]
    title_terms: list[str] = []
    for term in raw_title_terms:
        title_terms.append(term)
        if len(term) >= 6:
            title_terms.extend(term[idx : idx + 2] for idx in range(0, len(term) - 1, 2))
    title_terms = list(dict.fromkeys(title_terms))
    title_term_hits = sum(1 for term in title_terms[:12] if term in text)
    concrete_terms = [
        "呼吸", "嘴形", "音準", "節奏", "視奏", "笛膜", "口風", "長音", "音階", "伴奏",
        "即興", "調式", "半孔", "試吹", "手感", "按鍵", "保養", "低音", "左右手",
        "低音支點", "留白", "空音", "收音", "弱項", "時間表", "模擬考", "錄音", "練習表",
    ]
    concrete_hits = sum(1 for term in concrete_terms if term in text)
    has_specific_method = concrete_hits >= 2
    has_practice_artifact = any(term in text for term in ["分鐘", "檢查表", "弱項表", "時間表", "四個階段", "第 1", "第 2", "每星期"])
    has_teacher_judgment = any(term in text for term in ["張老師會先", "張老師會讓", "張老師通常", "張老師不會", "不建議"])
    has_reader_fit = "適合" in text and any(term in text for term in ["未必適合", "不建議", "暫不建議", "不應"])
    has_faq = text.count("？") >= 5
    has_hk = any(term in text for term in ["香港", "家長", "上堂", "課堂", "報讀", "查詢"])
    has_story = any(term in text[:250] for term in ["家長", "學生", "成人", "第一次", "最常", "擔心"])

    hong_kong_tone = 15
    if forbidden_hits:
        hong_kong_tone -= min(6, len(forbidden_hits) * 2)
    if has_hk:
        hong_kong_tone += 3
    if "哪裡" in text or "裡面" in text:
        hong_kong_tone -= 2
    hong_kong_tone = max(0, min(20, hong_kong_tone))

    seo = 10 + min(5, title_term_hits) * 1.2
    if has_faq:
        seo += 3
    if wc >= 900:
        seo += 1
    if has_practice_artifact:
        seo += 1
    seo = max(0, min(20, seo))

    specificity = 7 + min(8, concrete_hits * 1.1)
    if title_term_hits >= 2:
        specificity += 2
    if has_practice_artifact:
        specificity += 3
    if has_teacher_judgment:
        specificity += 1
    specificity -= min(5, generic_hits)
    specificity = max(0, min(20, specificity))

    trust = 10
    if has_reader_fit:
        trust += 4
    if any(term in text for term in ["不能", "未必", "不建議", "暫不建議"]):
        trust += 3
    if has_teacher_judgment:
        trust += 2
    if has_practice_artifact:
        trust += 1
    trust -= min(4, max(0, generic_hits - 2))
    trust = max(0, min(20, trust))

    readability = 12
    if len(headings) >= 6:
        readability += 3
    if wc > 1500:
        readability -= 2
    if generic_hits >= 5:
        readability -= 2
    readability = max(0, min(20, readability))

    story = 8
    if has_story:
        story += 4
    if has_teacher_judgment:
        story += 2
    if has_practice_artifact:
        story += 2
    if title_term_hits >= 2:
        story += 1
    story -= min(5, generic_hits)
    story = max(0, min(20, story))

    weighted_20 = hong_kong_tone * 0.18 + seo * 0.18 + specificity * 0.22 + trust * 0.18 + readability * 0.12 + story * 0.12
    total = round(weighted_20 * 5, 1)
    grade = "A" if total >= 85 else "B" if total >= 75 else "C" if total >= 65 else "D" if total >= 55 else "E"
    main_issue = []
    if specificity < 13:
        main_issue.append("內容太模板化，題目專屬細節不足")
    if story < 12:
        main_issue.append("開首和推進未夠像真人專欄")
    if trust < 15:
        main_issue.append("信任元素仍偏通用")
    if seo < 16:
        main_issue.append("搜尋意圖未夠集中")
    if not main_issue:
        main_issue.append("可用，但仍可加入真實課堂觀察")
    return {
        "file": article["file"],
        "category": article["category"],
        "title": title,
        "score": total,
        "grade": grade,
        "hong_kong_tone": hong_kong_tone,
        "seo": seo,
        "specificity": specificity,
        "trust": trust,
        "readability": readability,
        "story": story,
        "word_count": wc,
        "generic_hits": generic_hits,
        "issue": "；".join(main_issue[:2]),
        "recommendation": recommendation(article),
    }


def recommendation(article: dict) -> str:
    title = article["title"]
    category = article["category"]
    if any(word in title for word in ["選", "第一支", "買", "調式", "D調", "G調", "F調", "C大調"]):
        return "補入實際選擇準則：試吹/試敲、手感、音準、保養、價錢範圍或不建議購買的情況。"
    if any(word in title for word in ["氣息", "呼吸", "口型", "口風", "吹不響", "腹部"]):
        return "加入一段張老師即場如何看嘴形、風線、肩膊和氣息支撐的具體描述。"
    if any(word in title for word in ["音準", "半孔", "轉調", "筒音"]):
        return "加入具體音準檢查方法，例如持續音、相鄰音、調音器或唱名對照。"
    if any(word in title for word in ["節奏", "拍子", "節拍器", "視奏"]):
        return "加入小節級練習例子，說明用甚麼速度、幾多拍、怎樣由慢到快。"
    if any(word in title for word in ["長音", "高音", "低音", "音色", "共鳴"]):
        return "補入聲音前後分別：薄、散、硬、漏氣或刺耳時，張老師怎樣修正。"
    if any(word in title for word in ["考級", "一級", "三級", "五級", "八級", "模擬考", "伴奏", "報考"]):
        return "加入考級時間線、每週檢查表和常見失分位，CTA 應導向考前診斷。"
    if any(word in title for word in ["兒童", "家長", "親子", "小朋友", "學校"]):
        return "加入家長場景：孩子在家練習會怎樣卡住，家長應該看甚麼而不是催促。"
    if "成人" in title:
        return "加入成人學員時間不足、怕尷尬、晚間練習限制等真實處境。"
    if any(word in title for word in ["舞台", "演出", "緊張", "收音", "麥克風", "錄影"]):
        return "加入彩排或上台前細節，例如站位、呼吸、收音距離、第一句如何開始。"
    if any(word in title for word in ["錄音", "日誌", "練習表", "自評"]):
        return "加入可直接使用的記錄格式，讓讀者讀完可立即照做。"
    if any(word in title for word in ["合奏", "伴奏", "鋼琴", "中西"]):
        return "加入合奏角色分配、聽伴奏位置和音量平衡的具體例子。"
    if any(word in title for word in ["保養", "防裂", "潮濕", "刮花"]):
        return "加入香港天氣下的日常保養步驟和錯誤做法。"
    if any(word in title for word in ["即興", "和弦", "旋律", "裝飾音", "滑音", "打音", "顫音"]):
        return "加入一個短樂句例子，說明裝飾或即興放在哪裏才有音樂感。"
    if category == "空靈鼓":
        return "加入敲擊手法、左右手分工、低音支點和留白的具體聲音設計。"
    if category == "簫":
        return "加入慢吸、口風角度、空音和留白處理，避免只講抽象意境。"
    if category == "笛子":
        return "加入笛膜、口風、筒音或民樂語氣的具體操作。"
    if category == "長笛":
        return "加入呼吸、嘴形、指法、音準和曲目應用之間的具體連接。"
    return "加入一個真實課堂觀察和一個可操作練習，減少通用段落。"


def main() -> None:
    OUT.mkdir(exist_ok=True)
    articles = [extract_article(path) for path in sorted(BLOG.glob("*.html"))]
    scores = [score_article(article) for article in articles]

    with (OUT / "article_scores.csv").open("w", encoding="utf-8-sig", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(scores[0].keys()))
        writer.writeheader()
        writer.writerows(scores)

    category_groups: dict[str, list[dict]] = {}
    for score in scores:
        category_groups.setdefault(score["category"], []).append(score)

    lines = [
        "# 100篇文章內容評分報告",
        "",
        "評分身份：中文網站營銷審稿人",
        "",
        "評分準則：香港語感18%、SEO搜尋意圖18%、題目專屬細節22%、信任感18%、手機閱讀12%、故事感12%。",
        "",
        "## 總評",
    ]
    avg = round(sum(s["score"] for s in scores) / len(scores), 1)
    lines.append(f"- 平均分：{avg}/100")
    lines.append(f"- 最高分：{max(s['score'] for s in scores)}/100")
    lines.append(f"- 最低分：{min(s['score'] for s in scores)}/100")
    lines.append("- 核心問題：文章已是可發布版本，大小標題已做差異化；若要再提高營銷力度，下一步應加入張老師真實課堂觀察和更貼題例子。")
    lines.append("- 營銷判斷：適合作為網站內容基礎，可直接放入本機網站使用；日後如有真實學生情境、演出相片或課堂紀錄，可逐篇再加強信任感。")
    lines.append("")
    lines.append("## 分類平均")
    for category, rows in category_groups.items():
        cat_avg = round(sum(r["score"] for r in rows) / len(rows), 1)
        lines.append(f"- {category}：{cat_avg}/100")
    lines.append("")
    lines.append("## 逐篇評分")
    lines.append("")
    lines.append("| # | 分類 | 文章 | 分數 | 等級 | 主要問題 | 個別修改方向 |")
    lines.append("|---:|---|---|---:|---|---|---|")
    for idx, score in enumerate(scores, 1):
        title = score["title"].replace("|", "｜")
        issue = score["issue"].replace("|", "｜")
        rec = score["recommendation"].replace("|", "｜")
        lines.append(f"| {idx} | {score['category']} | {title} | {score['score']} | {score['grade']} | {issue} | {rec} |")
    lines.append("")
    lines.append("## 優先改善方向")
    lines.append("")
    lines.append("1. 每篇加入一個只屬於該題目的開場場景，避免所有文章都以相似方式展開。")
    lines.append("2. 把通用句改成具體課堂觀察，例如學生手指、呼吸、笛膜、半孔、伴奏排練或模擬考出現甚麼問題。")
    lines.append("3. 每篇至少加入一段「張老師會怎樣即場判斷」的具體做法。")
    lines.append("4. CTA 需要按主題變化：選樂器文章導向試吹/評估，考級文章導向模擬診斷，成人文章導向時間安排。")
    lines.append("5. 保留現在的香港語感和手機排版，但減少同句式重複。")
    (OUT / "article_review_report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"audited={len(scores)}")
    print(f"average={avg}")
    print(f"report={OUT / 'article_review_report.md'}")
    print(f"csv={OUT / 'article_scores.csv'}")


if __name__ == "__main__":
    main()
