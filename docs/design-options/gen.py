import os
D=os.path.dirname(os.path.abspath(__file__))
TOOLS=[("調音器","音名、簡譜與音分"),("節拍器","細分拍與逐步加速"),("長笛指法表","三十四個基本指法"),("譜間","簡譜打譜工作室"),("長笛紙牌","網上翻卡先試玩")]
COURSES=[("長笛課程","由第一個自然的音，走到有呼吸、有方向的旋律。","flute"),("笛子課程","聽見竹聲的明亮，也學會其中的細節與分寸。","dizi"),("洞簫課程","從一道氣流開始，慢慢聽清一個音的來去。","xiao"),("空靈鼓課程","讓每一下敲擊有位置，讓聲音之間有回應。","tongue-drum")]
PATHS=[("成人入門","第一次學，或想重新開始"),("家長指南","陪孩子認識音樂，慢慢建立習慣"),("考級與進階","整理技巧、作品與考級準備")]
ARTS=[("長笛","打開笛盒之後：把練習的首五分鐘留給聲音"),("樂理","拍子像腳步，節奏像說話"),("家長陪練","陪練時少說一句「又錯了」，可以換成甚麼？")]
NAV=["課程","練習室","出品","學習指南","音樂手記","聯絡"]
H1a,H1b="把一個音聽清楚，","讓音樂慢慢走近。"
SUB="長笛、笛子、洞簫與空靈鼓。從自然的聲音、清楚的拍子，到一句有呼吸的旋律。"
CRED="張家詠老師 · 二十年教學經驗 · 香港屯門"
FONT_SERIF="family=Noto+Serif+TC:wght@400;600;900"
FONT_SANS="family=Noto+Sans+TC:wght@300;400;500;700;900"
def page(n,name,desc,fonts,css,body):
    return f'''<!doctype html><html lang="zh-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>樣板{n:02d}｜{name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&display=swap">
<style>*{{box-sizing:border-box;margin:0;padding:0}}img{{max-width:100%;display:block}}a{{color:inherit;text-decoration:none}}html{{scroll-behavior:smooth}}{css}
.tag{{position:fixed;left:12px;bottom:12px;z-index:99;background:#000c;color:#fff;font:12px/1 sans-serif;padding:8px 10px;border-radius:99px}}</style></head><body>{body}
<a class="tag" href="index.html">← 樣板{n:02d}・{name}・返回總覽</a></body></html>'''
def nav(cls=""): return "".join(f'<a href="#">{x}</a>' for x in NAV)
pages={}

# 01 書卷墨韻
css='''body{background:#f4efe4;color:#2b2620;font:17px/1.9 "Noto Serif TC",serif}
header{display:flex;justify-content:space-between;align-items:center;padding:22px 6vw;border-bottom:1px solid #2b262033}
.logo{font-weight:900;font-size:22px;letter-spacing:.2em}nav a{margin-left:22px;font-size:15px}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:6vw;padding:9vh 6vw;align-items:center}
.hero h1{font-size:clamp(34px,5vw,64px);line-height:1.35;font-weight:900;writing-mode:vertical-rl;height:520px;margin:0 auto;letter-spacing:.12em}
.hero h1 span{display:block;color:#a8342a}.hero img{border-radius:4px;box-shadow:12px 12px 0 #a8342a22}
.seal{display:inline-block;background:#a8342a;color:#fff;padding:2px 10px;font-size:14px;letter-spacing:.2em;margin:18px 0}
.btn{display:inline-block;border:1px solid #2b2620;padding:10px 26px;margin:6px 10px 0 0}.btn.p{background:#2b2620;color:#f4efe4}
section{padding:8vh 6vw;border-top:1px solid #2b262022}h2{font-size:30px;margin-bottom:28px;font-weight:900}h2:before{content:"";display:inline-block;width:10px;height:10px;background:#a8342a;margin-right:12px}
.g{display:grid;gap:22px}.g3{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(4,1fr)}.g5{grid-template-columns:repeat(5,1fr)}
.card{background:#fbf8f0;border:1px solid #2b262022;padding:22px}.card img{margin:-22px -22px 14px;width:calc(100% + 44px);aspect-ratio:4/3;object-fit:cover}
.card h3{font-size:20px}.card p{font-size:15px;opacity:.75}.n{color:#a8342a;font-size:13px;letter-spacing:.2em}
footer{background:#2b2620;color:#f4efe4;padding:6vh 6vw;text-align:center}
@media(max-width:800px){.hero,.g3,.g4,.g5{grid-template-columns:1fr}.hero h1{height:auto;writing-mode:horizontal-tb}nav{display:none}}'''
body=f'''<header><div class="logo">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><div><h1>{H1a}<span>{H1b}</span></h1></div><div><p>{SUB}</p><div class="seal">{CRED}</div><br><a class="btn p" href="#">認識課程</a><a class="btn" href="#">閱讀音樂手記</a><img style="margin-top:28px" src="img/concert-studio-hero.webp" alt=""></div></div>
<section><h2>找到你的開始</h2><div class="g g3">{"".join(f'<div class="card"><div class="n">0{i+1}</div><h3>{a}</h3><p>{b}</p></div>' for i,(a,b) in enumerate(PATHS))}</div></section>
<section><h2>四種聲音，各有一條學習的路</h2><div class="g g4">{"".join(f'<div class="card"><img src="img/{c}.webp" alt=""><h3>{a}</h3><p>{b}</p></div>' for a,b,c in COURSES)}</div></section>
<section><h2>課後的練習室</h2><div class="g g5">{"".join(f'<div class="card"><div class="n">0{i+1}</div><h3>{a}</h3><p>{b}</p></div>' for i,(a,b) in enumerate(TOOLS))}</div></section>
<section><h2>音樂手記</h2><div class="g g3">{"".join(f'<div class="card"><div class="n">{a}</div><h3>{b}</h3></div>' for a,b in ARTS)}</div></section>
<footer>從你現在的程度開始・WhatsApp 9809 6351</footer>'''
pages[1]=("書卷墨韻","暖紙色、宋體、朱紅印章點綴，延續現有書本氣質但更精緻",FONT_SERIF,css,body)

