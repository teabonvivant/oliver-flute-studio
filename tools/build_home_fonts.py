"""按首頁（home-v2.html）實際用字，建立一個可變字重 woff2 子集。

用法：python3 tools/build_home_fonts.py <NotoSerifTC[wght].ttf>
全站字型分成 9 塊，首頁會牽動其中 8 塊（約 1.2 MB）；首頁專屬檔只收首頁用到的 5xx 字，
一個檔案、wght 300–900 全部可用，約 230 KB。改了首頁文字後要重跑。
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools import subset

root = Path(__file__).resolve().parent.parent
out = root / 'assets/fonts/home'
name = 'serif-var.woff2'

chars = set((root / 'home-v2.html').read_text('utf8')) | set((root / 'assets/js/home-v2.js').read_text('utf8'))
chars |= {chr(c) for c in range(0x20, 0x7f)}

src = TTFont(sys.argv[1])
cmap = set(src.getBestCmap())
codes = sorted(ord(c) for c in chars if ord(c) in cmap)
missing = [c for c in chars if ord(c) > 0x2e7f and ord(c) not in cmap]
if missing:
    print('來源缺 %d 字：%s' % (len(missing), ''.join(missing)))

opt = subset.Options()
opt.flavor = 'woff2'
opt.layout_features = ['*']
opt.desubroutinize = True
sub = subset.Subsetter(options=opt)
sub.populate(unicodes=codes)
sub.subset(src)
src.flavor = 'woff2'

out.mkdir(parents=True, exist_ok=True)
src.save(out / name)
(out / 'fonts.css').write_text(
    "@font-face{font-family:'Noto Serif TC';font-style:normal;font-weight:300 900;"
    "font-display:swap;src:url(assets/fonts/home/%s) format('woff2')}\n" % name, 'utf8')
print('%d 字 %d KB' % (len(codes), (out / name).stat().st_size // 1024))
