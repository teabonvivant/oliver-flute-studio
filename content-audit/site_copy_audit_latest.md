# 全站中文文案審核（latest）

用途：檢查所有 HTML 可見文案與 meta 描述，找出 AI 模板句、過度對稱轉折、製作備註外漏、非香港常用詞和跨頁重複句。

## 總覽

- HTML頁面：330
- 有標記頁面：70
- 標記句子：111
- 高風險句（嚴重度 >= 4）：1
- 強模板句：0

## 規則分佈

- keyword_stuffing：106
- balanced_ai：3
- mainland_tone：2
- duplicate_copy：1

## 標記最多的頁面

- blog/trinity.html：5句
- blog/2023p2.html：4句
- blog/mother.html：4句
- blog/theory-pulse.html：4句
- blog/beginners.html：3句
- blog/f40a20b5bdc.html：3句
- blog/flute-class01.html：3句
- blog/flute-expression.html：3句
- blog/hulusi.html：3句
- blog/practise1.html：3句
- blog/abrsm.html：2句
- blog/beyondlove.html：2句
- blog/breathe.html：2句
- blog/buyflute.html：2句
- blog/cold-knowledge.html：2句
- blog/jesus-loves-me.html：2句
- blog/jesus-you-shine-upon-my-life.html：2句
- blog/key.html：2句
- blog/pitch.html：2句
- blog/shakuhachi.html：2句

## 高風險句子樣本