# 02 竹青茶席
css='''body{background:#f3f1e7;color:#1f2d24;font:17px/1.8 "Noto Serif TC",serif}
.top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;padding:24px 6vw;color:#fff;z-index:2}.top nav a{margin-left:22px;font-size:15px}
.hero{height:92vh;min-height:560px;background:linear-gradient(#0b2a1cc0,#0b2a1c99),url(img/concert-studio-hero.webp) center/cover;color:#f3f1e7;display:flex;flex-direction:column;justify-content:center;padding:0 8vw}
.hero h1{font-size:clamp(36px,6vw,80px);line-height:1.25;font-weight:900}.hero h1 em{font-style:normal;color:#c9d9a0}
.btn{display:inline-block;background:#c9d9a0;color:#0b2a1c;padding:12px 30px;border-radius:99px;margin:20px 12px 0 0;font-weight:600}.btn.o{background:none;border:1px solid #f3f1e7;color:#f3f1e7}
section{padding:9vh 8vw}h2{font-size:32px;font-weight:900;color:#1f4a34;margin-bottom:30px}
.g{display:grid;gap:26px}.g4{grid-template-columns:repeat(4,1fr)}.g3{grid-template-columns:repeat(3,1fr)}
.c{position:relative;border-radius:20px;overflow:hidden;aspect-ratio:3/4;color:#fff;display:flex;align-items:flex-end}.c img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.c:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 35%,#0b2a1cdd)}.c div{position:relative;z-index:1;padding:20px}.c h3{font-size:22px}.c p{font-size:14px;opacity:.9}
.band{background:#1f4a34;color:#f3f1e7;border-radius:30px;margin:0 4vw;padding:8vh 5vw}.band h2{color:#c9d9a0}
.t{border:1px solid #c9d9a066;border-radius:16px;padding:18px}.t b{display:block;font-size:19px}.t span{font-size:14px;opacity:.8}
.p{background:#fff;border-radius:16px;padding:22px;border-left:5px solid #1f4a34}
footer{text-align:center;padding:8vh 6vw;color:#1f4a34}
@media(max-width:800px){.g4,.g3{grid-template-columns:1fr 1fr}.top nav{display:none}.hero{padding:0 6vw}}'''
body=f'''<div class="top"><b style="font-size:20px;letter-spacing:.15em">張老師音樂學院</b><nav>{nav()}</nav></div>
<div class="hero"><h1>{H1a}<br><em>{H1b}</em></h1><p style="max-width:560px;margin-top:20px;opacity:.9">{SUB}</p><div><a class="btn" href="#">認識課程</a><a class="btn o" href="#">閱讀音樂手記</a></div><p style="margin-top:26px;font-size:14px;opacity:.75">{CRED}</p></div>
<section><h2>四種聲音，各有一條學習的路</h2><div class="g g4">{"".join(f'<div class="c"><img src="img/{c}.webp" alt=""><div><h3>{a}</h3><p>{b}</p></div></div>' for a,b,c in COURSES)}</div></section>
<div class="band"><h2>課後的練習室</h2><div class="g g3" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">{"".join(f'<div class="t"><b>{a}</b><span>{b}</span></div>' for a,b in TOOLS)}</div></div>
<section><h2>找到你的開始</h2><div class="g g3">{"".join(f'<div class="p"><b>{a}</b><br>{b}</div>' for a,b in PATHS)}</div></section>
<footer>從你現在的程度開始・WhatsApp 9809 6351</footer>'''
pages[2]=("竹青茶席","深竹青＋米白，全幅相片首屏，圓角相片卡，沉靜自然",FONT_SERIF,css,body)

