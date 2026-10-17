"""按本站實際用字重新切分 Noto Serif TC。

用法：python3 tools/build_fonts.py <NotoSerifTC[wght].ttf>
第 0 塊放全站最常用字（每頁預載），其餘本站用字按常用程度每 150 字一塊，頁面用到才下載。
不收錄本站沒有用到的字：大型 unicode-range 會令手機排版明顯變慢。新增文章後重跑本程式；
build.mjs 會列出未收錄的字。
"""
import collections, glob, io, re, sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

root = Path(__file__).resolve().parent.parent
out = root / 'assets/fonts/site'
CORE = 700

pages = [p for p in glob.glob(str(root / '*.html')) + glob.glob(str(root / 'blog/**/*.html'), recursive=True)]
df = collections.Counter()
for p in pages:
    df.update(set(Path(p).read_text('utf8')))
for p in glob.glob(str(root / 'assets/js/*.js')):
    df.update(set(Path(p).read_text('utf8')))

src = TTFont(sys.argv[1])
cmap = set(src.getBestCmap())
used = [ord(c) for c, _ in df.most_common() if ord(c) in cmap]
ascii_ = [c for c in range(0x20, 0x7f) if c in cmap]
core = sorted(set(used[:CORE]) | set(ascii_))
rest = [c for c in used if c not in set(core)]
chunks = [core] + [sorted(rest[i:i + 150]) for i in range(0, len(rest), 150)]

def ranges(cps):
    parts, start = [], cps[0]
    for a, b in zip(cps, cps[1:] + [None]):
        if b != a + 1:
            parts.append(f'U+{start:x}' if start == a else f'U+{start:x}-{a:x}')
            start = b
    return ', '.join(parts)

for f in out.glob('*'):
    f.unlink()
out.mkdir(parents=True, exist_ok=True)
css = []
for weight in (400, 600):
    inst = instancer.instantiateVariableFont(TTFont(sys.argv[1]), {'wght': weight})
    buf = io.BytesIO(); inst.save(buf)
    for n, cps in enumerate(chunks):
        font = TTFont(io.BytesIO(buf.getvalue()))
        opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']
        s = subset.Subsetter(opts); s.populate(unicodes=cps); s.subset(font)
        name = f'serif-{weight}-{n}.woff2'
        font.flavor = 'woff2'; font.save(out / name)
        css.append(f"@font-face {{\n  font-family: 'Noto Serif TC';\n  font-style: normal;\n  font-weight: {weight};\n  font-display: swap;\n  src: url(./site/{name}) format('woff2');\n  unicode-range: {ranges(cps)};\n}}")

(out / 'coverage.txt').write_text(''.join(map(chr, sorted(set(used) | set(core)))), 'utf8')
fonts_css = root / 'assets/fonts/fonts.css'
manrope = re.findall(r"@font-face \{[^}]*Manrope[^}]*\}", fonts_css.read_text('utf8'))
fonts_css.write_text('\n'.join(css + manrope) + '\n', 'utf8')
print(len(chunks), 'chunks per weight; core', len(core), 'rest', len(rest))
for f in sorted(out.glob('*.woff2')):
    print(f.name, f.stat().st_size // 1024, 'KB')
