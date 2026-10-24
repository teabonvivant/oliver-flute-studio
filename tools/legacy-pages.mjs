const L='assets/images/legacy/';
const ytWatch=id=>`https://www.youtube.com/watch?v=${id}`;
const vimeoWatch=id=>`https://vimeo.com/${id}`;

const VIDEOS={
perform:[
['yt:eiKx9rMYWZk','洞簫','「雪落下的聲音」延禧攻略片尾曲'],
['yt:_ZuZXph8DuA','笛子','山丹丹花開紅艷艷'],
['yt:qWxXD54P3HA','空靈鼓','雲水禪心 · 15 音空靈鼓'],
['yt:UCbJg81TPbw','笛子','炎（鬼滅之刃劇場版）'],
['yt:5sUlVrAQB7I','空靈鼓','彩雲追月'],
['yt:8ZglfDYtiBo','竹笛及洞簫','赤伶'],
['yt:2iiML8cEivc','笛子','身體健康'],
['yt:Cfq35pDt3D4','笛子','亂紅'],
['yt:uf-ZIu53h_0','長笛','嘆雲兮（芸汐傳）'],
['yt:KHJa19RWc94','長笛',"Nothing's Gonna Change My Love for You"],
['vi:344300505','竹笛','知否知否'],
['yt:8fOOkzXPI4Q','洞簫','大魚'],
['vi:344295334','長笛','Despacito'],
['vi:344322948','長笛','Czardas'],
['vi:344303172','長笛','Elegy'],
['vi:344307531','陶笛','半壺紗'],
['vi:344290735','洞簫','Take Five'],
['vi:344288702','洞簫、結他','穿越時空的思念']
],
drum:[
['yt:-7nhuEllqO0','空靈鼓','天空之城 · 15 音鋼炭款'],
['yt:fGcuVWboG_w','空靈鼓','春三月 · 十五音空靈鼓']
],
teach:[
['yt:QB_Nfzhoga8','長笛','長笛基礎吹奏教學：姿勢、指法、裝嵌'],
['yt:N9sm4zYcsiY','笛子','笛子發音三步曲'],
['yt:6c4uhJBhpws','笛子','持笛與按孔'],
['yt:l7KbgUuujgA','長笛','The Basic Flute Embouchure'],
['yt:INMsFBv-iAo','長笛','How to Place Your Fingers on a Flute'],
['yt:NcXRzZZv1mE','長笛','Sir James Galway Masterclass · Embouchure'],
['vi:518439904','長笛','A Tune a Day · Lesson 3']
],
master:[
['vi:462185265','長笛','長笛大師班：音準'],
['yt:VQg0vScnQ8E','長笛','Sir James Galway · Embouchure, Good Tone'],
['yt:pob8OTZUcvk','長笛','Sir James Galway · Practicing Scales'],
['yt:FLtr9JUcw7U','長笛','Emmanuel Pahud · Schubert Theme and Variations'],
['yt:_T9op3aEML4','長笛','Emmanuel Pahud · Posture and Embouchure'],
['yt:0p6AMvNhc9g','長笛','Emmanuel Pahud · Head Joint Position'],
['yt:4p7UNJ17bHQ','長笛','Juliette Hurel · Playing Soft in the High Register'],
['yt:quOMEQ7_0nE','長笛','Jim Walker · Flute Masterclass'],
['yt:_5w5TVK5B90','長笛','LSO Master Class · Flute and Piccolo']
]};

const SCORES={
pop:[
'尋秦記 · 天命最高（長笛五線譜）','尋秦記 · 天命最高（簡譜）','炎 HOMURA（鬼滅之刃劇場版 · 第 1 頁）','炎 HOMURA（續頁）','炎 HOMURA（續頁）','紅蓮華（第 1 頁）','紅蓮華（續頁）','不染（降 B 調）','不染（A 調）','光年之外','笛子指法表（附錄）','千里之外','Despacito（續頁）','Despacito','亂紅','時間煮雨','ブルーバード · 青鳥（火影忍者 OP）','ブルーバード · 青鳥（續頁）','綠野仙蹤','涼涼','嘆雲兮'],
dizi:['校歌 · 宣道青年歌','大魚（洞簫《大魚海棠》印象曲）','LET IT GO ／ 龍的傳人','Mary Had a Little Lamb ／ 小星星','笛子指法表（附錄）'],
drum:['歡樂頌','小蜜蜂','友誼萬歲','帝女花','搖籃曲','生日歌','我的驕傲','Joy To The World','Merry Christmas','萬水千山總是情']
};