# 03 瑞士極簡
css='''body{background:#fff;color:#111;font:16px/1.7 "Noto Sans TC",sans-serif}
header{display:flex;justify-content:space-between;padding:20px 4vw;border-bottom:2px solid #111;font-weight:700}nav a{margin-left:24px;font-weight:400}
.hero{padding:10vh 4vw 6vh;border-bottom:2px solid #111}.hero h1{font-size:clamp(44px,9vw,140px);line-height:1.02;font-weight:900;letter-spacing:-.03em}.hero h1 span{color:#1d4ed8}
.row{display:grid;grid-template-columns:1fr 2fr;gap:4vw;margin-top:6vh}.row p{font-size:20px}
.btn{display:inline-block;background:#111;color:#fff;padding:14px 28px;margin:20px 10px 0 0;font-weight:700}.btn.b{background:#1d4ed8}
.sec{display:grid;grid-template-columns:1fr 3fr;gap:4vw;padding:7vh 4vw;border-bottom:1px solid #111}.sec h2{font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#1d4ed8}
.list a{display:flex;justify-content:space-between;align-items:baseline;padding:16px 0;border-bottom:1px solid #ddd;font-size:clamp(22px,3vw,40px);font-weight:700}.list a small{font-size:14px;font-weight:400;opacity:.6}.list a:hover{color:#1d4ed8;padding-left:12px;transition:.2s}
.imgs{display:grid;grid-template-columns:repeat(4,1fr);gap:0}.imgs img{aspect-ratio:1;object-fit:cover;filter:grayscale(1);transition:.3s}.imgs img:hover{filter:none}
footer{padding:6vh 4vw;font-weight:700}
@media(max-width:800px){.row,.sec{grid-template-columns:1fr}nav{display:none}.imgs{grid-template-columns:1fr 1fr}}'''
body=f'''<header><div>張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><h1>{H1a}<br><span>{H1b}</span></h1><div class="row"><div>{CRED}</div><div><p>{SUB}</p><a class="btn" href="#">認識課程</a><a class="btn b" href="#">進入練習室</a></div></div></div>
<div class="imgs">{"".join(f'<img src="img/{c}.webp" alt="">' for a,b,c in COURSES)}</div>
<div class="sec"><h2>Courses 課程</h2><div class="list">{"".join(f'<a href="#">{a}<small>{b}</small></a>' for a,b,c in COURSES)}</div></div>
<div class="sec"><h2>Practice 練習室</h2><div class="list">{"".join(f'<a href="#">{a}<small>{b}</small></a>' for a,b in TOOLS)}</div></div>
<div class="sec"><h2>Journal 手記</h2><div class="list">{"".join(f'<a href="#">{b}<small>{a}</small></a>' for a,b in ARTS)}</div></div>
<footer>WhatsApp 9809 6351 ↗</footer>'''
pages[3]=("瑞士極簡","白底黑字、巨型標題、藍色點綴、列表式導覽，清晰利落",FONT_SANS,css,body)

