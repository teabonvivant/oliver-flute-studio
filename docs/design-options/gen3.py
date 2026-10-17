import os
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),"r3")
os.makedirs(D,exist_ok=True)
ns={"__file__":os.path.join(D,"..","gen.py")}
exec(open(ns["__file__"]).read().split("def page(")[0],ns)
TOOLS,COURSES,PATHS,ARTS,NAV,H1a,H1b,SUB,CRED=[ns[k] for k in("TOOLS","COURSES","PATHS","ARTS","NAV","H1a","H1b","SUB","CRED")]
FONTS="family=Noto+Serif+TC:wght@400;600;900&family=Noto+Sans+TC:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,500;1,500"
IMG="../img/"

BASE='''*{box-sizing:border-box;margin:0;padding:0}img{max-width:100%;display:block}a{color:inherit;text-decoration:none}html{scroll-behavior:smooth}
.js [data-r]{opacity:0;transform:translateY(18px);transition:opacity .3s ease-out,transform .3s cubic-bezier(.2,.8,.2,1);transition-delay:var(--d,0s)}
.js [data-r].in{opacity:1;transform:none}
.btn{transition:transform .16s ease-out,background-color .2s ease-out,box-shadow .2s ease-out}.btn:active{transform:scale(.97)}
.tag{position:fixed;left:12px;bottom:12px;z-index:99;background:#000c;color:#fff;font:12px/1 sans-serif;padding:8px 10px;border-radius:99px}
@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}.js [data-r]{opacity:1;transform:none}}'''
JS='''<script>
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('[data-r]').forEach(el=>io.observe(el));
</script>'''
def nav(): return "".join(f'<a href="#">{x}</a>' for x in NAV)
def R(i=0): return f'data-r style="--d:{i*0.06:.2f}s"'
def page(k,name,css,body,js=""):
    return f'''<!doctype html><html lang="zh-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{k}｜{name}</title>
<script>document.documentElement.classList.add('js')</script>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">
<style>{BASE}{css}</style></head><body>{body}<a class="tag" href="index.html">← {k}・{name}・返回</a>{JS}{js}</body></html>'''
P={}

