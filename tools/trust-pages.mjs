// 信任證據前移（2026-10-24）：課程頁換真實相片、張老師小卡、頁頂 WhatsApp、舊站未上頁的相片。
const L='assets/images/legacy/';
export const WA_TOPIC={'flute-course.html':'長笛課程','dizi-course.html':'笛子課程','xiao-course.html':'洞簫課程','tongue-drum-course.html':'空靈鼓課程','drum-accessories.html':'空靈鼓配件','parents.html':'小朋友的音樂課程','adult-beginner.html':'成人音樂課程','exam-guide.html':'考級課程'};
export const waText=file=>file==='drum-accessories.html'?'張老師你好，我想訂購空靈鼓配件。\n想買：\n數量：\n取貨方式：':file==='tongue-drum-course.html'
  ?'張老師你好，我想查詢空靈鼓課程。\n想報：入門初班／體驗課\n可上課時間：'
  :`張老師你好，我想查詢${WA_TOPIC[file]||'音樂課程'}。\n${WA_TOPIC[file]?'':'想學樂器：\n'}學生年齡：\n學過樂器：\n可上課時間：`;

export async function addTrust({pages,esc,WA,read}){
const MEDIA=JSON.parse(await read('content/legacy-media.json'));
const patch=(file,fn)=>{const p=pages.find(x=>x.file===file);if(!p)throw Error('trust: missing page '+file);const b=fn(p.body);if(b===p.body)throw Error('trust: no change '+file);p.body=b};
const wa=file=>`${WA}?text=${encodeURIComponent(waText(file))}`;
const pic=(n,alt,cls='real-figure',cap='')=>{const m=MEDIA[n];if(!m)throw Error('trust: missing image '+n);return `<figure class="${cls}"><img src="${L}${n}.webp" srcset="${L}${n}-480.webp 480w, ${L}${n}.webp ${m.w}w" sizes="(max-width: 760px) 100vw, 50vw" width="${m.w}" height="${m.h}" alt="${esc(alt)}" loading="lazy" decoding="async">${cap?`<figcaption>${esc(cap)}</figcaption>`:''}</figure>`};
const lb=(n,alt)=>{const m=MEDIA[n];if(!m)throw Error('trust: missing image '+n);return `<a class="lb-item" href="${L}${n}.webp" data-lightbox="${esc(alt)}" data-w="${m.w}" data-h="${m.h}"><img src="${L}${n}-480.webp" width="${m.tw}" height="${m.th}" alt="${esc(alt)}" loading="lazy" decoding="async"></a>`};
const strip=(title,items,more='')=>`<section class="band real-strip"><h2>${title}</h2><div class="lb-grid" data-lightbox-group>${items.map(([n,a])=>lb(n,a)).join('')}</div>${more}</section>`;
const heroWa=file=>b=>{const i=b.indexOf('</div></section>');if(i<0)throw Error('trust: hero '+file);return b.slice(0,i)+`<p class="hero-wa"><a class="btn primary" href="${wa(file)}" target="_blank" rel="noopener">WhatsApp 張老師</a><span>9809 6351</span></p>`+b.slice(i)};
const swapArt=(b,html)=>b.replace(/<figure class="editorial-figure">[\s\S]*?<\/figure>/,html);
const ctaWa=file=>b=>b.replace('<a class="btn primary" href="contact.html">查詢課程</a>',`<a class="btn primary" href="${wa(file)}" target="_blank" rel="noopener">WhatsApp 張老師</a>`);
const card=(lines)=>`<aside class="teacher-card">${pic('about-001','張家詠老師手持長笛','tc-photo')}<div><p class="tc-name">張家詠老師 <span>Oliver Cheung</span></p><ul>${lines.map(x=>`<li>${x}</li>`).join('')}</ul><a class="text-link" href="about.html">認識張老師</a></div></aside>`;
const WIND=['皇家音樂學院長笛演奏文憑、八級樂理','中央音樂學院竹笛演奏文憑','二十年教學，曾任四十多間中小學竹笛及指揮','與百多間機構合作課程，教授學員數千人'];
const DRUM=['香港古樹茶文化學會副會長、樂聚忘憂樂團團長','2020 年起開設空靈鼓及茶禪音樂課程','曾研習音樂治療、靜觀及 NLP','與百多間機構合作課程，教授學員數千人'];

const COURSE={
'flute-course.html':{open:['flute-002','學生在課室吹奏長笛'],strip:[['flute-001','譜上的長笛'],['class-051','學生在屯門課室吹奏長笛'],['class-087','學生在屯門課室吹奏長笛'],['class-014','學生吹奏長笛'],['class-048','學生吹奏長笛'],['awards-013','長笛學生考獲證書'],['awards-007','長笛學生考獲證書']],card:WIND,title:'長笛學生'},
'dizi-course.html':{open:['dizi-002','學生在課室學習竹笛'],strip:[['dizi-001','學校笛子班學生合照'],['class-085','學生練習竹笛'],['class-086','學生吹奏竹笛'],['class-050','笛子班學生與張老師合照'],['awards-009','笛子學生考獲證書'],['awards-003','學生參加中國笛比賽後合照']],card:WIND,title:'笛子學生'},
'xiao-course.html':{open:['class-080','學生在屯門課室吹奏洞簫'],strip:[['class-106','學生吹奏洞簫'],['class-104','成人學生吹奏洞簫'],['class-044','學生吹奏洞簫'],['class-063','學生吹奏葫蘆絲']],card:WIND,title:'洞簫學生'},
'tongue-drum-course.html':{open:['drum-course-002','空靈鼓班上課情況'],strip:[['class-001','空靈鼓班學員合照'],['class-013','空靈鼓班學員合照'],['class-015','空靈鼓班學員合照'],['class-008','空靈鼓班學員合照'],['class-031','空靈鼓課堂'],['drum-trial-002','空靈鼓與鼓槌'],['drum-course-004','兩款空靈鼓'],['drum-trial-001','空靈鼓'],['drum-course-001','空靈鼓入門班海報']],card:DRUM,title:'空靈鼓班'}
};
for(const [file,c] of Object.entries(COURSE)){
  patch(file,heroWa(file));
  patch(file,b=>swapArt(b,pic(c.open[0],c.open[1])));
  patch(file,b=>b.replace('<section class="band ">','<section class="band teacher-band">'+card(c.card)+'</section><section class="band ">'));
  patch(file,b=>b.replace('<section class="enquiry-band">',strip(c.title,c.strip,`<p class="video-more"><a class="text-link" href="gallery.html">更多相片</a></p>`)+'<section class="enquiry-band">'));
  patch(file,ctaWa(file));
  patch(file,b=>b.replace('<section class="band "><h2>先讀這幾篇</h2>','<section class="band reading-noimg"><h2>先讀這幾篇</h2>'));
}
patch('courses.html',b=>{for(const [k,n] of [['flute','flute-002'],['dizi','dizi-002'],['xiao','class-080'],['tongue-drum','class-013']])b=b.replace(new RegExp(`(<a href="${k}-course.html">)<figure class="editorial-figure">[\\s\\S]*?</figure>`),`$1${pic(n,COURSE[k+'-course.html'].open[1])}`);return b});
patch('parents.html',heroWa('parents.html'));
patch('parents.html',b=>swapArt(b,pic('class-026','張老師與笛子班小朋友合照')));
patch('parents.html',b=>b.replace('<section class="enquiry-band">',strip('課室裏的小朋友',[['class-028','學校笛子班合照'],['class-060','小朋友與張老師合照'],['class-072','小朋友練習竹笛'],['class-109','學生吹奏竹笛'],['awards-008','學生與張老師拿着證書合照'],['awards-006','學生考獲證書']])+'<section class="enquiry-band">'));
patch('parents.html',ctaWa('parents.html'));
patch('adult-beginner.html',heroWa('adult-beginner.html'));
patch('adult-beginner.html',b=>swapArt(b,pic('class-005','成人學員上空靈鼓課')));
patch('adult-beginner.html',b=>b.replace('<section class="enquiry-band">',strip('成人學員',[['class-031','成人空靈鼓課堂'],['class-011','茶禪音樂課後合照'],['class-004','成人長笛學生與張老師'],['class-104','成人學生吹奏洞簫'],['class-007','機構空靈鼓課程'],['class-006','機構音樂講座']])+'<section class="enquiry-band">'));
patch('adult-beginner.html',ctaWa('adult-beginner.html'));
patch('contact.html',b=>b.replace('<p>長笛及笛子課教學繁忙，不設上門及試堂。</p></div>','<p>長笛及笛子課教學繁忙，不設上門及試堂。</p>'+pic('flute-003','屯門 99 COMMONS 大廈外貌','real-figure place')+'</div>'));
// 舊站未上頁的相片
patch('gallery.html',b=>b.replace('<section class="band gallery-band" id="awards">',`<section class="band gallery-band" id="posters"><h2>演出剪影</h2><p>舊站影片封面用過的演出相片，包括 CCTV「魅力校園」。</p><div class="lb-grid" data-lightbox-group>${[1,2,3,4,5,6,7,8].map(i=>lb('video-posters-00'+i,'張老師演出相片')).join('')}</div></section><section class="band gallery-band" id="awards">`));
patch('videos.html',b=>b.replace('<div class="teach-figures">',`<div class="lb-grid teach-strip" data-lightbox-group>${[['teach-001','長笛吹口位置特寫'],['teach-002','長笛持笛手形'],['teach-003','嘴形：說「pooh」'],['teach-004','長笛左手按鍵'],['teach-005','長笛右手按鍵']].map(([n,a])=>lb(n,a)).join('')}</div><div class="teach-figures">`));
patch('exam-guide.html',b=>b.replace('<details class="ccom-details" id="ccom">',pic('ccom-001','中央音樂學院海外考級曲目封面','real-figure ccom-cover')+'<details class="ccom-details" id="ccom">'));
patch('drum-accessories.html',b=>b.replace('alt="金屬桌面支架" loading="lazy" decoding="async"></figure>',`alt="金屬桌面支架" loading="lazy" decoding="async"></figure>${pic('accessories-002','11 音小鼓顏色','acc-fig acc-tall')}${pic('accessories-003','鼓架及鼓托尺寸','acc-fig acc-tall')}`));
}
