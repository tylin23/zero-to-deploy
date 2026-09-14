// 第 3 關給學生下載的範本：一頁 link-in-bio 風格的「電子名片」，主角是臺北市吉祥物熊讚。
//
// 為什麼是名片而不是活動公告：公告過期就沒用了，學生容易把 repo 砍掉；
// 名片頁可以一直留著改成自己的（或科室的），這個 repo 就變成他的作品。
//
// 三個硬性條件（正好對應這一關教的「5 個雷」）：
//   1. 單一檔案、自己就能跑：頭像和所有 icon 都是 inline SVG，字型用系統內建的，
//      沒有任何外部檔案或 CDN —— 所以離線打得開、機關內網擋外連也打得開，
//      也不會有「圖片路徑只有我電腦有」的問題。
//      ⚠️ 這條不要為了好看而放棄。AI 幫你生的版面常會掛上 Tailwind CDN、
//      Font Awesome、Google Fonts；那些一旦連不到，整頁會退化成沒有樣式的純文字連結。
//   2. 檔名 index.html、全小寫。
//   3. RWD：手機一欄、桌機置中窄欄。
//
// 頭像是照著熊讚的特徵（黑熊、白眼圈、白口鼻、藍綠色鼻子、白眉、開口笑）
// 自己畫的「簡化示意圖」，不是官方圖檔。要換成官方圖請看檔案裡的註解。
//
// ⚠️ 改版時注意：tests/e2e.mjs 會把 <svg class="avatar"> 換成 <img class="avatar">，
// 驗證註解教的步驟跟實際標籤對得上、而且 object-fit:cover 還在。
export const STARTER_HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<!-- 不要加 user-scalable=no：那會禁掉雙指放大，看不清楚的人就沒辦法了 -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>熊讚 Bravo｜臺北市吉祥物電子名片</title>