### blog/trinity.html｜meta
- 規則：短句內題目詞過密；同一句重複題目詞｜嚴重度 5
- 句子：Trinity共有三個演奏級別的樂器考試，依次序是ATCL(AssociateofTrinityCollegeLondon)，LTCL(Li……張老師舊站文章。

### 404.html,about.html,adult-beginner.html,ai-seo-hub.html...｜duplicate
- 規則：同一句跨 130 頁重複｜嚴重度 3
- 句子：張老師音樂工作室OLIVER MUSIC STUDIO

### blog/beginners.html｜p
- 規則：非香港常用字詞｜嚴重度 3
- 句子：A : 這絕對不是，在哪裡都會遇上熱心教學的好老師，我也曾於音樂中心教授，之後才轉為私人教授。

### blog/flute-class01.html｜p
- 規則：非香港常用字詞｜嚴重度 3
- 句子：2，朝吹嘴裡面的前壁呼氣。

### blog/hulusi.html｜p
- 規則：同一句重複題目詞｜嚴重度 3
- 句子：我們先來介紹一下葫蘆絲的構造：葫蘆絲形狀和構造別具一格，它由一個完整的天然葫蘆、三根竹管與簧片組成，葫蘆作為氣箱，葫蘆低部插進三根粗細不同的竹管，當我們吹氣進入葫蘆時，竹管的簧片就會發出聱音，通過指孔奏出不同的音符。

### blog/trinity.html｜p
- 規則：同一句重複題目詞｜嚴重度 3
- 句子：Trinity共有三個演奏級別的樂器考試，依次序是ATCL(Associate of Trinity College London)，LTCL(Licentiate of Trinity College London)及FTCL(Fellowship of Trinity College London)。

### 404.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### about.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### adult-beginner.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### ai-seo-hub.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### archive.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/2023p2.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：華德中學二年級用的空靈鼓入門譜：一張鼓面音位圖、兩條簡單練習，以及〈玩樂器〉簡譜。

### blog/2023p2.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2023 / 12 / 03

### blog/2023p2.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：華德中學二年級用的空靈鼓入門譜：一張鼓面音位圖、兩條簡單練習，以及〈玩樂器〉簡譜。

### blog/2023p2.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/abrsm.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章

### blog/abrsm.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/beginners.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2020 / 04 / 18

### blog/beginners.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/beyondlove.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2024 / 03 / 24

### blog/beyondlove.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/breathe.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章

### blog/breathe.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/buyflute.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章

### blog/buyflute.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/cold-knowledge.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2020 / 02 / 09

### blog/cold-knowledge.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/f40a20b5bdc.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2020 / 04 / 18

### blog/f40a20b5bdc.html｜p
- 規則：過度對稱轉折｜嚴重度 2
- 句子：我國的民族音樂之所以會給人一種刻板的關於五聲音階的印象，不是因為我們只有五聲音階，而是因為我們在歷史的聚變下，選擇了五聲音階。

### blog/f40a20b5bdc.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/flute-adult.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：成人學長笛時間不固定，或者停學多年想重新開始？

### blog/flute-class01.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2021 / 01 / 16

### blog/flute-class01.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/flute-daily-practice.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：長笛每日練習，可以先把首五分鐘留給聲音，再用十五分鐘左右分配長音、相鄰音和一小句旋律，中間留休息。

### blog/flute-expression.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：這篇講連奏和分奏怎樣比較、漸強怎樣吹成一條線、Vibrato 甚麼時候才加入，每項都有可以即時試的短練習，適合初學至中級學生。

### blog/flute-expression.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：Vibrato 在這裏指聲音中帶着控制的波動，與手指交替兩音的顫音技巧不同。

### blog/flute-expression.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：這裏說的 Vibrato 是聲音本身的波動，手指交替兩音的是另一種技巧。

### blog/flute-first-flute.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：第一支長笛怎樣選？

### blog/hulusi.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2020 / 05 / 07

### blog/hulusi.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/jesus-loves-me.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2023 / 09 / 19

### blog/jesus-loves-me.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/jesus-you-shine-upon-my-life.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2025 / 03 / 16

### blog/jesus-you-shine-upon-my-life.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/key.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2020 / 04 / 18

### blog/key.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/mother.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：這是〈世上只有媽媽好〉的空靈鼓簡譜。

### blog/mother.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2024 / 03 / 17

### blog/mother.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：這是〈世上只有媽媽好〉的空靈鼓簡譜。

### blog/mother.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/parents-before-start.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：孩子第一次上音樂課，不必先背好音名，也不用急着買齊用品。

### blog/pitch.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2020 / 09 / 26

### blog/pitch.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/practise1.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2018 / 06 / 27

### blog/practise1.html｜p
- 規則：過度對稱轉折｜嚴重度 2
- 句子：泛音+口哨音：泛音是為了讓自己學習(或是複習)嘴唇移動的感覺，在長笛上吹高低音並不是靠氣的多少來改變音高，而是嘴型的變化，所以每天都要複習上下嘴唇的移動變化

### blog/practise1.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/shakuhachi.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2020 / 04 / 17

### blog/shakuhachi.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/singtogether.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2024 / 01 / 23

### blog/singtogether.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/theory-expression.html｜p
- 規則：過度對稱轉折｜嚴重度 2
- 句子：這時要找的多半不是新技巧，而是譜上一直寫着、卻沒有被認真讀的那幾個字母和數字。

### blog/theory-pulse.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：這篇講 3/4 和 4/4 怎樣分組、6/8 為甚麼是兩個大拍、切分怎樣練，適合剛開始讀譜的學生、成人和家長。

### blog/theory-pulse.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：以常見的 3/4 和 4/4 為例，每小節分別有三個和四個四分音符拍。

### blog/theory-pulse.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：分組卻不同：3/4 可感覺成 2＋2＋2，6/8 常感覺成 3＋3。

### blog/theory-pulse.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：3/4 即三個四分音符，6/8 即六個八分音符。

### blog/trinity.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章 · 2020 / 04 / 17

### blog/trinity.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：Source: TrinityCollegeLondon

### blog/trinity.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### blog/woodwinds.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室 · 舊站文章

### blog/woodwinds.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### contact.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### courses.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### dizi-course.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### drum-accessories.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### exam-guide.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### faq.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### flute-cards.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：長笛紙牌：張老師音樂工作室籌備中的長笛學習紙牌，包括指法、音名、節奏及樂理卡。

### flute-cards.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### flute-course.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### flute-fingering.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### gallery.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### home-v2.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室 · 私隱與使用說明 · 試聽音色：長笛 VSCO 2 CE（CC0）、笛子及空靈鼓 Freesound（CC0）、洞簫張老師自錄

### index.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### learning-guide.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### long-tone.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### metronome.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### parents.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### practice.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### privacy.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### pujian.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### resources.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### scores.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### studio.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室的網上練習工具：調音器、節拍器、長笛指法表及長音練習，打開瀏覽器即可使用，不需下載或註冊。

### studio.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### tongue-drum-course.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### topic-dizi.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### topic-exam.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### topic-flute.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### topic-listening.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師的聆聽與合奏文章共 3 篇，可由〈怎樣聽一首曲〉和〈第一次聽現場，與在家演奏一首曲〉讀起。

### topic-listening.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### topic-parents.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### topic-practice.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### topic-theory.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### topic-tongue-drum.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### topic-xiao.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### tuner.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### videos.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### works.html｜meta
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：張老師音樂工作室的音樂出品：譜間簡譜打譜軟件、長笛紙牌、長笛演奏動畫及教學樂譜。

### works.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室

### xiao-course.html｜p
- 規則：短句內題目詞過密｜嚴重度 2
- 句子：© 2026 張老師音樂工作室