# ───────── 1 序曲：音樂會節目冊（象牙白＋香檳金），置中標題逐行揭幕、聲波描線、相片幕布展開
css='''body{background:#faf7f0;color:#2a2620;font:17px/1.85 "Noto Sans TC",sans-serif}
header{display:flex;justify-content:space-between;align-items:center;padding:22px 6vw}.lg{font:600 18px "Noto Serif TC",serif;letter-spacing:.3em}nav a{margin-left:24px;font-size:14px;color:#6d6455;transition:color .2s}nav a:hover{color:#a67c2e}
.hero{text-align:center;padding:9vh 6vw 0}.eyebrow{font:italic 500 20px "Cormorant Garamond",serif;color:#a67c2e;letter-spacing:.08em}
h1{font:900 clamp(40px,6.4vw,92px)/1.22 "Noto Serif TC",serif;margin-top:10px}h1 .l{display:block;overflow:hidden}h1 .l span{display:inline-block;transform:translateY(105%);animation:up .9s cubic-bezier(.2,.8,.2,1) forwards}h1 .l:nth-child(2) span{animation-delay:.15s;color:#a67c2e}
@keyframes up{to{transform:none}}
.wave{display:block;margin:18px auto 0;width:min(520px,80vw)}.wave path{stroke-dasharray:900;stroke-dashoffset:900;animation:draw 2.2s .5s ease-out forwards}@keyframes draw{to{stroke-dashoffset:0}}
.sub{max-width:560px;margin:18px auto 0;color:#6d6455;opacity:0;animation:fade .6s .8s forwards}@keyframes fade{to{opacity:1}}
.btns{opacity:0;animation:fade .6s 1s forwards}
.btn{display:inline-block;padding:13px 34px;margin:26px 8px 0;border:1px solid #a67c2e;color:#a67c2e;letter-spacing:.15em;font-size:15px}.btn.f{background:#2a2620;color:#faf7f0;border-color:#2a2620}.btn:hover{box-shadow:0 10px 24px -12px #a67c2e}
.stage{margin:8vh 6vw 0;border-radius:6px;overflow:hidden;aspect-ratio:21/9;clip-path:inset(0 50% 0 50%);animation:curtain 1.4s .6s cubic-bezier(.65,0,.35,1) forwards}.stage img{width:100%;height:100%;object-fit:cover;transform:scale(1.12);animation:kb 14s 0.6s ease-out forwards}
@keyframes curtain{to{clip-path:inset(0 0 0 0)}}@keyframes kb{to{transform:scale(1)}}
.cred{text-align:center;font-size:13px;letter-spacing:.3em;color:#a67c2e;margin-top:16px}
section{padding:12vh 6vw 0}h2{text-align:center;font:600 30px "Noto Serif TC",serif}h2 small{display:block;font:italic 500 18px "Cormorant Garamond",serif;color:#a67c2e;letter-spacing:.1em}
.prog{max-width:820px;margin:5vh auto 0}.prog a{display:flex;align-items:baseline;gap:18px;padding:22px 0;border-bottom:1px solid #a67c2e33;transition:padding .25s ease-out}.prog a:hover{padding-left:10px}
.prog .no{font:italic 500 26px "Cormorant Garamond",serif;color:#a67c2e;width:40px}.prog b{font:600 24px "Noto Serif TC",serif;white-space:nowrap}.prog .dots{flex:1;border-bottom:1px dotted #a67c2e66;transform:translateY(-6px)}.prog span{color:#6d6455;font-size:15px;max-width:330px}
.bento{display:grid;grid-template-columns:repeat(6,1fr);gap:1px;background:#a67c2e33;border:1px solid #a67c2e33;margin-top:5vh}
.b{background:#faf7f0;padding:30px 26px;min-height:170px;transition:background-color .25s}.b:hover{background:#fff}.b i{font:italic 500 16px "Cormorant Garamond",serif;color:#a67c2e}.b h3{font:600 22px "Noto Serif TC",serif;margin:4px 0}.b p{font-size:14px;color:#6d6455}
.s2{grid-column:span 2}.s3{grid-column:span 3}
.quote{text-align:center;padding:14vh 10vw 6vh;font:600 clamp(22px,3vw,38px)/1.7 "Noto Serif TC",serif}
footer{text-align:center;padding:6vh;font-size:14px;color:#6d6455;border-top:1px solid #a67c2e33;margin:6vh 6vw 0}
@media(max-width:800px){nav{display:none}.stage{aspect-ratio:4/3}.bento{grid-template-columns:1fr 1fr}.s2,.s3{grid-column:span 2}.prog span{display:none}}'''
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><div class="eyebrow">Overture · 序曲</div><h1><span class="l"><span>{H1a}</span></span><span class="l"><span>{H1b}</span></span></h1>
<svg class="wave" viewBox="0 0 520 40" fill="none"><path d="M0 20 C 30 20,40 4,60 4 S 90 36,110 36 S 140 8,160 8 S 190 30,210 30 S 240 14,260 14 S 290 26,310 26 S 340 17,360 17 S 390 23,410 23 S 440 19,460 19 S 500 20,520 20" stroke="#a67c2e" stroke-width="1.4"/></svg>
<p class="sub">{SUB}</p><div class="btns"><a class="btn f" href="#">認識課程</a><a class="btn" href="#">進入練習室</a></div></div>
<div class="stage"><img src="{IMG}practice.webp" alt=""></div><div class="cred">{CRED}</div>
<section><h2 {R()}><small>Programme</small>今季課程</h2><div class="prog">{"".join(f'<a href="#" {R(i)}><span class="no">{"I II III IV".split()[i]}</span><b>{a}</b><span class="dots"></span><span>{b}</span></a>' for i,(a,b,c) in enumerate(COURSES))}</div></section>
<section><h2 {R()}><small>Practice Room</small>課後的練習室</h2><div class="bento">{"".join(f'<div class="b s2" {R(i)}><i>No.{i+1}</i><h3>{a}</h3><p>{b}</p></div>' for i,(a,b) in enumerate(TOOLS[:3]))}{"".join(f'<div class="b s3" {R(i)}><i>No.{i+4}</i><h3>{a}</h3><p>{b}</p></div>' for i,(a,b) in enumerate(TOOLS[3:]))}</div></section>
<div class="quote" {R()}>「音樂的細節，常在一次示範、一句回應與每天的小練習裏慢慢建立。」</div>
<footer>WhatsApp 9809 6351 ・ 香港屯門</footer>'''
P[1]=("序曲","象牙白＋香檳金，像音樂會節目冊。標題逐行揭幕、金色聲波自己畫出來、相片像幕布拉開",css,body,"")

# ───────── 2 晨光琴房：分欄首屏＋浮動玻璃小工具（調音指針會擺、節拍點會跳）
css='''body{background:#f7f5f0;color:#1d2b2a;font:17px/1.8 "Noto Sans TC",sans-serif}
header{display:flex;justify-content:space-between;align-items:center;padding:20px 5vw}.lg{font:900 19px "Noto Serif TC",serif;color:#1f5c5a}nav a{margin-left:22px;font-size:14px;color:#5b6b69}nav a:hover{color:#1f5c5a}
.hero{display:grid;grid-template-columns:1fr 1.05fr;gap:5vw;align-items:center;padding:6vh 5vw 4vh}
h1{font:900 clamp(38px,5vw,74px)/1.22 "Noto Serif TC",serif}h1 em{font-style:normal;color:#1f5c5a;background:linear-gradient(transparent 68%,#e9d39a 68%);background-size:0 100%;background-repeat:no-repeat;animation:hl .8s 1s ease-out forwards}@keyframes hl{to{background-size:100% 100%}}
.sub{color:#5b6b69;margin-top:18px;max-width:480px}
.btn{display:inline-block;padding:13px 30px;border-radius:14px;margin:26px 10px 0 0;font-weight:700;background:#1f5c5a;color:#fff}.btn:hover{background:#174a48}.btn.o{background:#fff;color:#1f5c5a;box-shadow:inset 0 0 0 1.5px #1f5c5a}
.ph{position:relative}.ph .im{border-radius:32px;overflow:hidden;aspect-ratio:5/4;box-shadow:0 30px 60px -30px #1f5c5a66}.ph img{width:100%;height:100%;object-fit:cover;animation:kb 18s ease-in-out infinite alternate}@keyframes kb{to{transform:scale(1.08) translate(-1%,-1%)}}
.chip{position:absolute;background:#ffffffd9;backdrop-filter:blur(12px);border:1px solid #fff;border-radius:18px;padding:12px 16px;box-shadow:0 12px 30px -12px #0003;animation:float 6s ease-in-out infinite;font-size:13px;color:#5b6b69}
.chip b{display:block;font:900 22px "Noto Serif TC",serif;color:#1d2b2a}
@keyframes float{50%{transform:translateY(-10px)}}
.c1{left:-6%;top:12%}.c2{right:-4%;top:38%;animation-delay:-2s}.c3{left:8%;bottom:-6%;animation-delay:-4s}
.needle{width:120px;height:44px;position:relative;margin-top:4px}.needle:before{content:"";position:absolute;left:0;right:0;bottom:4px;height:1px;background:#1f5c5a33}.needle i{position:absolute;left:50%;bottom:4px;width:2px;height:38px;background:#c0563a;transform-origin:bottom;animation:sway 3s ease-in-out infinite}@keyframes sway{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(9deg)}}
.dots{display:flex;gap:8px;margin-top:6px}.dots i{width:12px;height:12px;border-radius:50%;background:#1f5c5a22;animation:beat 3.33s steps(1) infinite}.dots i:nth-child(1){animation-name:b1}.dots i:nth-child(2){animation-delay:.833s}.dots i:nth-child(3){animation-delay:1.666s}.dots i:nth-child(4){animation-delay:2.5s}
@keyframes beat{0%{background:#1f5c5a}25%,100%{background:#1f5c5a22}}@keyframes b1{0%{background:#c0563a}25%,100%{background:#1f5c5a22}}
section{padding:10vh 5vw 0}h2{font:900 32px "Noto Serif TC",serif;margin-bottom:26px}h2 small{display:block;font:700 13px "Noto Sans TC";letter-spacing:.3em;color:#b8893a}
.bento{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.card{border-radius:24px;overflow:hidden;background:#fff;box-shadow:0 1px 0 #0000000d,0 10px 30px -18px #1f5c5a55;transition:transform .25s ease-out,box-shadow .25s ease-out}.card:hover{transform:translateY(-4px);box-shadow:0 20px 40px -20px #1f5c5a77}
.card .im{aspect-ratio:4/3;overflow:hidden}.card img{width:100%;height:100%;object-fit:cover;transition:transform .3s ease-out}.card:hover img{transform:scale(1.05)}
.card div.t{padding:18px 20px 22px}.card h3{font:700 20px "Noto Serif TC",serif}.card p{font-size:14px;color:#5b6b69}
.tool{border-radius:24px;padding:22px;background:#fff;border:1px solid #1f5c5a1a;transition:border-color .2s,transform .25s ease-out}.tool:hover{border-color:#1f5c5a;transform:translateY(-3px)}.tool h3{font:700 19px "Noto Serif TC",serif}.tool p{font-size:14px;color:#5b6b69}.tool .ic{width:40px;height:40px;border-radius:12px;background:#e8f0ef;display:grid;place-items:center;color:#1f5c5a;font-weight:900;margin-bottom:12px}
.wide{grid-column:span 2;background:#1f5c5a;color:#f7f5f0;border:0}.wide p{color:#cfe0de}.wide .ic{background:#ffffff1f;color:#e9d39a}
footer{text-align:center;padding:10vh 5vw 8vh;color:#5b6b69}
@media(max-width:800px){nav{display:none}.hero{grid-template-columns:1fr}.bento{grid-template-columns:1fr 1fr}.wide{grid-column:span 2}.c1{left:2%}.c2{right:2%}}'''
icons="♪♩✦簡卡"
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><div><h1 {R()}>{H1a}<br><em>{H1b}</em></h1><p class="sub" {R(2)}>{SUB}</p><div {R(3)}><a class="btn" href="#">預約試堂</a><a class="btn o" href="#">打開調音器</a></div><p {R(4)} style="margin-top:22px;font-size:14px;color:#b8893a;letter-spacing:.1em">{CRED}</p></div>
<div class="ph"><div class="im"><img src="{IMG}practice.webp" alt=""></div>
<div class="chip c1">調音器<b>A4 · 440</b><div class="needle"><i></i></div></div>
<div class="chip c2">節拍器 ♩=72<div class="dots"><i></i><i></i><i></i><i></i></div></div>
<div class="chip c3">音樂手記<b>200 篇</b></div></div></div>
<section><h2 {R()}><small>COURSES</small>四種聲音，各有一條路</h2><div class="bento">{"".join(f'<a class="card" href="#" {R(i)}><div class="im"><img src="{IMG}{c}.webp" alt=""></div><div class="t"><h3>{a}</h3><p>{b}</p></div></a>' for i,(a,b,c) in enumerate(COURSES))}</div></section>
<section><h2 {R()}><small>PRACTICE ROOM</small>課後的練習室</h2><div class="bento">{"".join(f'<a class="tool{" wide" if i==3 else ""}" href="#" {R(i)}><div class="ic">{icons[i]}</div><h3>{a}</h3><p>{b}</p></a>' for i,(a,b) in enumerate(TOOLS))}</div></section>
<footer>WhatsApp 9809 6351 ・ 香港屯門</footer>'''
P[2]=("晨光琴房","暖白＋湖水綠＋黃銅。左文右相，相片上浮著三件玻璃小工具：調音指針在擺、節拍點按 72 拍跳動",css,body,"")

# ───────── 3 五線譜：首屏是一條橫越全頁的五線譜，音符沿線流動；課程橫向滑動；樂器名跑馬燈
css='''body{background:#fbfaf6;color:#1b2a4a;font:17px/1.8 "Noto Sans TC",sans-serif;overflow-x:hidden}
header{display:flex;justify-content:space-between;align-items:center;padding:22px 5vw}.lg{font:900 19px "Noto Serif TC",serif}.lg i{color:#d9472b;font-style:normal}nav a{margin-left:22px;font-size:14px;color:#56627d}nav a:hover{color:#d9472b}
.hero{position:relative;padding:12vh 5vw 14vh;overflow:hidden}
.staff{position:absolute;left:0;right:0;top:50%;height:120px;transform:translateY(-50%);pointer-events:none}
.staff span{display:block;height:1px;background:#1b2a4a1f;margin-bottom:29px;transform-origin:left;transform:scaleX(0);animation:line 1.2s cubic-bezier(.2,.8,.2,1) forwards}.staff span:nth-child(2){animation-delay:.08s}.staff span:nth-child(3){animation-delay:.16s}.staff span:nth-child(4){animation-delay:.24s}.staff span:nth-child(5){animation-delay:.32s}
@keyframes line{to{transform:none}}
.note{position:absolute;left:-40px;width:22px;height:16px;border-radius:50%;background:#d9472b;transform:rotate(-20deg);animation:flow linear infinite;opacity:.8}.note:after{content:"";position:absolute;right:1px;bottom:8px;width:2px;height:40px;background:#d9472b}
@keyframes flow{to{left:105%}}
h1{position:relative;z-index:1;font:900 clamp(40px,6.6vw,96px)/1.2 "Noto Serif TC",serif;max-width:900px}h1 em{font-style:normal;color:#d9472b}
.sub{position:relative;max-width:520px;margin-top:20px;color:#56627d;background:#fbfaf6cc}
.btn{position:relative;display:inline-block;padding:13px 30px;margin:24px 10px 0 0;border-radius:99px;font-weight:700;background:#1b2a4a;color:#fff}.btn:hover{background:#d9472b}.btn.o{background:#fff;color:#1b2a4a;box-shadow:inset 0 0 0 1.5px #1b2a4a}
.mq{overflow:hidden;border-block:1px solid #1b2a4a22;padding:16px 0;white-space:nowrap}.mq div{display:inline-block;animation:mq 30s linear infinite;font:600 26px "Noto Serif TC",serif}.mq b{color:#d9472b;margin:0 26px;font-weight:400}@keyframes mq{to{transform:translateX(-50%)}}
section{padding:10vh 0 0}h2{font:900 34px "Noto Serif TC",serif;padding:0 5vw;margin-bottom:24px}h2 small{font:500 15px "Noto Sans TC";color:#d9472b;margin-left:12px}
.rail{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 5vw 20px;scrollbar-width:none}.rail::-webkit-scrollbar{display:none}
.slide{flex:0 0 min(78vw,420px);scroll-snap-align:start;border-radius:22px;overflow:hidden;background:#fff;border:1px solid #1b2a4a14;transition:transform .25s ease-out}.slide:hover{transform:translateY(-4px)}.slide img{aspect-ratio:16/11;object-fit:cover;width:100%}.slide div{padding:18px 22px 24px}.slide .n{font:900 40px/1 "Noto Serif TC",serif;color:#d9472b22}.slide h3{font:700 22px "Noto Serif TC",serif}.slide p{font-size:14px;color:#56627d}
.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0;margin:0 5vw;border-top:1px solid #1b2a4a}.g{padding:26px 20px;border-right:1px solid #1b2a4a22;position:relative;transition:background-color .2s}.g:last-child{border-right:0}.g:hover{background:#fff}
.g:before{content:"";position:absolute;left:0;top:-1px;height:3px;width:0;background:#d9472b;transition:width .25s ease-out}.g:hover:before{width:100%}.g h3{font:700 19px "Noto Serif TC",serif}.g p{font-size:13px;color:#56627d}.g small{color:#d9472b;font-weight:700}
footer{margin-top:10vh;padding:8vh 5vw;text-align:center;background:#1b2a4a;color:#fbfaf6}
@media(max-width:800px){nav{display:none}.note{opacity:.25}.grid{grid-template-columns:1fr 1fr}.g{border-bottom:1px solid #1b2a4a22}}'''
notes="".join(f'<i class="note" style="top:{t}px;animation-duration:{d}s;animation-delay:-{dl}s"></i>' for t,d,dl in [(22,22,0),(52,26,7),(7,24,13),(82,28,4),(37,25,18),(67,30,10)])
body=f'''<header><div class="lg">張老師音樂學院<i>.</i></div><nav>{nav()}</nav></header>
<div class="hero"><div class="staff"><span></span><span></span><span></span><span></span><span></span>{notes}</div>
<h1 {R()}>{H1a}<br><em>{H1b}</em></h1><p class="sub" {R(2)}>{SUB}</p><div {R(3)}><a class="btn" href="#">認識課程</a><a class="btn o" href="#">進入練習室</a></div></div>
<div class="mq"><div>{("長笛<b>♪</b>笛子<b>♪</b>洞簫<b>♪</b>空靈鼓<b>♪</b>"+CRED+"<b>♪</b>")*4}</div></div>
<section><h2 {R()}>課程<small>左右滑動 →</small></h2><div class="rail">{"".join(f'<a class="slide" href="#" {R(i)}><img src="{IMG}{c}.webp" alt=""><div><div class="n">0{i+1}</div><h3>{a}</h3><p>{b}</p></div></a>' for i,(a,b,c) in enumerate(COURSES))}<a class="slide" href="#" {R(4)}><img src="{IMG}listening.webp" alt=""><div><div class="n">05</div><h3>音樂手記</h3><p>200 篇樂器、樂理與陪練文章。</p></div></a></div></section>
<section><h2 {R()}>練習室<small>全部免費・瀏覽器即用</small></h2><div class="grid">{"".join(f'<a class="g" href="#" {R(i)}><small>0{i+1}</small><h3>{a}</h3><p>{b}</p></a>' for i,(a,b) in enumerate(TOOLS))}</div></section>
<footer>WhatsApp 9809 6351 ・ 香港屯門</footer>'''
P[3]=("五線譜","紙白＋墨藍＋朱紅。五條譜線劃開首屏，紅色音符沿線流過；樂器名跑馬燈；課程左右滑動",css,body,"")

# ───────── 4 霧光玻璃：淺色流動光暈＋磨砂玻璃大卡（10 的玻璃感，改用沙色鼠尾草），滑鼠微傾
css='''body{background:#f5f1ea;color:#2c2a26;font:17px/1.8 "Noto Sans TC",sans-serif;overflow-x:hidden}
.blobs{position:fixed;inset:0;z-index:-1;overflow:hidden}.blobs i{position:absolute;border-radius:50%;filter:blur(70px);opacity:.75;animation:drift 22s ease-in-out infinite alternate}
.blobs i:nth-child(1){width:46vw;height:46vw;background:#cfe0d4;left:-10vw;top:-10vw}.blobs i:nth-child(2){width:40vw;height:40vw;background:#f2d3c2;right:-8vw;top:20vh;animation-delay:-8s}.blobs i:nth-child(3){width:36vw;height:36vw;background:#efe2b8;left:30vw;bottom:-14vw;animation-delay:-14s}
@keyframes drift{50%{transform:translate(6vw,4vh) scale(1.08)}100%{transform:translate(-4vw,8vh) scale(.95)}}
.glass{background:#ffffff8c;backdrop-filter:blur(18px) saturate(1.2);border:1px solid #ffffffcc;box-shadow:0 20px 50px -30px #6b5a4466}
header{position:sticky;top:12px;z-index:5;display:flex;justify-content:space-between;align-items:center;margin:12px 4vw;padding:10px 24px;border-radius:99px}.lg{font:900 18px "Noto Serif TC",serif;color:#5f7d6c}nav a{margin-left:20px;font-size:14px;color:#6b665d}nav a:hover{color:#5f7d6c}
.hero{margin:4vh 4vw 0;border-radius:40px;display:grid;grid-template-columns:1.25fr 1fr;overflow:hidden}
.hero .tx{padding:9vh 4vw}h1{font:900 clamp(34px,4vw,60px)/1.3 "Noto Serif TC",serif;word-break:keep-all}h1 em{font-style:normal;color:#5f7d6c}
.sub{margin-top:18px;color:#6b665d}.btn{display:inline-block;padding:13px 30px;border-radius:99px;margin:24px 10px 0 0;font-weight:700;background:#5f7d6c;color:#fff;box-shadow:0 10px 24px -12px #5f7d6c}.btn:hover{background:#4e6a5b}.btn.o{background:#ffffffaa;color:#2c2a26;box-shadow:none}
.hero .im{position:relative;min-height:440px}.hero .im img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;clip-path:inset(0 0 0 100%);animation:wipe 1.1s .3s cubic-bezier(.65,0,.35,1) forwards}@keyframes wipe{to{clip-path:inset(0)}}
section{padding:9vh 4vw 0}h2{font:900 30px "Noto Serif TC",serif;margin-bottom:22px}
.bento{display:grid;grid-template-columns:repeat(6,1fr);gap:16px}
.b{border-radius:28px;padding:26px;min-height:200px;position:relative;overflow:hidden;transform-style:preserve-3d;transition:transform .2s ease-out}.b h3{font:700 21px "Noto Serif TC",serif}.b p{font-size:14px;color:#6b665d}
.b.pic{padding:0;display:flex;align-items:flex-end;color:#fff}.b.pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.b.pic:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 35%,#2c2a26b0)}.b.pic div{position:relative;z-index:1;padding:22px}.b.pic p{color:#ffffffdd}
.s2{grid-column:span 2}.s3{grid-column:span 3}.s4{grid-column:span 4}
.big{font:900 64px/1 "Noto Serif TC",serif;color:#5f7d6c}
.ring{width:84px;height:84px;border-radius:50%;border:2px solid #5f7d6c55;display:grid;place-items:center;margin-bottom:10px;position:relative}.ring:after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid #5f7d6c;clip-path:inset(0 0 50% 50%);animation:spin 4s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.ring b{font:900 24px "Noto Serif TC",serif;color:#5f7d6c}
footer{text-align:center;padding:10vh 4vw;color:#6b665d}
@media(max-width:800px){nav{display:none}.hero{grid-template-columns:1fr}.hero .im{min-height:260px}.bento{grid-template-columns:1fr 1fr}.s2,.s3,.s4{grid-column:span 2}}'''
body=f'''<div class="blobs"><i></i><i></i><i></i></div>
<header class="glass"><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero glass"><div class="tx"><h1 {R()}>{H1a}<br><em>{H1b}</em></h1><p class="sub" {R(2)}>{SUB}</p><div {R(3)}><a class="btn" href="#">認識課程</a><a class="btn o" href="#">進入練習室</a></div><p {R(4)} style="margin-top:20px;font-size:14px;color:#8a7f6e">{CRED}</p></div><div class="im"><img src="{IMG}tongue-drum.webp" alt=""></div></div>
<section><h2 {R()}>課程</h2><div class="bento">{"".join(f'<a class="b pic tilt {["s4","s2","s2","s4"][i]}" href="#" {R(i)}><img src="{IMG}{c}.webp" alt=""><div><h3>{a}</h3><p>{b}</p></div></a>' for i,(a,b,c) in enumerate(COURSES))}</div></section>
<section><h2 {R()}>練習室與出品</h2><div class="bento"><div class="b glass tilt s2" {R()}><div class="ring"><b>A4</b></div><h3>調音器</h3><p>音名、簡譜與音分</p></div>{"".join(f'<div class="b glass tilt s2" {R(i+1)}><h3>{a}</h3><p>{b}</p></div>' for i,(a,b) in enumerate(TOOLS[1:3]))}<div class="b glass tilt s3" {R()}><h3>{TOOLS[3][0]}</h3><p>{TOOLS[3][1]}</p><img src="{IMG}pujian-score.webp" alt="" style="margin-top:14px;border-radius:14px"></div><div class="b glass tilt s3" {R(1)}><div class="big">200</div><h3>篇音樂手記</h3><p>{ARTS[0][1]}・{ARTS[1][1]}</p></div></div></section>
<footer>WhatsApp 9809 6351 ・ 香港屯門</footer>'''
tilt='''<script>if(matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches)document.querySelectorAll('.tilt').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')})</script>'''
P[4]=("霧光玻璃","沙色＋鼠尾草綠＋蜜桃光暈。背景三團柔光慢慢流動，磨砂玻璃卡片，滑鼠移過卡片會微微傾斜",css,body,tilt)

# ───────── 5 節目冊：明亮全幅封面相片＋奶油色封面卡疊上；羅馬數字分章，左欄標題黏住
css='''body{background:#f8f3ea;color:#2b211c;font:17px/1.85 "Noto Sans TC",sans-serif}
header{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;justify-content:space-between;padding:22px 6vw;color:#2b211c}.lg{font:600 18px "Noto Serif TC",serif;letter-spacing:.3em}nav a{margin-left:22px;font-size:14px}
.cover{position:relative;height:92vh;min-height:600px;overflow:hidden}.cover img{width:100%;height:100%;object-fit:cover;filter:brightness(1.08) saturate(.9);will-change:transform}
.cover:before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(#f8f3eacc,transparent 30%)}
.card{position:absolute;z-index:2;left:6vw;bottom:8vh;max-width:620px;background:#f8f3ea;padding:46px 48px;border-top:3px solid #b04a3c;box-shadow:0 30px 60px -30px #2b211c66;opacity:0;transform:translateY(40px);animation:rise .3s .4s cubic-bezier(.2,.8,.2,1) forwards}@keyframes rise{to{opacity:1;transform:none}}
.vol{font:italic 500 18px "Cormorant Garamond",serif;color:#b04a3c;letter-spacing:.1em}
h1{font:900 clamp(34px,4.6vw,62px)/1.28 "Noto Serif TC",serif;margin:8px 0 14px}h1 em{font-style:normal;color:#b04a3c}
.sub{color:#6f5f54;font-size:16px}.btn{display:inline-block;padding:12px 28px;margin:22px 10px 0 0;font-size:15px;letter-spacing:.12em;border:1px solid #2b211c}.btn.f{background:#2b211c;color:#f8f3ea}.btn:hover{background:#b04a3c;border-color:#b04a3c;color:#fff}
.ch{display:grid;grid-template-columns:280px 1fr;gap:5vw;padding:14vh 6vw 0;align-items:start}.ch .hd{position:sticky;top:12vh}.ch .rn{font:italic 500 80px/1 "Cormorant Garamond",serif;color:#b04a3c}.ch h2{font:600 30px "Noto Serif TC",serif}.ch .hd p{font-size:14px;color:#6f5f54;margin-top:6px}
.list a{display:grid;grid-template-columns:180px 1fr;gap:28px;align-items:center;padding:22px 0;border-top:1px solid #2b211c22}.list img{aspect-ratio:4/3;object-fit:cover;border-radius:4px;transition:transform .3s ease-out}.list a:hover img{transform:scale(1.04)}.list h3{font:600 24px "Noto Serif TC",serif}.list p{color:#6f5f54;font-size:15px}
.tl{display:grid;grid-template-columns:1fr 1fr;gap:18px}.tl a{padding:24px;background:#fffdf8;border:1px solid #2b211c14;transition:transform .25s ease-out,border-color .2s}.tl a:hover{transform:translateY(-3px);border-color:#b04a3c}.tl h3{font:600 20px "Noto Serif TC",serif}.tl p{font-size:14px;color:#6f5f54}.tl small{font:italic 500 16px "Cormorant Garamond",serif;color:#b04a3c}
.art a{display:block;padding:20px 0;border-top:1px solid #2b211c22;font:600 21px "Noto Serif TC",serif;transition:color .2s}.art a:hover{color:#b04a3c}.art small{display:block;font:500 13px "Noto Sans TC";color:#b04a3c;letter-spacing:.2em}
footer{margin-top:14vh;padding:7vh 6vw;border-top:3px solid #b04a3c;text-align:center;color:#6f5f54}
@media(max-width:800px){nav{display:none}.card{left:4vw;right:4vw;padding:30px 26px}.ch{grid-template-columns:1fr}.ch .hd{position:static}.list a{grid-template-columns:110px 1fr;gap:16px}.tl{grid-template-columns:1fr}}'''
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="cover"><img id="cv" src="{IMG}practice.webp" alt=""><div class="card"><div class="vol">Vol. 2026 · Programme</div><h1>{H1a}<br><em>{H1b}</em></h1><p class="sub">{SUB}</p><a class="btn f" href="#">認識課程</a><a class="btn" href="#">閱讀手記</a></div></div>
<div class="ch"><div class="hd" {R()}><div class="rn">I.</div><h2>課程</h2><p>{CRED}</p></div><div class="list">{"".join(f'<a href="#" {R(i)}><img src="{IMG}{c}.webp" alt=""><div><h3>{a}</h3><p>{b}</p></div></a>' for i,(a,b,c) in enumerate(COURSES))}</div></div>
<div class="ch"><div class="hd" {R()}><div class="rn">II.</div><h2>練習室與出品</h2><p>全部在瀏覽器運行，不用下載。</p></div><div class="tl">{"".join(f'<a href="#" {R(i)}><small>No.{i+1}</small><h3>{a}</h3><p>{b}</p></a>' for i,(a,b) in enumerate(TOOLS))}</div></div>
<div class="ch"><div class="hd" {R()}><div class="rn">III.</div><h2>音樂手記</h2><p>200 篇，持續更新。</p></div><div class="art">{"".join(f'<a href="#" {R(i)}><small>{a}</small>{b}</a>' for i,(a,b) in enumerate(ARTS))}</div></div>
<footer>WhatsApp 9809 6351 ・ 香港屯門</footer>'''
par='''<script>const cv=document.getElementById('cv');if(!matchMedia('(prefers-reduced-motion:reduce)').matches)addEventListener('scroll',()=>{cv.style.transform=`translateY(${scrollY*.25}px) scale(1.05)`},{passive:true})</script>'''
P[5]=("節目冊","奶油紙＋酒紅細線。明亮全幅封面相片配疊上的節目冊封面卡；I. II. III. 分章，捲動時左欄標題留住、封面相片有視差",css,body,par)

# ───────── 6 呼吸：極簡留白，首屏是一個跟著「吸氣・呼氣」脹縮的圓，切合管樂
css='''body{background:#fdfcf9;color:#24302e;font:17px/1.85 "Noto Sans TC",sans-serif}
header{display:flex;justify-content:space-between;align-items:center;padding:24px 6vw}.lg{font:600 18px "Noto Serif TC",serif;letter-spacing:.25em}nav a{margin-left:22px;font-size:14px;color:#6a7774}nav a:hover{color:#3f7f74}
.hero{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:4vw;padding:6vh 6vw 10vh;min-height:78vh}
h1{font:900 clamp(38px,5.2vw,76px)/1.25 "Noto Serif TC",serif}h1 em{font-style:normal;color:#3f7f74}.sub{margin-top:18px;color:#6a7774;max-width:460px}
.btn{display:inline-block;padding:13px 30px;border-radius:99px;margin:24px 10px 0 0;font-weight:700;background:#3f7f74;color:#fff}.btn:hover{background:#346b62}.btn.o{background:none;color:#3f7f74;box-shadow:inset 0 0 0 1.5px #3f7f74}
.br{position:relative;aspect-ratio:1;max-width:460px;margin:auto;width:100%;display:grid;place-items:center}
.br .c{position:absolute;inset:14%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e5f1ee,#bcd9d2);animation:breath 8s ease-in-out infinite}
.br .r{position:absolute;inset:4%;border-radius:50%;border:1px solid #3f7f7433;animation:breath 8s ease-in-out infinite;animation-delay:-.4s}.br .r2{inset:-4%;border-color:#3f7f741a;animation-delay:-.8s}
@keyframes breath{0%,100%{transform:scale(.82)}45%,55%{transform:scale(1)}}
.br .w{position:relative;font:600 22px "Noto Serif TC",serif;color:#3f7f74;height:34px;overflow:hidden;text-align:center}.br .w span{display:block;animation:words 8s ease-in-out infinite}@keyframes words{0%,40%{transform:translateY(0)}50%,90%{transform:translateY(-34px)}100%{transform:translateY(0)}}
.br small{position:relative;display:block;text-align:center;font-size:12px;color:#6a7774;letter-spacing:.2em;margin-top:6px}
section{padding:10vh 6vw 0}h2{font:600 28px "Noto Serif TC",serif;margin-bottom:28px;display:flex;align-items:center;gap:16px}h2:after{content:"";flex:1;height:1px;background:#24302e1f}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:28px}.four a{display:block}.four .im{border-radius:50% 50% 18px 18px;overflow:hidden;aspect-ratio:3/4}.four img{width:100%;height:100%;object-fit:cover;transition:transform .3s ease-out}.four a:hover img{transform:scale(1.05)}.four h3{font:600 20px "Noto Serif TC",serif;margin-top:14px}.four p{font-size:14px;color:#6a7774}
.bento{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.b{border-radius:22px;padding:24px;background:#f3f6f4;transition:background-color .2s,transform .25s ease-out}.b:hover{background:#e7f0ed;transform:translateY(-3px)}.b h3{font:600 19px "Noto Serif TC",serif}.b p{font-size:14px;color:#6a7774}
.b.hl{grid-row:span 2;background:#3f7f74;color:#fdfcf9;display:flex;flex-direction:column;justify-content:flex-end}.b.hl p{color:#d3e6e1}.b.hl .big{font:900 72px/1 "Noto Serif TC",serif}
footer{text-align:center;padding:12vh 6vw 8vh;color:#6a7774}
@media(max-width:800px){nav{display:none}.hero{grid-template-columns:1fr}.br{max-width:300px}.four{grid-template-columns:1fr 1fr}.bento{grid-template-columns:1fr 1fr}.b.hl{grid-row:auto;grid-column:span 2}}'''
body=f'''<header><div class="lg">張老師音樂學院</div><nav>{nav()}</nav></header>
<div class="hero"><div><h1 {R()}>{H1a}<br><em>{H1b}</em></h1><p class="sub" {R(2)}>{SUB}</p><div {R(3)}><a class="btn" href="#">預約試堂</a><a class="btn o" href="#">一起練長音</a></div><p {R(4)} style="margin-top:20px;font-size:14px;color:#6a7774">{CRED}</p></div>
<div class="br" aria-hidden="true"><div class="r r2"></div><div class="r"></div><div class="c"></div><div><div class="w"><span>吸　氣</span><span>呼　氣</span></div><small>跟著圓圈呼吸</small></div></div></div>
<section><h2 {R()}>四種聲音</h2><div class="four">{"".join(f'<a href="#" {R(i)}><div class="im"><img src="{IMG}{c}.webp" alt=""></div><h3>{a}</h3><p>{b}</p></a>' for i,(a,b,c) in enumerate(COURSES))}</div></section>
<section><h2 {R()}>練習室</h2><div class="bento"><div class="b hl" {R()}><div class="big">200</div><h3>篇音樂手記</h3><p>樂器、樂理、陪練，讀完再練。</p></div>{"".join(f'<a class="b" href="#" {R(i+1)}><h3>{a}</h3><p>{b}</p></a>' for i,(a,b) in enumerate(TOOLS))}<a class="b" href="#" {R(6)}><h3>長音練習</h3><p>計秒，看音高穩不穩</p></a></div></section>
<footer>WhatsApp 9809 6351 ・ 香港屯門</footer>'''
P[6]=("呼吸","米白＋淡青瓷綠，大量留白。首屏一個圓跟著「吸氣・呼氣」慢慢脹縮，呼應吹管樂的呼吸",css,body,"")

cards=""
for n,(name,desc,css,body,js) in sorted(P.items()):
    open(f"{D}/{n}.html","w").write(page(f"{n:02d}",name,css,body,js))
    cards+=f'<a class="k" href="{n}.html"><video src="shots/{n}.webm" poster="shots/{n}.png" autoplay muted loop playsinline></video><b>{n:02d}　{name}</b><span>{desc}</span></a>'
open(f"{D}/index.html","w").write(f'''<!doctype html><html lang="zh-HK"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第三輪｜6 款動態首頁</title>
<style>body{{font:16px/1.6 "Noto Sans TC",sans-serif;background:#f2f2f2;padding:4vw;color:#111}}h1{{margin-bottom:6px}}p.s{{margin-bottom:24px;opacity:.7}}.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:22px}}.k{{background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 8px #0002;display:block;color:inherit;text-decoration:none}}.k video{{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;display:block;background:#ddd}}.k b{{display:block;padding:12px 16px 0}}.k span{{display:block;padding:0 16px 14px;font-size:14px;opacity:.75}}</style></head><body><h1>張老師音樂學院｜第三輪：6 款動態首頁</h1><p class="s">每款版面和動畫都不同，全部用淺色。縮圖是動畫錄影，點入看完整首頁（請向下捲動看捲動動畫）。</p><div class="g">{cards}</div></body></html>''')
print("ok")