<style>
  /* ===== 想換顏色，只要改這三行 ===== */
  :root{
    --brand:#0f7c8a;
    --brand-2:#1aa6b7;
    --head-dark:#0b1222;   /* 頭圖漸層最深的那端 */

    --ink:#1f2733; --muted:#666f7b; --line:#e6e8ec; --card:#fff; --bg:#f8f9fa;
  }

  *{box-sizing:border-box}
  html{color-scheme:light}
  body{
    margin:0; background:var(--bg); color:var(--ink); line-height:1.6;
    font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,-apple-system,sans-serif;
    position:relative; overflow-x:hidden; min-height:100vh;
    -webkit-font-smoothing:antialiased;
  }

  /* 頭圖：滿版漸層，底部用 clip-path 切出一道弧線 */
  .cover{
    position:absolute; top:0; left:0; width:100%; height:210px; z-index:0;
    background:linear-gradient(135deg,var(--head-dark) 0%,var(--brand) 55%,var(--brand-2) 100%);
    clip-path:ellipse(150% 100% at 50% 0%);
  }

  /* 頭圖上的分享鈕 */
  .topbar{
    position:relative; z-index:1; max-width:500px; margin:0 auto;
    padding:22px 24px 0; display:flex;
  }
  .iconbtn{
    width:44px; height:44px; border-radius:50%; cursor:pointer;
    background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.28);
    color:#fff; display:grid; place-items:center;
    -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);
    transition:background .15s;
  }
  .iconbtn:hover,.iconbtn:focus-visible{background:rgba(255,255,255,.3)}
  .iconbtn svg{width:19px; height:19px}

  /* padding-top 要讓頭像「跨在」頭圖的弧線上：
     頭圖高 210，頭像從 132 開始、118 高，所以下緣 250 —— 上面 2/3 在漸層裡、
     下面 1/3 落在淺色底上，名字才不會壓在交界線上。改頭圖高度時這裡要一起調。 */
  .wrap{
    position:relative; z-index:1;
    max-width:500px; margin:0 auto; padding:66px 24px 40px;
  }

  /* ===== 上半：頭像與自我介紹 ===== */
  .head{text-align:center}
  .avatar{
    width:118px; height:118px; border-radius:50%; display:block; margin:0 auto 14px;
    border:4px solid #fff; background:#fff; box-shadow:0 10px 24px rgba(16,24,40,.18);
    /* 換成 <img> 時要有這行：照片不是正方形也會自動裁成圓的，不會被拉扁 */
    object-fit:cover;
  }
  .name{
    margin:0 0 2px; font-size:24px; font-weight:800; letter-spacing:.5px;
    display:flex; align-items:center; justify-content:center; gap:7px;
  }
  .name svg{width:19px; height:19px; flex:0 0 auto; color:var(--brand)}
  .role{margin:0 0 2px; color:var(--muted); font-size:15px; font-weight:500}
  .bio{margin:0 0 20px; font-size:14.5px}

  /* 聯絡方式：深色圓鈕 */
  .icons{display:flex; justify-content:center; gap:11px; flex-wrap:wrap; margin-bottom:34px}
  .icons a{
    width:44px; height:44px; border-radius:50%; background:var(--ink); color:#fff;
    display:grid; place-items:center; text-decoration:none;
    box-shadow:0 4px 10px rgba(16,24,40,.16);
    transition:background .15s, transform .15s;
  }
  .icons a:hover,.icons a:focus-visible{background:var(--brand); transform:translateY(-3px)}
  .icons svg{width:19px; height:19px}

  /* ===== 下半：藥丸狀連結按鈕 ===== */
  .label{
    margin:26px 0 12px; text-align:center; font-size:12px; font-weight:800;
    letter-spacing:2px; color:var(--muted);
  }
  .links{display:grid; gap:14px}
  .links a{
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    padding:16px 26px; border-radius:999px; text-decoration:none;
    background:var(--card); border:1px solid var(--line); color:var(--ink);
    font-weight:700; font-size:15.5px;
    box-shadow:0 2px 6px rgba(16,24,40,.05);
    transition:transform .2s, box-shadow .2s, border-color .2s;
  }
  .links a:hover,.links a:focus-visible{
    transform:translateY(-3px); border-color:#d3d7de; box-shadow:0 8px 20px rgba(16,24,40,.1);
  }
  /* 最重要的那一顆做成深色漸層，一眼就看得出是主要動作 */
  .links a.primary{
    background:linear-gradient(90deg,#2b3440,#0d1117); color:#fff; border-color:transparent;
    box-shadow:0 8px 20px rgba(0,0,0,.16);
  }
  .links a.primary:hover,.links a.primary:focus-visible{box-shadow:0 10px 26px rgba(0,0,0,.24)}
  .links .lead{display:flex; align-items:center; gap:13px; min-width:0}
  .links .lead svg{width:20px; height:20px; flex:0 0 auto; color:var(--muted)}
  .links a.primary .lead svg{color:#fff; opacity:.9}
  .links .txt{min-width:0}
  .links .sub{display:block; font-weight:400; font-size:12.5px; color:var(--muted); margin-top:-2px}
  .links a.primary .sub{color:rgba(255,255,255,.72)}
  .links .go{flex:0 0 auto; color:#b6bcc6}
  .links a.primary .go{color:rgba(255,255,255,.6)}
  .links .go svg{width:15px; height:15px}

  /* ===== 兩格大圖按鈕 ===== */
  .grid2{display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:16px}
  .tile{
    position:relative; height:172px; border-radius:22px; overflow:hidden;
    display:block; text-decoration:none;
    box-shadow:0 4px 12px rgba(16,24,40,.1);
    transition:transform .2s, box-shadow .2s;
    /* 要換成真的照片：把下一行換成
         background:url('cover-1.jpg') center/cover no-repeat;
       記得照片要跟 index.html 一起上傳，不然別人看到的是破圖。 */
    background:linear-gradient(140deg,var(--brand),var(--head-dark));
  }
  .tile:nth-child(2){background:linear-gradient(140deg,var(--brand-2),#2b3440)}
  .tile:hover,.tile:focus-visible{transform:translateY(-3px); box-shadow:0 10px 24px rgba(16,24,40,.18)}
  .tile .mark{
    position:absolute; top:22px; left:0; right:0; display:grid; place-items:center;
    color:rgba(255,255,255,.5);
  }
  .tile .mark svg{width:44px; height:44px}
  .tile .cap{
    position:absolute; inset:auto 0 0 0; padding:14px 12px;
    background:linear-gradient(to top,rgba(0,0,0,.72),transparent);
    color:#fff; font-weight:700; font-size:15px; text-align:center;
  }

  .foot{margin-top:40px; text-align:center; color:var(--muted); font-size:12px}
  .foot strong{color:var(--ink)}

  /* 分享成功的小提示 */
  .toast{
    position:fixed; left:50%; bottom:32px; transform:translateX(-50%);
    background:var(--ink); color:#fff; padding:12px 22px; border-radius:999px;
    font-size:14px; font-weight:700; box-shadow:0 10px 24px rgba(0,0,0,.25);
    z-index:9; transition:opacity .3s;
  }

  /* 很窄的手機再縮一點 */
  @media (max-width:360px){
    .avatar{width:100px; height:100px}
    .name{font-size:21px}
    .links a{padding:14px 20px; font-size:14.5px}
    .grid2{gap:10px}
    .tile{height:148px}
  }

  /* 尊重「減少動態效果」的系統設定 */
  @media (prefers-reduced-motion:reduce){ *{transition:none !important} }
</style>
</head>

<body>

<div class="cover"></div>

<div class="topbar">
  <button class="iconbtn" type="button" onclick="shareProfile()" aria-label="分享這張名片">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>
  </button>
</div>

<main class="wrap">

  <div class="head">

    <!-- ===== 頭像 =====
         這是照著熊讚的特徵自己畫的「簡化示意圖」，不是官方圖檔。

         ▼ 要換成自己的照片（或科室的 logo），三個步驟：

         1. 檔名先改乾淨：「頭貼 1.JPG」→「avatar.jpg」
            英文小寫、不要空白、不要中文。順便把圖縮小到 400x400 左右，
            手機拍的原圖動輒 3~5 MB，網頁會很慢。

         2. 把 avatar.jpg 跟 index.html「一起」上傳到 repo
            （GitHub 上 Add file → Upload files，可以一次拖兩個檔進去）。
            網頁不會把圖存在自己裡面，它只是記著「去哪裡拿那張圖」，
            所以圖片沒上傳 = 別人打開就是破圖。

         3. 把下面整個 <svg>…</svg> 刪掉，換成這一行：
                <img class="avatar" src="avatar.jpg" alt="這裡寫圖片內容，例如：王小明的大頭照">

         ▼ 三個常見錯誤（在你自己電腦上都看不出來，一上線才壞）：

         X  src="C:\\Users\\你的帳號\\Pictures\\avatar.jpg"
            那是你電腦裡的路徑，只有你找得到。要用相對路徑（同資料夾就直接寫檔名）。
         X  src="Avatar.JPG" 但檔案其實叫 avatar.jpg
            Windows 不分大小寫，伺服器分 —— 檔名怎麼拼就要一字不差地怎麼寫。
         X  直接貼別人網站的圖片網址
            對方一改檔名你就破圖，而且有版權問題。存下來、確認可以用，再上傳到自己的 repo。

         ▼ 提醒：這頁全世界都看得到。不要放有市民臉孔的照片、含姓名電話的截圖，
            用別人的圖也要先確認授權。 -->
    <svg class="avatar" viewBox="0 0 106 106" role="img" aria-label="台灣黑熊示意圖">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#bfe4f7"/><stop offset="1" stop-color="#e4f3fc"/>
        </linearGradient>
        <clipPath id="round"><circle cx="53" cy="53" r="53"/></clipPath>
      </defs>
      <circle cx="53" cy="53" r="53" fill="url(#sky)"/>
      <g clip-path="url(#round)">
        <path d="M0 93q53-9 106 0v13H0z" fill="#bcdd77"/>
        <circle cx="23" cy="24" r="13" fill="#1a1a1a"/>
        <circle cx="83" cy="24" r="13" fill="#1a1a1a"/>
        <circle cx="53" cy="50" r="34" fill="#1a1a1a"/>
        <path d="M35 32q5.5-4.5 11 0" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M60 32q5.5-4.5 11 0" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <ellipse cx="40" cy="43" rx="8" ry="9" fill="#fff"/>
        <ellipse cx="66" cy="43" rx="8" ry="9" fill="#fff"/>
        <circle cx="40" cy="44" r="4.3" fill="#1a1a1a"/>
        <circle cx="66" cy="44" r="4.3" fill="#1a1a1a"/>
        <ellipse cx="53" cy="63" rx="20.5" ry="15" fill="#fff"/>
        <ellipse cx="53" cy="57" rx="6.8" ry="4.4" fill="#1a94a8"/>
        <path d="M41 65a12 11 0 0 0 24 0z" fill="#1a1a1a"/>
      </g>
    </svg>

    <!-- ===== 改這裡：名字、頭銜、簡介 ===== -->
    <h1 class="name">
      熊讚 Bravo
      <svg viewBox="0 0 24 24" fill="currentColor" aria-label="已認證"><path d="M12 2 9.6 4.4 6.3 4l-.5 3.3L2.8 8.9 4.4 12l-1.6 3.1 3 1.6.5 3.3 3.3-.4L12 22l2.4-2.4 3.3.4.5-3.3 3-1.6L19.6 12l1.6-3.1-3-1.6-.5-3.3-3.3.4z"/><path d="m10.7 15.3-3-3 1.4-1.4 1.6 1.6 4.2-4.2 1.4 1.4z" fill="#fff"/></svg>
    </h1>
    <p class="role">臺北市吉祥物 ・ 城市代言人</p>
    <p class="bio">我是台灣黑熊，也是臺北的吉祥物！<br>帶大家一起認識臺北的活動、景點和市政服務。</p>

    <!-- ===== 改這裡：常見聯絡方式 icon 區 ===== -->
    <nav class="icons" aria-label="聯絡方式">
      <a href="https://www.facebook.com/bravotaipei/" target="_blank" rel="noopener" aria-label="Facebook 粉絲團">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z"/></svg>
      </a>
      <a href="https://www.gov.taipei" target="_blank" rel="noopener" aria-label="官方網站">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&amp;query=臺北市信義區市府路1號" target="_blank" rel="noopener" aria-label="看地圖">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </a>
      <a href="tel:+886227208889" aria-label="打電話">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
      </a>
      <a href="mailto:hello@example.gov.tw" aria-label="寄信">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
      </a>
    </nav>
  </div>

  <!-- ===== 改這裡：熊讚的社群與連結 =====
       每一顆按鈕就是一個 <a>。要多一顆就整段複製貼上，改 href 和文字；
       不要的就整段刪掉。第一顆加了 class="primary" 會變成深色，
       想把重點換成別顆，就把 primary 搬過去。 -->
  <div class="label">社群與連結</div>
  <div class="links">
    <a class="primary" href="https://www.facebook.com/bravotaipei/" target="_blank" rel="noopener">
      <span class="lead">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z"/></svg>
        <span class="txt">熊讚 Bravo Taipei<span class="sub">Facebook 粉絲團</span></span>
      </span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></span>
    </a>

    <a href="https://www.gov.taipei" target="_blank" rel="noopener">
      <span class="lead">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="txt">臺北市政府全球資訊網<span class="sub">施政資訊與各局處入口</span></span>
      </span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></span>
    </a>

    <a href="#">
      <span class="lead">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        <span class="txt">最新活動行程<span class="sub">把 href 換成你要連的網址</span></span>
      </span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></span>
    </a>
  </div>

  <!-- ===== 改這裡：聯絡資訊 ===== -->
  <div class="label">聯絡資訊</div>
  <div class="links">
    <a href="tel:1999">
      <span class="lead">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 21 6v12L3 14z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
        <span class="txt">1999 市民熱線<span class="sub">陳情、詢問、服務申請</span></span>
      </span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></span>
    </a>

    <a href="https://www.google.com/maps/search/?api=1&amp;query=臺北市信義區市府路1號" target="_blank" rel="noopener">
      <span class="lead">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <span class="txt">臺北市信義區市府路1號<span class="sub">110204　點我開地圖</span></span>
      </span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></span>
    </a>
  </div>

  <!-- ===== 改這裡：兩格大圖按鈕 =====
       現在是用漸層色當底。要換成真的照片，看 CSS 裡 .tile 那段的註解。 -->
  <div class="grid2">
    <a class="tile" href="#">
      <span class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></span>
      <span class="cap">認識熊讚</span>
    </a>
    <a class="tile" href="#">
      <span class="mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="m3 15 5-5 4 4 3-3 6 6"/><circle cx="9" cy="10" r="1.4"/></svg></span>
      <span class="cap">活動花絮</span>
    </a>
  </div>

  <footer class="foot">
    <!-- 這頁是完全公開的，任何人拿到網址都打得開：只放可對外公開的資訊，不要放個資。 -->
    <strong>這是 Zero to Deploy 的教學練習範本，不是官方網站。</strong><br>
    把上面的內容改成你自己或科室的，這頁就是你的電子名片了。
  </footer>

</main>

<script>
  // 分享鈕：手機會叫出系統的分享選單，桌機則把網址複製起來。
  // 兩個都失敗（例如用 file:// 直接開）就退回「請手動複製網址列」。
  function shareProfile(){
    var url = location.href;
    if (navigator.share) {
      navigator.share({ title: document.title, url: url }).catch(function(){});
      return;
    }
    if (navigator.clipboard && location.protocol !== "file:") {
      navigator.clipboard.writeText(url).then(function(){
        toast("網址已複製，可以貼給別人了");
      }).catch(function(){
        toast("請直接複製上方網址列的網址");
      });
      return;
    }
    toast("請直接複製上方網址列的網址");
  }

  function toast(msg){
    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function(){
      el.style.opacity = "0";
      setTimeout(function(){ el.remove(); }, 300);
    }, 2200);
  }
</script>

</body>
</html>`;