# 04 夜色音樂廳
css='''body{background:#0d0c0b;color:#e9e1d1;font:17px/1.8 "Noto Serif TC",serif}
header{display:flex;justify-content:space-between;padding:22px 6vw;position:absolute;width:100%;z-index:3}nav a{margin-left:22px;font-size:14px;letter-spacing:.1em}.lg{color:#d4a64a;letter-spacing:.3em}
.hero{min-height:100vh;background:radial-gradient(circle at 70% 40%,#0000 0,#0d0c0b 70%),url(img/concert-studio-hero.webp) center/cover;display:flex;align-items:center;padding:0 7vw}
.hero h1{font-size:clamp(38px,6vw,84px);line-height:1.2;font-weight:900;max-width:760px}.hero h1 em{font-style:normal;color:#d4a64a}
.btn{display:inline-block;border:1px solid #d4a64a;color:#d4a64a;padding:12px 32px;margin:24px 12px 0 0;letter-spacing:.15em}.btn.f{background:#d4a64a;color:#0d0c0b}
section{padding:10vh 7vw}h2{font-size:14px;letter-spacing:.4em;color:#d4a64a;margin-bottom:34px;font-weight:400}
.g{display:grid;gap:1px;background:#d4a64a33}.g4{grid-template-columns:repeat(4,1fr)}.g5{grid-template-columns:repeat(5,1fr)}
.cell{background:#0d0c0b;padding:34px 24px;transition:.3s}.cell:hover{background:#17140f}.cell h3{font-size:22px;color:#fff;margin-bottom:6px}.cell p{font-size:14px;opacity:.65}
.cell .i{font-size:12px;color:#d4a64a;letter-spacing:.3em}
.quote{text-align:center;padding:14vh 10vw;font-size:clamp(24px,3.5vw,44px);line-height:1.6;font-weight:600}.quote small{display:block;font-size:14px;margin-top:20px;color:#d4a64a;letter-spacing:.3em}
footer{text-align:center;padding:8vh 6vw;border-top:1px solid #d4a64a33;color:#d4a64a}
@media(max-width:800px){.g4,.g5{grid-template-columns:1fr 1fr}nav{display:none}}'''
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><div><h1>{H1a}<br><em>{H1b}</em></h1><p style="max-width:520px;margin-top:20px;opacity:.8">{SUB}</p><a class="btn f" href="#">認識課程</a><a class="btn" href="#">進入練習室</a></div></div>
<section><h2>COURSES ・ 課程</h2><div class="g g4">{"".join(f'<div class="cell"><div class="i">0{i+1}</div><h3>{a}</h3><p>{b}</p></div>' for i,(a,b,c) in enumerate(COURSES))}</div></section>
<div class="quote">「音樂的細節，常在一次示範、一句回應與每天的小練習裏慢慢建立。」<small>{CRED}</small></div>
<section><h2>PRACTICE ・ 練習室</h2><div class="g g5">{"".join(f'<div class="cell"><div class="i">0{i+1}</div><h3>{a}</h3><p>{b}</p></div>' for i,(a,b) in enumerate(TOOLS))}</div></section>
<footer>WhatsApp 9809 6351</footer>'''
pages[4]=("夜色音樂廳","近黑底＋金色，電影感首屏，像音樂會節目冊",FONT_SERIF,css,body)

# 05 粉彩童趣
css='''body{background:#fff8ee;color:#3a2e4a;font:17px/1.7 "Noto Sans TC",sans-serif}
header{display:flex;justify-content:space-between;align-items:center;padding:18px 5vw}.lg{font-weight:900;font-size:22px}.lg:before{content:"♪ ";color:#ff7a59}nav a{margin-left:18px;padding:8px 14px;border-radius:99px;font-weight:500}nav a:hover{background:#ffe3a3}
.hero{margin:10px 4vw;border-radius:44px;background:#ffd6e0;padding:9vh 6vw;display:grid;grid-template-columns:1.2fr 1fr;gap:4vw;align-items:center;position:relative;overflow:hidden}
.hero:before{content:"";position:absolute;right:-80px;top:-80px;width:300px;height:300px;border-radius:50%;background:#ffe3a3}
.hero h1{font-size:clamp(36px,5.5vw,72px);line-height:1.2;font-weight:900;position:relative}.hero h1 span{color:#ff5a8a}
.hero img{border-radius:36px;transform:rotate(3deg);border:8px solid #fff;position:relative}
.btn{display:inline-block;background:#ff7a59;color:#fff;padding:14px 30px;border-radius:99px;font-weight:700;margin:20px 10px 0 0;box-shadow:0 6px 0 #c9502f}.btn.b{background:#5b8def;box-shadow:0 6px 0 #3a63bd}
section{padding:8vh 5vw}h2{font-size:32px;font-weight:900;margin-bottom:26px}
.g{display:grid;gap:22px}.g4{grid-template-columns:repeat(4,1fr)}.g3{grid-template-columns:repeat(3,1fr)}
.c{border-radius:32px;padding:26px;font-weight:700}.c small{display:block;font-weight:400;opacity:.8;margin-top:6px}.c img{border-radius:22px;margin-bottom:14px;aspect-ratio:4/3;object-fit:cover}
.c:nth-child(4n+1){background:#c9f0e0}.c:nth-child(4n+2){background:#ffe3a3}.c:nth-child(4n+3){background:#d6e4ff}.c:nth-child(4n+4){background:#f3d6ff}
.tool{border-radius:99px;background:#fff;padding:14px 22px;border:3px solid #3a2e4a;font-weight:700;display:flex;justify-content:space-between}
footer{background:#3a2e4a;color:#fff;text-align:center;padding:8vh 5vw;margin-top:6vh;border-radius:44px 44px 0 0}
@media(max-width:800px){.hero{grid-template-columns:1fr}.g4,.g3{grid-template-columns:1fr 1fr}nav{display:none}}'''
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><div><h1>{H1a}<span>{H1b}</span></h1><p style="margin-top:14px;position:relative">{SUB}</p><a class="btn" href="#">認識課程</a><a class="btn b" href="#">玩玩練習室</a></div><img src="img/teacher-profile.webp" alt=""></div>
<section><h2>你想學甚麼？</h2><div class="g g4">{"".join(f'<div class="c"><img src="img/{c}.webp" alt="">{a}<small>{b}</small></div>' for a,b,c in COURSES)}</div></section>
<section><h2>練習室・隨時玩</h2><div class="g g3">{"".join(f'<div class="tool"><span>{a}</span><span>→</span></div>' for a,b in TOOLS)}</div></section>
<section><h2>誰是我？</h2><div class="g g3">{"".join(f'<div class="c"><b>{a}</b><small>{b}</small></div>' for a,b in PATHS)}</div></section>
<footer>WhatsApp 9809 6351</footer>'''
pages[5]=("粉彩童趣","大圓角、彩色卡片、立體按鈕，適合家長和小朋友",FONT_SANS,css,body)

# 06 雜誌編輯
css='''body{background:#fcfbf8;color:#151515;font:17px/1.75 "Noto Serif TC",serif}
.mast{text-align:center;padding:22px 5vw 0;border-bottom:4px double #151515}.mast .t{font-size:clamp(34px,6vw,76px);font-weight:900;letter-spacing:.12em}.mast .s{display:flex;justify-content:space-between;font-size:13px;padding:8px 0;border-top:1px solid #151515;margin-top:10px}
.lead{display:grid;grid-template-columns:2fr 1fr;gap:3vw;padding:5vh 5vw;border-bottom:1px solid #151515}
.lead h1{font-size:clamp(34px,5vw,68px);line-height:1.2;font-weight:900}.lead h1 i{font-style:normal;color:#c2362b}
.lead img{margin-top:22px;width:100%;aspect-ratio:2/1;object-fit:cover}.cap{font-size:12px;opacity:.6;margin-top:6px}
aside{border-left:1px solid #151515;padding-left:2.5vw}aside h3{font-size:13px;letter-spacing:.3em;margin-bottom:12px;color:#c2362b}aside div{padding:12px 0;border-bottom:1px solid #1512}aside b{display:block}
.cols{columns:3;column-gap:3vw;column-rule:1px solid #1513;padding:5vh 5vw}.cols h2{font-size:13px;letter-spacing:.3em;color:#c2362b;column-span:all;margin-bottom:14px}.cols p{font-size:15px;margin-bottom:12px;break-inside:avoid}
.cols p b{font-size:22px;display:block;line-height:1.3}.cols p:first-letter{font-size:1em}
.strip{display:grid;grid-template-columns:repeat(5,1fr);border-top:4px double #151515;border-bottom:4px double #151515;margin:0 5vw}.strip div{padding:22px 16px;border-right:1px solid #1514}.strip div:last-child{border:0}.strip b{display:block;font-size:20px}.strip small{opacity:.7}
footer{text-align:center;padding:7vh 5vw;font-size:14px}
@media(max-width:800px){.lead{grid-template-columns:1fr}aside{border:0;padding:0}.cols{columns:1}.strip{grid-template-columns:1fr 1fr}.mast .s{display:none}}'''
body=f'''<div class="mast"><div class="t">張老師音樂學院</div><div class="s"><span>2026 年 10 月號</span><span>{" ・ ".join(NAV)}</span><span>香港屯門</span></div></div>
<div class="lead"><div><h1>{H1a}<i>{H1b}</i></h1><p style="margin-top:14px;font-size:19px">{SUB}</p><img src="img/concert-studio-hero.webp" alt=""><div class="cap">{CRED}</div></div><aside><h3>本期專題</h3>{"".join(f'<div><b>{a}</b>{b}</div>' for a,b in PATHS)}<h3 style="margin-top:20px">編輯推介</h3>{"".join(f'<div><b>{b}</b>{a}</div>' for a,b in ARTS)}</aside></div>
<div class="cols"><h2>四種聲音</h2>{"".join(f'<p><b>{a}</b>{b}</p>' for a,b,c in COURSES)}</div>
<div class="strip">{"".join(f'<div><b>{a}</b><small>{b}</small></div>' for a,b in TOOLS)}</div>
<footer>WhatsApp 9809 6351 ・ © 2026 張老師音樂學院</footer>'''
pages[6]=("雜誌編輯","報頭、多欄排版、雙線，像文化雜誌，突出 200 篇手記",FONT_SERIF,css,body)

# 07 暖木陶土
css='''body{background:#f7efe3;color:#4a3426;font:17px/1.8 "Noto Sans TC",sans-serif}
header{display:flex;justify-content:space-between;align-items:center;padding:20px 5vw}.lg{font-weight:900;color:#b5532d;font-size:21px}nav a{margin-left:20px;font-size:15px}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:4vw;padding:6vh 5vw;align-items:center}
.hero h1{font-size:clamp(34px,4.8vw,64px);line-height:1.25;font-weight:900}.hero h1 span{color:#b5532d}
.hero .im{border-radius:200px 200px 24px 24px;overflow:hidden;aspect-ratio:4/5;background:#d9b99a}.hero .im img{width:100%;height:100%;object-fit:cover}
.btn{display:inline-block;background:#b5532d;color:#fff;padding:13px 28px;border-radius:12px;margin:20px 10px 0 0}.btn.o{background:none;border:2px solid #b5532d;color:#b5532d}
section{padding:7vh 5vw}h2{font-size:30px;font-weight:900;margin-bottom:24px}h2 small{display:block;font-size:14px;color:#8a9a6b;font-weight:500;letter-spacing:.2em}
.g{display:grid;gap:22px}.g4{grid-template-columns:repeat(4,1fr)}.g3{grid-template-columns:repeat(3,1fr)}
.c{background:#fffaf2;border-radius:22px;padding:14px;box-shadow:0 8px 24px #4a342614}.c img{border-radius:14px;aspect-ratio:1;object-fit:cover}.c h3{padding:12px 8px 0}.c p{padding:0 8px 10px;font-size:14px;opacity:.75}
.sage{background:#dfe5cf;border-radius:36px;margin:0 3vw;padding:7vh 3vw}.sage .g{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}.k{background:#f7efe3;border-radius:16px;padding:18px}.k b{display:block}.k span{font-size:14px;opacity:.7}
.pill{display:inline-block;background:#e6cdb2;border-radius:99px;padding:4px 14px;font-size:13px;margin-bottom:8px}
footer{text-align:center;padding:8vh 5vw;color:#b5532d;font-weight:700}
@media(max-width:800px){.hero{grid-template-columns:1fr}.g4,.g3{grid-template-columns:1fr 1fr}nav{display:none}}'''
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><div><h1>{H1a}<br><span>{H1b}</span></h1><p style="margin-top:14px">{SUB}</p><p style="font-size:14px;opacity:.7">{CRED}</p><a class="btn" href="#">認識課程</a><a class="btn o" href="#">練習室</a></div><div class="im"><img src="img/flute.webp" alt=""></div></div>
<section><h2><small>COURSES</small>四種聲音</h2><div class="g g4">{"".join(f'<div class="c"><img src="img/{c}.webp" alt=""><h3>{a}</h3><p>{b}</p></div>' for a,b,c in COURSES)}</div></section>
<div class="sage"><h2><small>PRACTICE ROOM</small>課後的練習室</h2><div class="g">{"".join(f'<div class="k"><b>{a}</b><span>{b}</span></div>' for a,b in TOOLS)}</div></div>
<section><h2><small>JOURNAL</small>音樂手記</h2><div class="g g3">{"".join(f'<div class="c" style="padding:22px"><span class="pill">{a}</span><h3>{b}</h3></div>' for a,b in ARTS)}</div></section>
<footer>WhatsApp 9809 6351</footer>'''
pages[7]=("暖木陶土","陶土橙＋鼠尾草綠＋拱形相片，親切溫暖，像手作工作室",FONT_SANS,css,body)

# 08 工具優先
css='''body{background:#eef1f6;color:#172033;font:16px/1.6 "Noto Sans TC",sans-serif}
header{display:flex;justify-content:space-between;align-items:center;padding:14px 4vw;background:#fff;border-bottom:1px solid #dde3ee}.lg{font-weight:900}nav a{margin-left:18px;font-size:14px}nav a:nth-child(2){color:#0e7c66;font-weight:700}
.wrap{max-width:1200px;margin:0 auto;padding:4vh 4vw}
.hi h1{font-size:clamp(28px,4vw,48px);font-weight:900;line-height:1.25}.hi p{opacity:.7;margin-top:8px}
.dash{display:grid;grid-template-columns:1.3fr 1fr;gap:18px;margin-top:26px}
.panel{background:#fff;border-radius:18px;padding:22px;box-shadow:0 2px 0 #dde3ee}
.tuner{text-align:center;background:#0f2a30;color:#e6fff6}.tuner .note{font-size:96px;font-weight:900;line-height:1;color:#5df2c3}.tuner .hz{opacity:.7}
.meter{position:relative;height:10px;background:#ffffff22;border-radius:9px;margin:20px 0}.meter:after{content:"";position:absolute;left:50%;top:-6px;width:4px;height:22px;background:#5df2c3;border-radius:2px}
.row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.chip{background:#ffffff1c;border-radius:99px;padding:6px 14px;font-size:13px}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:14px}.tile{background:#fff;border-radius:16px;padding:18px;box-shadow:0 2px 0 #dde3ee}.tile b{display:block;font-size:18px}.tile span{font-size:13px;opacity:.65}
.tile i{font-style:normal;display:inline-grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#d8f5ec;color:#0e7c66;margin-bottom:8px;font-weight:700}
h2{font-size:20px;margin:34px 0 14px}.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.cc{background:#fff;border-radius:16px;overflow:hidden}.cc img{aspect-ratio:16/10;object-fit:cover;width:100%}.cc div{padding:14px}.cc small{opacity:.65}
.btn{display:inline-block;background:#0e7c66;color:#fff;padding:11px 22px;border-radius:10px;margin-top:14px;font-weight:700}
footer{text-align:center;padding:6vh;opacity:.7}
@media(max-width:800px){.dash,.g4{grid-template-columns:1fr}nav{display:none}}'''
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="wrap"><div class="hi"><h1>{H1a}{H1b}</h1><p>{SUB}</p><a class="btn" href="#">查詢課程</a></div>
<div class="dash"><div class="panel tuner"><div class="hz">調音器・A=442 Hz</div><div class="note">A4</div><div class="hz">+2 音分・偏高一點點</div><div class="meter"></div><div class="row"><span class="chip">唱名 6</span><span class="chip">1=C</span><span class="chip">開始收音</span></div></div>
<div class="tiles">{"".join(f'<div class="tile"><i>{n+1}</i><b>{a}</b><span>{b}</span></div>' for n,(a,b) in enumerate(TOOLS))}</div></div>
<h2>課程</h2><div class="g4">{"".join(f'<div class="cc"><img src="img/{c}.webp" alt=""><div><b>{a}</b><br><small>{b}</small></div></div>' for a,b,c in COURSES)}</div>
<h2>最新手記</h2><div class="g4" style="grid-template-columns:repeat(3,1fr)">{"".join(f'<div class="panel"><small>{a}</small><br><b>{b}</b></div>' for a,b in ARTS)}</div></div>
<footer>{CRED}・WhatsApp 9809 6351</footer>'''
pages[8]=("工具優先","首屏就是調音器和練習室，像 App 儀表板，適合上課學生每日用",FONT_SANS,css,body)

# 09 水墨留白
css='''body{background:#fdfdfb;color:#222;font:16px/2 "Noto Serif TC",serif;font-weight:300}
header{display:flex;flex-direction:column;align-items:center;padding:6vh 0 3vh}.lg{font-size:20px;letter-spacing:.6em;font-weight:600}nav{margin-top:16px;font-size:14px;letter-spacing:.3em}nav a{margin:0 14px;opacity:.6}nav a:hover{opacity:1}
.hero{text-align:center;padding:12vh 8vw 10vh;position:relative}.hero:before{content:"";display:block;width:90px;height:90px;border-radius:50%;background:#b3261e;margin:0 auto 6vh;opacity:.9}
.hero h1{font-size:clamp(28px,4vw,52px);font-weight:300;letter-spacing:.3em;line-height:2}.hero p{opacity:.6;margin-top:22px;letter-spacing:.15em}
.ln{width:1px;height:90px;background:#222;margin:8vh auto}
section{max-width:960px;margin:0 auto;padding:6vh 6vw;text-align:center}h2{font-size:15px;letter-spacing:.6em;font-weight:400;margin-bottom:40px;color:#b3261e}
.g{display:grid;gap:60px 40px}.g4{grid-template-columns:repeat(4,1fr)}.g3{grid-template-columns:repeat(3,1fr)}
.g img{aspect-ratio:3/4;object-fit:cover;filter:grayscale(1) contrast(1.05);margin-bottom:16px;transition:.5s}.g img:hover{filter:none}.g b{letter-spacing:.3em;font-weight:600;display:block}.g span{font-size:13px;opacity:.6}
.tl a{display:block;padding:14px 0;border-bottom:1px solid #2222;letter-spacing:.3em}.tl a small{margin-left:16px;opacity:.5;letter-spacing:.1em}
footer{text-align:center;padding:12vh 5vw 8vh;opacity:.6;letter-spacing:.3em;font-size:13px}
@media(max-width:800px){.g4,.g3{grid-template-columns:1fr 1fr}nav a{margin:0 6px;font-size:12px}}'''
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><h1>{H1a}<br>{H1b}</h1><p>{CRED}</p></div><div class="ln"></div>
<section><h2>四 聲</h2><div class="g g4">{"".join(f'<div><img src="img/{c}.webp" alt=""><b>{a[:-2]}</b><span>{a}</span></div>' for a,b,c in COURSES)}</div></section>
<section><h2>練 習 室</h2><div class="tl">{"".join(f'<a href="#">{a}<small>{b}</small></a>' for a,b in TOOLS)}</div></section>
<section><h2>手 記</h2><div class="tl">{"".join(f'<a href="#">{b}</a>' for a,b in ARTS)}</div></section>
<footer>WHATSAPP 9809 6351</footer>'''
pages[9]=("水墨留白","大量留白、細線、灰階相片、僅一點朱紅，極簡東方禪意",FONT_SERIF,css,body)

# 10 漸層玻璃
css='''body{background:#0b1020;color:#e8ecff;font:16px/1.7 "Noto Sans TC",sans-serif;background-image:radial-gradient(circle at 15% 10%,#5b3df533,transparent 40%),radial-gradient(circle at 85% 30%,#18c6ff22,transparent 40%)}
header{display:flex;justify-content:space-between;align-items:center;margin:16px 4vw;padding:12px 22px;border-radius:99px;background:#ffffff10;border:1px solid #ffffff1c;backdrop-filter:blur(14px)}.lg{font-weight:900}nav a{margin-left:18px;font-size:14px;opacity:.8}
.hero{text-align:center;padding:12vh 6vw 8vh}.hero h1{font-size:clamp(38px,7vw,92px);line-height:1.12;font-weight:900;letter-spacing:-.02em}
.hero h1 span{background:linear-gradient(90deg,#8b7bff,#2fd3ff,#7dffb8);-webkit-background-clip:text;color:transparent}
.hero p{max-width:620px;margin:20px auto;opacity:.75}.btn{display:inline-block;padding:13px 30px;border-radius:99px;background:linear-gradient(90deg,#6f4dff,#18a8ff);margin:8px;font-weight:700}.btn.g{background:#ffffff14;border:1px solid #ffffff30}
.bento{display:grid;grid-template-columns:repeat(6,1fr);gap:16px;padding:4vh 4vw}
.b{border-radius:26px;background:#ffffff0d;border:1px solid #ffffff1a;padding:26px;backdrop-filter:blur(10px);position:relative;overflow:hidden;min-height:180px}
.b h3{font-size:22px}.b p{font-size:14px;opacity:.7}.b img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35}.b>*{position:relative}
.s2{grid-column:span 2}.s3{grid-column:span 3}.s4{grid-column:span 4}
.big{font-size:56px;font-weight:900;background:linear-gradient(90deg,#8b7bff,#2fd3ff);-webkit-background-clip:text;color:transparent}
footer{text-align:center;padding:8vh 5vw;opacity:.7}
@media(max-width:800px){.bento{grid-template-columns:1fr 1fr}.s2,.s3,.s4{grid-column:span 2}nav{display:none}}'''
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><h1>{H1a}<br><span>{H1b}</span></h1><p>{SUB}</p><a class="btn" href="#">認識課程</a><a class="btn g" href="#">進入練習室</a></div>
<div class="bento"><div class="b s4"><img src="img/concert-studio-hero.webp" alt=""><h3>{CRED}</h3><p>一對一與小班課程，按你的進度安排。</p></div><div class="b s2"><div class="big">200</div><h3>篇音樂手記</h3><p>樂器、樂理、陪練</p></div>
{"".join(f'<div class="b s3"><img src="img/{c}.webp" alt=""><h3>{a}</h3><p>{b}</p></div>' for a,b,c in COURSES[:2])}
{"".join(f'<div class="b s2"><h3>{a}</h3><p>{b}</p></div>' for a,b in TOOLS[:3])}
{"".join(f'<div class="b s3"><h3>{a}</h3><p>{b}</p></div>' for a,b in TOOLS[3:])}</div>
<footer>WhatsApp 9809 6351</footer>'''
pages[10]=("漸層玻璃","深藍紫漸層、玻璃質感便當格，現代科技感，突出軟件與工具",FONT_SANS,css,body)

cards=""
for n,(name,desc,fonts,css,body) in sorted(pages.items()):
    open(f"{D}/{n:02d}.html","w").write(page(n,name,desc,fonts,css,body))
    cards+=f'<a class="k" href="{n:02d}.html"><img src="shots/{n:02d}.png" alt=""><b>{n:02d}　{name}</b><span>{desc}</span></a>'
open(f"{D}/index.html","w").write(f'''<!doctype html><html lang="zh-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>張老師音樂學院｜10 款首頁樣板</title>
<style>body{{font:16px/1.6 "Noto Sans TC",sans-serif;background:#f2f2f2;padding:4vw;color:#111}}h1{{margin-bottom:6px}}p.s{{margin-bottom:24px;opacity:.7}}.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}}.k{{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px #0002;display:block;color:inherit;text-decoration:none}}.k img{{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;display:block}}.k b{{display:block;padding:12px 16px 0}}.k span{{display:block;padding:0 16px 14px;font-size:14px;opacity:.7}}</style></head><body><h1>張老師音樂學院｜10 款首頁樣板</h1><p class="s">點入每款可看完整首頁。內容相同，只比較設計風格。</p><div class="g">{cards}</div></body></html>''')
