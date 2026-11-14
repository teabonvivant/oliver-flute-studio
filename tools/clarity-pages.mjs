// 頁面清晰度與搜尋：課程速覽、課程問答、頁首說明、搜尋標題（content/page-seo.json）、家長評語（content/testimonials.json）
const PLACE_WIND='屯門 99 COMMONS 大廈（建安／青雲輕鐵站旁）';
const FEE='一對一課程按程度和上課時段報價。WhatsApp 9809 6351 說明年齡、程度和可上課時間，張老師會回覆。';
const NO_TRIAL=`在${PLACE_WIND}上課，一對一，每節 45 或 60 分鐘。教學繁忙，不設上門及試堂。`;
const COURSE={
'flute-course.html':{quick:'一對一長笛課｜9 歲或以上、成人都可以學｜屯門上課｜可準備 ABRSM、Trinity 考試',faq:[
['幾歲可以開始學長笛？','9 歲或以上。長笛較長，手臂未夠長的小朋友，可以先由笛子入門，之後再轉長笛。'],
['成人零基礎，可以學長笛嗎？','可以。課程由姿勢、吹口和氣流開始，聲音穩定了才加指法和曲目。以前學過、想重拾的成人，會先聽聽現時的聲音和讀譜，再定起點。'],
['長笛課在哪裏上？有沒有試堂？',NO_TRIAL],
['長笛課學費多少？',FEE],
['可以準備考試嗎？','可以準備英國皇家音樂學院（ABRSM）及聖三一音樂學院（Trinity）考試，張老師每年都安排學生報考，也會推薦合適的公開比賽。']]},
'dizi-course.html':{quick:'一對一笛子課｜8 歲或以上｜屯門上課｜可準備中國民族管弦樂學會考級',faq:[
['幾歲可以學笛子？','8 歲或以上。笛子較短較輕，手臂未夠長學長笛的小朋友，也可以先由笛子開始。'],
['笛膜怎樣貼，課堂會教嗎？','會。課堂內容包括笛膜的使用方法、笛子簡單調音及挖孔方法，回家自己貼也有把握。'],
['笛子課在哪裏上？有沒有試堂？',NO_TRIAL],
['笛子課學費多少？',FEE],
['可以考笛子級嗎？','可以。張老師每年夏季安排中央音樂學院／中國民族管弦樂學會考級基準試，也會推薦學生參加公開比賽。']]},
'xiao-course.html':{quick:'一對一洞簫課｜8 歲或以上、成人都可以學｜屯門上課｜與笛子同屬中國吹管課程',faq:[
['幾歲可以學洞簫？','8 歲或以上，成人亦可。洞簫適合喜歡它音色、願意細聽慢練的學生。'],
['學過笛子或長笛，學洞簫會快一點嗎？','讀譜和聽覺經驗用得上；吹口和持握就要重新調整，先找一個吹得響、又不費力的位置。'],
['洞簫課在哪裏上？有沒有試堂？',NO_TRIAL],
['洞簫課學費多少？',FEE],
['洞簫可以夜晚在家練嗎？','洞簫聲音柔和，仍可能傳到鄰居。先了解家中環境和合適時段；較晚的時候，可以改做默讀、節奏分析或聆聽。']]},
'tongue-drum-course.html':{quick:'空靈鼓入門初班 8 課｜佐敦上課｜6 至 12 人一班｜零基礎可學，課堂借鼓｜另有 75 分鐘體驗課',faq:[
['零音樂基礎，可以學空靈鼓嗎？','可以。入門初班八課由淺入深，由少量音和清楚短句開始；未肯定適合自己，可以先上一堂 75 分鐘體驗課。'],
['一定要先買鼓嗎？','不用。入門初班可借用課室空靈鼓，體驗課也現場免費借用。想在家練習，張老師建議魯儒鈦金鋼 15 音空靈鼓（D 調），經學會訂購有學生價。'],
['空靈鼓班在哪裏上？','入門初班在佐敦彌敦道 229 號周生生大廈 12/F（佐敦站 C1 出口旁邊）；體驗課可預約屯門或佐敦課室。'],
['入門初班學費多少？','共八課，學費 HK$1,880，優惠期內報讀有折扣。最新班期、優惠和名額見本頁班期表，以學會報名頁為準。'],
['空靈鼓與手碟相同嗎？','不相同。空靈鼓是有切割音舌的鋼舌鼓，手碟以塑形音區發聲，兩者觸感和演奏方式都不一樣，選購時要看結構、實際音高和用途。']]},
};
const HERO={
'studio.html':['練習室','四件免費網上工具：調音器、節拍器、長笛指法表、長音練習。上課學到的東西，回家要有地方練；不用下載，也不用註冊，打開手機或電腦就可以用。'],
'works.html':['出品','張老師自己做的教材和軟件：譜間打譜軟件、長笛紙牌、教學樂譜。教了二十年，有些工具是在課堂上逼出來的：學生要譜、要練、要記指法，於是自己動手做。'],
};
export async function applyClarity({pages,esc,read}){
  const find=f=>{const p=pages.find(x=>x.file===f);if(!p)throw Error('clarity: missing page '+f);return p};
  const faqHtml=items=>`<section class="band course-faq"><h2>課程常見問題</h2><div class="faq-list">${items.map(([q,a])=>`<details><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}</div></section>`;
  for(const [file,c] of Object.entries(COURSE)){
    const p=find(file);
    const i=p.body.indexOf('</h1>');if(i<0)throw Error('clarity: h1 '+file);
    p.body=p.body.slice(0,i+5)+`<p class="course-quick">${c.quick.split('｜').map(x=>`<span>${esc(x)}</span>`).join('')}</p>`+p.body.slice(i+5);
    if(!p.body.includes('<section class="enquiry-band">'))throw Error('clarity: cta '+file);
    p.body=p.body.replace('<section class="enquiry-band">',faqHtml(c.faq)+'<section class="enquiry-band">');
  }
  for(const [file,[h1,desc]] of Object.entries(HERO)){
    const p=find(file);const b=p.body.replace(/<h1>[^<]*<\/h1><p>[^<]*<\/p>/,`<h1>${esc(h1)}</h1><p>${esc(desc)}</p>`);
    if(b===p.body)throw Error('clarity: hero '+file);p.body=b;
  }
  const seo=JSON.parse(await read('content/page-seo.json'));
  for(const [file,o] of Object.entries(seo)){if(file.startsWith('_'))continue;const p=find(file);if(o.title)p.seoTitle=o.title;if(o.description)p.description=o.description}
  const notes=JSON.parse(await read('content/testimonials.json')).items.filter(t=>t.approved&&t.quote);
  if(notes.length){
    for(const file of ['courses.html','parents.html',...Object.keys(COURSE)]){
      const p=find(file);const pick=notes.filter(t=>!t.page||t.page===file||file==='courses.html'||file==='parents.html').slice(0,3);
      if(!pick.length)continue;
      const html=`<section class="band voices"><h2>家長和學員怎樣說</h2><div class="voice-list">${pick.map(t=>`<figure class="voice"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption><b>${esc(t.name)}</b><span>${esc([t.relation,t.course,t.since].filter(Boolean).join('・'))}</span></figcaption></figure>`).join('')}</div></section>`;
      p.body=p.body.replace('<section class="enquiry-band">',html+'<section class="enquiry-band">');
    }
  }
}
