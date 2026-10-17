import re, pathlib
D = pathlib.Path(__file__).parent
src = (D/'r3/4.html').read_text()
# role: original colour
ROLES = dict(bg='#f5f1ea', ink='#2c2a26', acc='#5f7d6c', accd='#4e6a5b', mut='#6b665d', meta='#8a7f6e',
             b1='#cfe0d4', b2='#f2d3c2', b3='#efe2b8', sh='#6b5a44')
P = [
 ('0','霧光鼠尾草（現用）','沙色、鼠尾草綠、蜜桃柔光', {}),
 ('1','霧藍晨曦','淡灰藍、石板藍、杏粉柔光', dict(bg='#f2f4f6',ink='#24303a',acc='#4a6a86',accd='#3b5770',mut='#5b6874',meta='#7a8590',b1='#cfdcea',b2='#f3d9cf',b3='#e3def0',sh='#3c4a5a')),
 ('2','玫瑰陶土','暖米、陶土紅、玫瑰與鼠尾草柔光', dict(bg='#f7f0ec',ink='#33261f',acc='#a5583f',accd='#8c4a35',mut='#6e5d55',meta='#8d7a70',b1='#f2cfc4',b2='#e9dcc4',b3='#d9e3d6',sh='#6b4a3c')),
 ('3','薰衣草霧','淡紫灰、紫藤、粉霧柔光', dict(bg='#f4f2f7',ink='#2b2733',acc='#6a5a92',accd='#584a7d',mut='#67626f',meta='#85808e',b1='#ddd5ef',b2='#f3d6df',b3='#d6e6ec',sh='#4a4060')),
 ('4','青瓷','青瓷白、松石青、米黃柔光', dict(bg='#eff4f2',ink='#1f2e2b',acc='#3b756d',accd='#2f625b',mut='#596966',meta='#788684',b1='#c7e3dc',b2='#e9e2c6',b3='#d5e0ef',sh='#2f4a45')),
 ('5','蜂蜜燕麥','燕麥白、蜂蜜金、奶茶柔光', dict(bg='#f7f2e8',ink='#2f2819',acc='#86652a',accd='#6f531f',mut='#6c6250',meta='#8a7f68',b1='#f1dfb1',b2='#f0d2bf',b3='#dbe5cf',sh='#6b5530')),
 ('6','海鹽珊瑚','海鹽白、珊瑚橙、淺海柔光', dict(bg='#f3f6f6',ink='#22302f',acc='#b04f3c',accd='#963f2f',mut='#5d6a69',meta='#7d8988',b1='#cde6e6',b2='#f6d4c9',b3='#f1e6c4',sh='#3f5554')),
 ('7','墨灰朱砂','宣紙灰、墨色、一點朱紅', dict(bg='#f4f3f1',ink='#222120',acc='#ad3a2d',accd='#922f24',mut='#625d57',meta='#837d76',b1='#e0ded9',b2='#f0d8d1',b3='#e7e4da',sh='#3a3632')),
]
def lum(h):
    h=h.lstrip('#')[:6]; c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=.03928 else ((x+.055)/1.055)**2.4 for x in c]
    return .2126*c[0]+.7152*c[1]+.0722*c[2]
def cr(a,b):
    A,B=sorted([lum(a),lum(b)],reverse=True); return (A+.05)/(B+.05)
nav = ''.join(f'<a href="{k}.html" title="{n}" style="background:{(dict(ROLES,**c))["acc"]}"></a>' for k,n,_,c in P)
cards=[]
for k,name,desc,c in P:
    pal = dict(ROLES, **c)
    html = src
    for role, orig in ROLES.items():
        html = html.replace(orig, pal[role])
    html = html.replace('<title>04｜霧光玻璃</title>', f'<title>04 霧光玻璃｜{name}</title>')
    html = re.sub(r'<a class="tag" href="index.html">.*?</a>',
        f'<div class="tag"><a href="index.html">← {k}・{name}</a><span class="sw">{nav}</span></div>', html)
    html = html.replace('</style>', '.tag{display:flex;gap:10px;align-items:center}.sw{display:flex;gap:6px}.sw a{width:16px;height:16px;border-radius:50%;border:2px solid #fff}</style>',1)
    (D/f'r4/{k}.html').write_text(html)
    checks = dict(btn=cr('#ffffff',pal['acc']), acc_on_bg=cr(pal['acc'],pal['bg']), mut_on_bg=cr(pal['mut'],pal['bg']), ink=cr(pal['ink'],pal['bg']))
    print(k,name,{a:round(b,2) for a,b in checks.items()})
    sw=''.join(f'<i style="background:{pal[r]}"></i>' for r in ('bg','b1','b2','b3','acc','ink'))
    cards.append(f'<a class="k" href="{k}.html"><img src="shots/{k}.png" alt=""><div class="t"><b>{k}　{name}</b><span>{desc}</span><div class="sw">{sw}</div></div></a>')
idx = f'''<!doctype html><html lang="zh-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>04 霧光玻璃｜8 款配色</title>
<style>*{{box-sizing:border-box}}body{{margin:0;font:16px/1.6 "Noto Sans TC",sans-serif;background:#f2f2f2;padding:4vw;color:#111}}h1{{margin:0 0 6px}}p.s{{margin:0 0 24px;opacity:.7}}.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:22px}}.k{{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 14px #0001;color:inherit;text-decoration:none}}.k img{{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;display:block}}.t{{padding:14px 16px}}.t b{{display:block;font-size:17px}}.t span{{font-size:14px;opacity:.7}}.sw{{display:flex;gap:6px;margin-top:10px}}.sw i{{width:26px;height:26px;border-radius:50%;border:1px solid #0002}}</style></head><body>
<h1>04 霧光玻璃 · 8 款配色</h1><p class="s">版面和動畫完全相同，只換顏色。0 號是現用配色。點入每款後，左下角圓點可直接切換其他配色比較。</p><div class="g">{"".join(cards)}</div></body></html>'''
(D/'r4/index.html').write_text(idx)