const ARCHIVE_NOTE='這是舊站 oliverflute.com 的文章，內容保留原貌，只修正排版。其中的考試日期、價錢和課程安排屬寫作當時的資料，請以現行公布為準。';

export async function addLegacyPages({pages,add,hero,band,link,cta,para,faq,esc,WA,read,BRAND}){
const MEDIA=JSON.parse(await read('content/legacy-media.json'));
const POSTS=JSON.parse(await read('content/legacy-posts.json'));
const patch=(file,fn)=>{const p=pages.find(x=>x.file===file);if(!p)throw Error('legacy: missing page '+file);p.body=fn(p.body)};
const before=(body,marker,html)=>{if(!body.includes(marker))throw Error('legacy: marker not found '+marker);return body.replace(marker,html+marker)};

const tabs=cur=>`<nav class="media-tabs" aria-label="影音相片與樂譜">${[['gallery.html','相片集'],['videos.html','影片'],['scores.html','樂譜'],['archive.html','舊站手記']].map(([h,t])=>`<a href="${h}"${h===cur?' aria-current="page"':''}>${t}</a>`).join('')}</nav>`;
const photo=(name,alt,group)=>{const m=MEDIA[name];return `<a class="lb-item" href="${L}${name}.webp" data-lightbox="${esc(alt)}" data-w="${m.w}" data-h="${m.h}"><img src="${L}${name}-480.webp" width="${m.tw}" height="${m.th}" alt="${esc(alt)}" loading="lazy" decoding="async"></a>`};
const range=(g,n)=>Array.from({length:n},(_,i)=>`${g}-${String(i+1).padStart(3,'0')}`);
const gallery=(items,cls='')=>`<div class="lb-grid ${cls}" data-lightbox-group>${items.join('')}</div>`;
const more=(items,show,cls='')=>{const a=items.slice(0,show).join('');const b=items.slice(show).join('');return `<div class="lb-grid ${cls}" data-lightbox-group data-collapsible="${items.length-show}">${a}${b.replace(/<a class="lb-item"/g,'<a class="lb-item lb-extra"')}</div>`};

const classPhotos=range('class',111).map((n,i)=>photo(n,`張老師的屯門課堂照片 ${i+1}`));
const perfPhotos=range('perf',36).map((n,i)=>photo(n,`張老師的演出照片 ${i+1}`));
const awardPhotos=range('awards',20).map((n,i)=>photo(n,`學生得獎與考級成績 ${i+1}`));
const orgLogos=range('orgs',29).map((n,i)=>`<li><img src="${L}${n}.webp" width="${MEDIA[n].w}" height="${MEDIA[n].h}" alt="合作學校及機構校徽 ${i+1}" loading="lazy" decoding="async"></li>`).join('');

add('gallery.html','相片集','張老師的教學留影、演出照片、學生得獎與考級成績，以及合作過的學校與機構。',
hero('相片集','二十年的課堂、舞台和學生的成績，都在這裏。')+tabs('gallery.html')+
`<section class="band gallery-band" id="class"><h2>教學留影</h2><p>屯門課室的日常：吹口、手形、呼吸，都在一堂一堂之間慢慢調整。</p>${more(classPhotos,24)}</section>`+
`<section class="band gallery-band" id="performance"><h2>演出照片</h2><p>長笛、竹笛、洞簫的獨奏、合奏與指揮。2007 年隨團到北京演奏廳演出，2011 年參與錄製 CCTV「魅力校園」。</p>${more(perfPhotos,12)}</section>`+
`<section class="band gallery-band" id="awards"><h2>學生成績與獎項</h2><p>部分學生的比賽獎項、考級證書與考官評語。</p>${gallery(awardPhotos)}</section>`+
`<section class="band gallery-band" id="orgs"><h2>曾經合作的學校與機構</h2><p>張老師曾擔任四十多間中小學的竹笛及指揮工作，亦與嶺南大學、城市大學、VTC 展亮技能發展中心、東華三院「健康校院計劃」、傷殘青年協會、YMCA、保良局、明愛、聖公會、麥理浩夫人中心等百多間機構合作課程。以下是部分校徽。</p><ul class="logo-wall">${orgLogos}</ul></section>`+
cta(),'gallery.html');

const FACADE=([key,tag,title])=>{
  const [kind,id]=key.split(':');
  const href=kind==='yt'?ytWatch(id):vimeoWatch(id);
  const vm=VM[key];
  return `<a class="video-card" href="${href}" data-video="${key}" target="_blank" rel="noopener"><span class="video-thumb"><img src="${L}video-${id}.webp" width="${vm.w}" height="${vm.h}" alt="" loading="lazy" decoding="async"><i class="play" aria-hidden="true"></i></span><span class="video-meta"><small>${tag}</small><strong>${esc(title)}</strong></span></a>`;
};
const VM=JSON.parse(await read('content/legacy-video-meta.json'));
const vgrid=list=>`<div class="video-grid">${list.map(FACADE).join('')}</div>`;
add('videos.html','影片','張老師的長笛、竹笛、洞簫、空靈鼓演奏，以及吹奏教學和長笛大師班分享。',
hero('影片','聽一聽，再決定喜歡哪一種聲音。')+tabs('videos.html')+
`<section class="band video-band" id="perform"><h2>演奏分享</h2><p>張老師的長笛、竹笛、洞簫、陶笛與空靈鼓演奏。按一下縮圖才會載入影片。</p>${vgrid(VIDEOS.perform)}</section>`+
`<section class="band video-band" id="drum"><h2>空靈鼓音色示範</h2><p>想先知道空靈鼓是甚麼聲音，可以由這兩首開始。</p>${vgrid(VIDEOS.drum)}<p class="video-more">${link('tongue-drum-course.html','了解空靈鼓課程')}</p></section>`+
`<section class="band video-band" id="teach"><h2>吹奏教學</h2><p>長笛與笛子的基本吹奏：持笛、嘴形、指法與發音。</p>${vgrid(VIDEOS.teach)}<div class="teach-figures"><figure><a class="lb-item" href="${L}teach-006.webp" data-lightbox="長笛吹奏嘴型教學圖" data-w="${MEDIA['teach-006'].w}" data-h="${MEDIA['teach-006'].h}"><img src="${L}teach-006-480.webp" width="${MEDIA['teach-006'].tw}" height="${MEDIA['teach-006'].th}" alt="長笛吹奏嘴型教學圖" loading="lazy" decoding="async"></a><figcaption><strong>嘴型教學圖</strong>很多初學長笛的同學都覺得長笛難吹，原因是氣不能有效吹進笛裏。這張圖拆開幾個嘴形要點，可以幫助找到方向。</figcaption></figure><figure><a class="lb-item" href="${L}teach-007.webp" data-lightbox="長笛吹奏姿勢教學圖" data-w="${MEDIA['teach-007'].w}" data-h="${MEDIA['teach-007'].h}"><img src="${L}teach-007-480.webp" width="${MEDIA['teach-007'].tw}" height="${MEDIA['teach-007'].th}" alt="長笛吹奏姿勢教學圖" loading="lazy" decoding="async"></a><figcaption><strong>吹奏姿勢圖</strong>吹奏時覺得長笛很重、手指不夠長按鍵，多半與持笛姿勢有關。這張圖示範身體和手形的安排。</figcaption></figure></div></section>`+
`<section class="band video-band" id="masterclass"><h2>大師班分享</h2><p>張老師推薦學生觀看的長笛大師班，涵蓋嘴形、音色、音階練習與高音區的控制。影片來自各大師及機構的公開頻道。</p>${vgrid(VIDEOS.master)}</section>`+
cta(),'gallery.html');

const scoreGrid=(g,n,label)=>gallery(range(`score-${g}`,n).map((nm,i)=>photo(nm,`${label}：${SCORES[g][i]}`)),'score-grid');
add('scores.html','樂譜','張老師教學使用的流行曲簡譜與五線譜、笛子班樂譜及空靈鼓曲譜，供學生課堂練習。',
hero('樂譜','課堂上用的曲譜，整理在這裏。')+tabs('scores.html')+
`<section class="band score-band" id="note"><p class="score-note">以下樂譜供張老師的學生在課堂內外練習使用。部分樂曲的著作權屬原作者及出版商；網上不提供下載，如需印本請在上課時向張老師索取。譜面按舊站原貌轉載。</p></section>`+
`<section class="band score-band" id="pop"><h2>流行曲譜</h2><p>長笛及笛子的流行曲、動漫曲與影視金曲，共 ${SCORES.pop.length} 張。點開可放大閱讀。</p>${scoreGrid('pop',SCORES.pop.length,'流行曲譜')}</section>`+
`<section class="band score-band" id="dizi"><h2>笛子班樂譜</h2><p>笛子班入門練習曲與附錄指法表。</p>${scoreGrid('dizi',SCORES.dizi.length,'笛子班樂譜')}</section>`+
`<section class="band score-band" id="drum"><h2>空靈鼓曲譜</h2><p>空靈鼓初班使用的簡譜，D 調十五音適用。</p>${scoreGrid('drum',SCORES.drum.length,'空靈鼓曲譜')}<p class="video-more">${link('pujian.html','用譜間自己打一份譜')}</p></section>`+
cta('想學某一首曲？','告訴張老師你喜歡的歌，可以一起看看適不適合你現在的程度。'),'gallery.html');

// 舊站手記
const archiveDate=d=>d?d.replaceAll('-',' / '):'';
const postsMeta=POSTS.map(p=>({...p,file:`archive/${p.slug}.html`,tag:(p.tags&&p.tags[0])||'舊站手記'}));
const cardImg=p=>{const b=p.blocks.find(x=>x[0]==='img');return b?`<img src="${L}post-${b[1]}.webp" width="${b[2][2]}" height="${b[2][3]}" alt="" loading="lazy" decoding="async">`:''};
add('archive.html','舊站手記','張老師在 oliverflute.com 寫過的音樂文章：長笛初學、呼吸、選笛、標準音、五聲音階、尺八、葫蘆絲、Trinity 與 ABRSM 考試等。',
hero('舊站手記','來自 oliverflute.com 的二十篇文章，保留當年的寫法。')+tabs('archive.html')+
`<section class="band archive-band"><p class="score-note">${ARCHIVE_NOTE}想讀整理後的新文章，可以看<a href="blog.html">200 篇音樂手記</a>。</p><div class="archive-list">${postsMeta.map(p=>`<a class="archive-card" href="${p.file}"><span class="archive-img">${cardImg(p)}</span><span class="archive-text"><small>${esc(p.tag)}${p.date?' · '+archiveDate(p.date):''}</small><strong>${esc(p.title)}</strong>${p.sub?`<em>${esc(p.sub)}</em>`:''}</span></a>`).join('')}</div></section>`,'gallery.html');

for(const p of postsMeta){
  const body=p.blocks.map(b=>b[0]==='img'?`<figure class="legacy-figure"><img src="../${L}post-${b[1]}.webp" width="${b[2][2]}" height="${b[2][3]}" alt="" loading="lazy" decoding="async"></figure>`:b[1].split('\n').map(x=>x.trim()).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('')).join('\n');
  add(p.file,p.title,(p.sub?p.sub+'。':'')+'張老師在舊站 oliverflute.com 的文章：'+p.title+'。',
  `<div class="article-heading"><nav class="breadcrumb" aria-label="所在位置"><a href="../index.html">首頁</a><span>/</span><a href="../archive.html">舊站手記</a>${p.tags&&p.tags[0]?`<span>/</span><span>${esc(p.tags[0])}</span>`:''}</nav><h1>${esc(p.title)}</h1>${p.sub?`<p class="article-deck">${esc(p.sub)}</p>`:''}<p class="article-meta">${BRAND} · 舊站文章${p.date?' · '+archiveDate(p.date):''}</p></div><div class="article-shell"><aside class="article-side"><p>舊站文章</p><a href="../archive.html">全部舊站手記</a><a href="../blog.html">200 篇音樂手記</a><a href="../courses.html">課程</a></aside><article class="article-body legacy-post"><p class="legacy-note">${ARCHIVE_NOTE}</p>${body}<div class="article-end"><p>想把這些方法用在自己身上？</p><a class="btn primary" href="../contact.html">與張老師討論學習安排</a><a class="text-link" href="../archive.html">返回舊站手記</a></div></article></div>`,'gallery.html');
}

// 空靈鼓配件
const acc=(n,alt)=>`<figure class="acc-fig"><img src="${L}${n}.webp" width="${MEDIA[n].w}" height="${MEDIA[n].h}" alt="${alt}" loading="lazy" decoding="async"></figure>`;
const price=(name,desc,items)=>`<article class="acc-item"><div><h3>${name}</h3><p>${desc}</p></div><ul class="price-list">${items.map(([a,b])=>`<li><span>${a}</span><strong>${b}</strong></li>`).join('')}</ul></article>`;
add('drum-accessories.html','空靈鼓配件','張老師為學生代訂的空靈鼓配件：6 吋 11 音小鼓、鼓架、桌面支架及金屬支架，附學生訂購價。',
hero('空靈鼓配件','小鼓、鼓架和支架，上課與在家練習都用得着。')+
`<section class="band acc-band"><p class="score-note">以下是舊站列出的學生訂購價，供張老師的學生代訂樂器配件之用。現貨與價錢以張老師確認為準。</p><div class="acc-list">`+
price('6 吋 11 音小鼓','6 吋 11 音的迷你鼓十分輕巧，方便外出攜帶演奏，11 音的排列能演奏部分簡單的小曲。顏色：白色、薰衣草、藏青、金色、翡翠綠、黑曜色。',[['學生訂購價','HK$280']])+
price('11 音小鼓架','專為小空靈鼓（5.5／6／8 吋適用）研發的原木可拆卸鼓托架，選用台灣相思木與櫸木，原木質感佳。',[['訂購價','HK$180']])+
price('15 音空靈鼓架','專為手碟與空靈鼓研發的原木鼓架，選用天然櫸木，可折疊，並可正轉與反轉調整成兩種高度。',[['小號（坐用）','HK$180'],['中號（站用）','HK$240'],['大號（兩用）','HK$330']])+
price('桌面支架','簡單小巧的支架，可放空靈鼓、樂譜及書本，亦可用於桌面斜放空靈鼓。',[['小號（課室款）','HK$15'],['大號','HK$30']])+
price('桌面支架（金屬）','簡單小巧的金屬支架，可用於桌面斜放空靈鼓，方便敲奏，是張老師個人推薦的款式。體型最細，只可放空靈鼓。',[['訂購價','HK$50']])+
`</div><div class="acc-gallery">${acc('accessories-001','空靈鼓小鼓產品圖')}${acc('accessories-004','可折疊實木支架兩用款')}${acc('accessories-005','空靈鼓擺放在桌面支架上')}${acc('accessories-006','金屬桌面支架')}</div></section>`+
band('想了解空靈鼓課程？',`<div class="tool-links">${link('tongue-drum-course.html','空靈鼓課程')}${link('videos.html#drum','聽聽空靈鼓的聲音')}${link('contact.html','WhatsApp 查詢')}</div>`)+cta('需要配件或代訂樂器？','告訴張老師你想訂的項目與課堂日期，方便他預先安排。'),'courses.html');

// 課程頁補回舊站資料
const facts=(rows)=>`<dl class="fact-list">${rows.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const LOC='屯門 99 COMMONS 大廈（建安／青雲輕鐵站旁）。教學繁忙，不設上門及試堂。';
patch('flute-course.html',b=>before(b,'<section class="enquiry-band">',band('課堂資料',facts([['對象','9 歲或以上。長笛長度較長，手臂不夠長的小朋友可先由笛子或葫蘆絲入門。'],['形式','一對一；小組另議'],['時間','個別安排，每節 45 或 60 分鐘'],['地點',LOC],['考試','英國皇家音樂學院（ABRSM）、聖三一音樂學院（Trinity）']])+`<h3 class="fact-sub">課堂內容</h3><p>基本樂理、嘴形、發音、呼吸、運舌和指法等技巧之外，張老師會按程度挑選古典名曲，也會用爵士、流行曲甚至動漫歌曲訓練。每年安排學生報考英國皇家音樂學院考試，並推薦參加不同類型的公開比賽。</p><ul class="simple-list"><li>視奏訓練（Sight-reading）</li><li>不同品牌長笛的特性</li><li>長笛簡單維修保養知識</li><li>正確、有效、節省時間的練習方法</li><li>演奏與應試技巧</li></ul><p>想看學生的成績和課堂照片？見<a href="gallery.html#awards">相片集</a>。</p>`,'course-facts')));
patch('dizi-course.html',b=>before(b,'<section class="enquiry-band">',band('課堂資料',facts([['樂器','笛子、洞簫、葫蘆絲'],['對象','8 歲或以上'],['形式','一對一，或線上 Zoom'],['時間','個別私人教授，每節 45 或 60 分鐘'],['地點',LOC],['考試','中央音樂學院／中國民族管弦樂學會考級基準試']])+`<h3 class="fact-sub">課堂內容</h3><p>基本樂理、嘴形、發音、呼吸、運舌和指法等技巧之外，張老師會按程度教授中國古曲，也用爵士樂、流行曲、動漫歌曲訓練。每年夏季安排笛子考級，並推薦學生參加不同類型的公開比賽。</p><ul class="simple-list"><li>視奏訓練（Sight-reading）</li><li>笛膜的使用方法</li><li>笛子簡單調音及挖孔方法</li><li>正確、有效、節省時間的練習方法</li><li>演奏與應試技巧</li></ul><p>想聽聽笛子的聲音？見<a href="videos.html#perform">演奏分享</a>。笛子班使用的樂譜在<a href="scores.html#dizi">樂譜頁</a>。</p>`,'course-facts')));
patch('xiao-course.html',b=>before(b,'<section class="enquiry-band">',band('課堂資料',facts([['樂器','洞簫與笛子、葫蘆絲同屬張老師的中國吹管課程'],['對象','8 歲或以上'],['形式','一對一，或線上 Zoom'],['時間','個別私人教授，每節 45 或 60 分鐘'],['地點',LOC],['考試','中央音樂學院／中國民族管弦樂學會考級基準試']])+`<p>想聽聽洞簫的聲音？見<a href="videos.html#perform">演奏分享</a>。</p>`,'course-facts')));
patch('tongue-drum-course.html',b=>before(b,'<section class="enquiry-band">',
band('空靈鼓入門初班',`<p class="score-note">現正招生：2026 年 11 月班。名額以學會網站報名頁為準。</p>`+facts([['課程','空靈鼓入門初班，共八課，每課約 75 分鐘，粵語教授'],['學費','HK$1,680（原價 HK$1,880）'],['名額','6 至 12 人'],['樂器','上課時可借用課室空靈鼓'],['地點','佐敦：彌敦道 229 號周生生大廈 12/F（佐敦站 C1 出口旁邊）'],['證書','出席率達 75% 並完成錄影習作，可向香港古樹茶文化學會申請「空靈鼓修讀證書」']])+`<h3 class="fact-sub">2026 年 11 月班別</h3><div class="table-scroll"><table><thead><tr><th>班別</th><th>上課日</th><th>上課時間</th></tr></thead><tbody><tr><td>佐敦 G1</td><td>逢星期一</td><td>下午 2:00</td></tr><tr><td>佐敦 G2</td><td>逢星期五</td><td>下午 2:30</td></tr><tr><td>佐敦 G3</td><td>逢星期一</td><td>晚上 7:00</td></tr></tbody></table></div><h3 class="fact-sub">往期班：2026 年 9 月（已開課）</h3><p class="score-note">9 月 21 日、10 月 1 日及公眾假期不上課；當期學費 HK$1,880，優惠期內 85 折（HK$1,598）。</p><div class="table-scroll"><table><thead><tr><th>班別</th><th>日期</th><th>上課時間</th></tr></thead><tbody><tr><td>佐敦 E1</td><td>9 月 3 日至 10 月 29 日，逢星期四</td><td>上午 11:00 – 12:15</td></tr><tr><td>佐敦 E2</td><td>9 月 7 日至 11 月 9 日，逢星期一</td><td>下午 3:15 – 4:30</td></tr><tr><td>佐敦 E3</td><td>8 月 26 日至 10 月 28 日，逢星期三</td><td>上午 11:00 – 12:15</td></tr><tr><td>佐敦 E4</td><td>9 月 15 日至 11 月 3 日，逢星期二</td><td>晚上 8:30 – 9:45</td></tr></tbody></table></div><h3 class="fact-sub">課程內容</h3><ol class="learning-steps"><li>空靈鼓簡易技法</li><li>基礎樂理知識</li><li>經典流行金曲</li><li>禪修放鬆音樂</li><li>古風中國歌曲</li></ol><div class="tool-links"><a class="text-link" href="https://www.organict.net/meditation-drum" target="_blank" rel="noopener">到學會網站報名</a><a class="text-link" href="https://www.organict.net/tongue-drumqa" target="_blank" rel="noopener">課程常見問答</a></div>`,'course-facts')+
band('先試一堂：空靈鼓體驗課',`<p>體驗課為初接觸空靈鼓、不知道是否適合自己的朋友而設。張老師會準備簡單的流行曲，零音樂基礎也可以；上完課後，你會懂得簡單的看譜方法和數拍子，至少能演奏一兩首自選的歌曲。</p>`+facts([['學費','HK$600／人（包含練習曲譜），二人同行另有優惠'],['課堂','每課約 75 至 90 分鐘'],['日期','逢星期一至五，與張老師預約時間'],['地點','屯門、佐敦課室'],['樂器','毋須帶備，現場免費借用'],['內容','空靈鼓速成技法、簡易樂理、敲奏音色及力度改善、自選學習歌曲']])+`<p>想先聽聽空靈鼓的聲音，見<a href="videos.html#drum">音色示範</a>。</p>`,'course-facts')+
band('樂器與配件',`<p>課堂上可借用空靈鼓；張老師建議同學在家準備指定規格的樂器練習，保持進度。規格：魯儒牌鈦金鋼 15 音空靈鼓（D 調），顏色可參考<a href="https://www.lurudrumhk.com/store/products/15note-drum" target="_blank" rel="noopener">魯儒官方頁面</a>。經學會訂購的優惠價為 HK$1,280（原價 HK$1,880），請在報名時注明；需由老師代訂的，請於開課前 7 天報名。</p><p>小鼓、鼓架與桌面支架另有學生訂購價，見<a href="drum-accessories.html">空靈鼓配件</a>。</p>`,'course-facts')));
patch('contact.html',b=>before(b,'<div class="resource-links"><a href="about.html"','<div class="address-block"><h3>上課地點</h3><p><strong>屯門：</strong>99 COMMONS 大廈（建安／青雲輕鐵站旁）<a href="https://maps.google.com/maps?q=PIU%20TU%20RD%2099%2C%2099%20COMMONS" target="_blank" rel="noopener">在地圖查看</a></p><p><strong>佐敦（空靈鼓課程）：</strong>彌敦道 229 號周生生大廈 12/F（佐敦站 C1 出口旁邊）</p><p>長笛及笛子課教學繁忙，不設上門及試堂。</p></div>'));
patch('about.html',()=>about());
function about(){
return hero('讓聲音有來處，<br>讓練習有方向。','張家詠 Oliver Cheung · 音樂教學與演奏')+
`<section class="band teacher-intro"><img src="assets/images/teacher-profile.webp" width="600" height="480" alt="張家詠老師 Oliver Cheung" loading="lazy"><div><h2>從演奏經驗，回到每一堂課</h2>${para('張家詠老師現為香港古樹茶文化學會副會長、樂聚忘憂樂團團長、國家高級評茶師、屯門文藝協進會導師，擅長演奏竹笛、長笛、洞簫、空靈鼓、葫蘆絲等樂器。','畢業後致力於音樂教育二十年，先後擔任四十多間中小學的竹笛及指揮工作，亦與不同機構合辦音樂課程。')}</div></section>`+
band('學習與資歷',`<div class="timeline"><div><span>師承</span><p>自少學習音樂，先後跟從李詩曼女士、陳仕斌先生及余永進先生進修長笛。</p></div><div><span>資格</span><p>皇家音樂學院「長笛演奏文憑」及「八級樂理」；中央音樂學院「竹笛演奏文憑」。</p></div><div><span>2011</span><p>獲中國民族管弦樂學會「高級指導教師」資格。</p></div><div><span>2015</span><p>獲屯門文藝協進會頒發「藝術成就獎」。</p></div><div><span>2020</span><p>起開設空靈鼓及茶禪音樂課程，應用於身心靈及情緒的調整。張老師曾研習音樂治療、靜觀及 NLP。</p></div></div>`)+
band('演出與合作',para('曾隨樂團到訪北京、深圳、珠海、廣東、澳門等地演出；2007 年隨團到「北京演奏廳」演出，2011 年參與錄製 CCTV「魅力校園」等演出。','曾與嶺南大學、城市大學、VTC 展亮技能發展中心、東華三院「健康校院計劃」、傷殘青年協會、YMCA、保良局、明愛「隔離台」、聖公會、麥理浩夫人中心等百多間機構合作課程，至今教授學員數千人。')+`<div class="tool-links">${link('gallery.html#performance','看演出照片')}${link('gallery.html#orgs','合作過的學校與機構')}${link('gallery.html#awards','學生成績與獎項')}${link('videos.html#perform','聽演奏')}</div>`)+
`<section class="band concept-band" id="concept"><h2>教學理念</h2><div class="teaching-columns"><div><h3>音樂從興趣開始</h3><p>若音樂無法讓人本身感到快樂，學習音樂的路就不容易走得長久。在一次又一次練習的過程中，如果不知道自己未來能否從音樂中得到快樂，那只是徒勞的練習。學習音樂，首先從興趣開始。</p></div><div><h3>定立目標</h3><p>考試往往令學生煩惱、逃避，但在多年教學經驗裏，考試是一個良好的目標，令學生更有動力去進步。老師亦應令學生明白，考試只是學習的一部分，用來測試自己的技藝，不應以分數和名次去定義音樂的成就。</p></div><div><h3>享受音樂，不拘一格</h3><p>一首動聽的歌曲不一定很複雜。張老師的學生並不拘泥於古典音樂，粵曲、流行曲、歐洲古典音樂、美國爵士樂、印度的 Raga 都有令人陶醉之處。接觸不同的元素，才能豐富音樂世界，哪怕是簡單的一曲，也能更加動聽。</p></div></div></section>`+
band('把「再練一次」變成清楚的方法',`<div class="teaching-columns"><div><h3>先聽問題在哪裏</h3><p>聲音不穩，可能與氣流、嘴形、按鍵或孔位有關。分開觀察，才容易知道下一步該處理甚麼。</p></div><div><h3>讓學生做得到</h3><p>把難段縮成一個音、一個轉換或短短兩拍。任務有清楚範圍，回家練習便能接續課堂。</p></div><div><h3>把技巧放回音樂</h3><p>基本功改善後，接回作品的節奏與句子。音準、音色與手指協調，最終都要幫助表達。</p></div></div>`)+
band('每種學習狀態，都有值得照顧的地方',para('兒童入門需要觀察樂器是否合手、專注時間和練習方式；成人學習則要把工作與生活時間一起考慮。已有基礎的學生，可以從反覆遇到的技巧問題或想演奏的作品出發。','考級可以是學習目標之一，聆聽、合奏與閱讀新譜同樣重要。課程方向應隨能力和需要調整，不必讓所有學生走同一條路。')+`<div class="tool-links">${link('courses.html','了解課程')}${link('contact.html','查詢課堂')}</div>`)+cta();
}

// 考級：中央音樂學院
patch('exam-guide.html',b=>before(b,'<section class="enquiry-band">',band('中央音樂學院海外考級（笛子）',`<p class="score-note">以下整理自舊站，所述報名日期及考試日期屬 2019 年簡章。報考前請到香港考試及評核局查閱最新公布。</p><details class="ccom-details" id="ccom"><summary>簡介、報考資格與考試要求</summary><div>${para('中央音樂學院是國內唯一的重點高校，屬國家「211 工程」建設的藝術院校。中央音樂學院與香港考試及評核局（考評局）自 2003 年起，在香港合作舉辦中樂演奏水平等級考試，為學習中樂演奏的香港學生與居民提供優良的學習服務和演奏水平被正確評估的機會。')}<h3>報考資格</h3>${para('申請人必須年滿 18 歲；18 歲以下考生須經家長／監護人、老師或學校／樂室報名，18 歲或以上考生可自行報名。報考各樂器的考生沒有年齡及專業數目限制，但每年考試中不能在相同專業內重複報考同一級別。','報考各樂器七至九級者，必須具有於香港考獲的北京中央音樂學院一級樂理考試證書；報考演奏級者，必須具有於香港考獲的九級樂器考試（與報考演奏級為同一樂器）及二級樂理考試證書。')}<h3>考試內容</h3>${para('演奏部分一律使用中央音樂學院考級委員會編訂的《海外版》教材，考試內容為該級曲目中自選練習曲一首、樂曲兩首。一至六級另設口試：文字題口答、簡譜視唱、節奏讀譜或視擊（拍出節奏）。')}<h3>考試要求</h3>${para('一至九級各樂器考試中，18 歲以下考生應考時必須背譜演奏；18 歲或以上考生可看譜。所有考生應考時必須帶備《海外版》正本教材進入考場，否則成績或會受影響。','考生應考笛子須自備樂器。考官可幫助一至四級考生調弦，樂器考試不用伴奏。因考試時間不足以演奏整首樂曲，考官會在能予評分的情況下中斷演奏。')}<h3>報名與考試安排（2019 年簡章）</h3>${para('考試時間一般為星期一至星期六上午 9 時至中午 12 時或下午 2 時至 5 時，日期及時間由電腦分配，以准考證為準。2019 年網上報名日期為 3 月 1 日上午 8 時 30 分至 3 月 21 日下午 5 時 30 分。')}<div class="resource-links"><a href="http://www.hkeaa.edu.hk/DocLibrary/ipe/ccompractical/ccm_title_dizi.pdf" target="_blank" rel="noopener">竹笛考級曲目（PDF）</a><a href="http://www.hkeaa.edu.hk/DocLibrary/ipe/ccompractical/ccm_title_oral.pdf" target="_blank" rel="noopener">口試簡譜視唱及節奏資料（PDF）</a><a href="https://online.hkeaa.edu.hk/Portal/home.xhtml" target="_blank" rel="noopener">考評局網上報名</a></div></div></details>`)));

// 首頁入口
patch('index.html',b=>before(b,'<section class="enquiry-band">',band('看看、聽聽、翻翻',`<div class="route-list"><a href="videos.html"><h3>影片</h3><p>長笛、竹笛、洞簫與空靈鼓的演奏，以及吹奏教學和大師班。</p><span>去聽聽</span></a><a href="gallery.html"><h3>相片集</h3><p>課堂留影、演出照片、學生成績，以及合作過的學校與機構。</p><span>看相片</span></a><a href="scores.html"><h3>樂譜</h3><p>流行曲、笛子班與空靈鼓曲譜，在課堂上使用。</p><span>翻樂譜</span></a><a href="archive.html"><h3>舊站手記</h3><p>來自 oliverflute.com 的二十篇文章，由學長笛到標準音。</p><span>讀舊文</span></a></div>`,'home-library')));
}
