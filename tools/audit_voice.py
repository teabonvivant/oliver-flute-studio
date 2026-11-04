"""量度文章的文氣指標，用來看節奏、主語、句式有幾單一。

用法：python3 tools/audit_voice.py [slug ...]
不給 slug 就跑全部 content/notes/*.md，輸出 content-audit/voice_audit.md。
指標是啟發式，用來比較先後，不用來評分。
"""
import re
import statistics
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NOTES = ROOT / "content" / "notes"
OUT = ROOT / "content-audit" / "voice_audit.md"

PATTERNS = {
    "不是A而是B": r"不是[^。！？\n]{1,30}而是",
    "不僅更": r"不僅[^。！？\n]{1,20}更",
    "先再": r"先[^。！？\n]{1,25}再",
    "反而": r"反而",
    "可以": r"可以",
    "不必/不用": r"(不必|不用)",
    "必須/應該/不要": r"(必須|應該|不要)",
    "首先其次最後": r"(首先|其次|最後，|總結|綜上)",
}
IDIOMS = ["按圖索驥", "欲速不達", "一曝十寒", "大興土木", "過猶不及", "循序漸進",
          "水到渠成", "差之毫釐", "事半功倍", "事倍功半", "一氣呵成", "恰到好處",
          "潛移默化", "耳濡目染", "得心應手", "游刃有餘", "不謀而合", "相輔相成"]
IMPERATIVE_START = re.compile(r"^(先|再|把|用|試|找|揀|挑|調|吹|聽|看|記|留|寫|選|放|開|關|問|講|說|做|練|停|減|加|改|檢查|留意|注意|不要|不必|避免|保持|確認)")


def body(text: str) -> str:
    text = re.sub(r"^---.*?---", "", text, flags=re.S)
    text = re.sub(r"^##+ .*$", "", text, flags=re.M)
    text = re.sub(r"^### .*$", "", text, flags=re.M)
    text = re.sub(r"^- .*$", "", text, flags=re.M)
    return text.strip()


def headings(text: str):
    src = re.sub(r"^---.*?---", "", text, flags=re.S)
    return [h for h in re.findall(r"^## (.+?)(?: \{#.*\})?$", src, flags=re.M) if h != "常見問題"]


def analyse(text: str):
    b = body(text)
    sents = [s for s in re.split(r"(?<=[。！？])", b) if s.strip()]
    lens = [len(re.sub(r"\s", "", s)) for s in sents]
    paras = [p for p in b.split("\n\n") if p.strip()]
    plens = [len(re.sub(r"[\s。！？]", "", p)) for p in paras]
    pcount = [len([s for s in re.split(r"(?<=[。！？])", p) if s.strip()]) for p in paras]
    heads = headings(text)
    qheads = [h for h in heads if h.endswith("？")]
    return {
        "chars": len(re.sub(r"\s", "", b)),
        "sents": len(sents),
        "avg_sent": statistics.mean(lens) if lens else 0,
        "sd_sent": statistics.pstdev(lens) if len(lens) > 1 else 0,
        "short_ratio": sum(1 for x in lens if x <= 12) / len(lens) if lens else 0,
        "long_ratio": sum(1 for x in lens if x >= 45) / len(lens) if lens else 0,
        "avg_para": statistics.mean(plens) if plens else 0,
        "paras": len(paras),
        "avg_sent_per_para": statistics.mean(pcount) if pcount else 0,
        "paras_under_2sent": sum(1 for c in pcount if c <= 2) / len(pcount) if pcount else 0,
        "heads": len(heads),
        "qhead_ratio": len(qheads) / len(heads) if heads else 0,
        "wo": len(re.findall(r"我", b)) / max(len(re.sub(r"\s", "", b)), 1) * 1000,
        "idioms": sum(b.count(i) for i in IDIOMS),
        "patterns": {k: len(re.findall(v, b)) for k, v in PATTERNS.items()},
        "imperative": sum(1 for s in sents if IMPERATIVE_START.match(s.strip())) / len(sents) if sents else 0,
    }


def fmt_row(name, m):
    p = m["patterns"]
    return (f"| {name} | {m['chars']} | {m['avg_sent']:.0f} | {m['sd_sent']:.0f} | "
            f"{m['short_ratio']*100:.0f}% | {m['long_ratio']*100:.0f}% | {m['avg_sent_per_para']:.1f} | "
            f"{m['qhead_ratio']*100:.0f}% | {m['wo']:.1f} | {m['idioms']} | {m['imperative']*100:.0f}% | "
            f"{p['不是A而是B']} / {p['先再']} / {p['可以']} |")


HEAD = ("| 篇 | 字 | 平均句長 | 句長SD | 短句% | 長句% | 段均句數 | 問句標題% | 「我」/千字 | 成語 | 祈使句首% | 不是…而是／先…再／可以 |\n"
        "|---|---|---|---|---|---|---|---|---|---|---|---|")


def main():
    targets = sys.argv[1:]
    files = sorted(NOTES.glob("*.md"))
    if targets:
        files = [f for f in files if f.stem in targets]
    rows, allm = [], []
    for f in files:
        m = analyse(f.read_text("utf8"))
        allm.append(m)
        rows.append(fmt_row(f.stem, m))
    total = {k: statistics.mean([m[k] for m in allm]) for k in
             ("avg_sent", "sd_sent", "short_ratio", "long_ratio", "avg_sent_per_para",
              "qhead_ratio", "wo", "idioms", "imperative")}
    total["chars"] = sum(m["chars"] for m in allm)
    total["patterns"] = {k: sum(m["patterns"][k] for m in allm) for k in PATTERNS}
    lines = ["# 文氣指標（latest）", "",
             "啟發式量度，只看趨勢：句長是否單一、段落是否太碎、主語在不在場、小標題是否全用問句。", "",
             HEAD] + rows + ["", "## 全站平均", "",
             fmt_row("**全部**", total), ""]
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text("\n".join(lines), "utf8")
    print(f"{len(files)} 篇 → {OUT}")


if __name__ == "__main__":
    main()
