// 第 2 關給學生下載的範本：一頁 Portaly 風格的「電子名片」。
//
// 為什麼是名片而不是活動公告：公告過期就沒用了，學生容易把 repo 砍掉；
// 名片頁可以一直留著改成自己的（或科室的），這個 repo 就變成他的作品。
//
// 三個硬性條件（正好對應這一關教的「5 個雷」）：
//   1. 單一檔案、自己就能跑：頭像和所有 icon 都是 inline SVG，沒有外部檔案，
//      所以不會有「圖片路徑只有我電腦有」的問題。
//   2. 檔名 index.html、全小寫。
//   3. RWD：手機一欄、桌機置中的窄卡片（Portaly 就是這個版型）。
export const STARTER_HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>臺北市政府｜電子名片</title>

<style>
  /* ===== 想換顏色，只要改這兩行 ===== */
  :root{
    --brand:#0f6b4f;
    --brand-2:#17a67c;

    --ink:#1f2733; --muted:#6b7480; --line:#e6e8ec; --card:#fff; --bg:#f3f4f6;
  }

  *{box-sizing:border-box}
  html{color-scheme:light}
  body{
    margin:0; background:var(--bg); color:var(--ink); line-height:1.6;
    font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,-apple-system,sans-serif;
    display:flex; justify-content:center; padding:24px 16px 48px;
    -webkit-font-smoothing:antialiased;
  }

  /* 名片本體：手機滿版、桌機置中窄欄 */
  .card{
    width:100%; max-width:440px; background:var(--card);
    border-radius:24px; overflow:hidden; box-shadow:0 12px 32px rgba(16,24,40,.09);
  }
  .cover{height:116px; background:linear-gradient(135deg,var(--brand),var(--brand-2))}

  .head{margin-top:-54px; padding:0 20px 4px; text-align:center}
  .avatar{
    width:106px; height:106px; border-radius:50%; display:block; margin:0 auto 12px;
    border:4px solid #fff; background:#fff; box-shadow:0 6px 16px rgba(16,24,40,.14);
  }
  .name{
    margin:0 0 2px; font-size:22px; font-weight:800;
    display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .name svg{width:18px; height:18px; flex:0 0 auto; color:var(--brand)}
  .role{margin:0 0 10px; color:var(--muted); font-size:14px}
  .bio{margin:0 0 16px; font-size:14.5px}

  /* 聯絡方式 icon 區 */
  .icons{display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-bottom:4px}
  .icons a{
    width:44px; height:44px; border-radius:50%; border:1px solid var(--line);
    display:grid; place-items:center; color:var(--ink); text-decoration:none;
    transition:background .15s,color .15s,border-color .15s;
  }
  .icons a:hover,.icons a:focus-visible{background:var(--brand); border-color:var(--brand); color:#fff}
  .icons svg{width:20px; height:20px}

  /* 分段標題 */
  .section{
    margin:22px 20px 10px; padding:9px 14px; border-radius:12px;
    background:var(--ink); color:#fff; font-size:13px; font-weight:700;
  }

  /* 連結按鈕區 */
  .links{padding:0 20px; display:grid; gap:10px}
  .links a{
    display:flex; align-items:center; gap:12px; padding:13px 15px;
    border:1px solid var(--line); border-radius:14px; background:#fff;
    color:var(--ink); text-decoration:none; font-weight:700; font-size:15px;
    transition:border-color .15s, box-shadow .15s, transform .15s;
  }
  .links a:hover,.links a:focus-visible{
    border-color:var(--brand); box-shadow:0 6px 16px rgba(16,24,40,.08); transform:translateY(-1px);
  }
  .links .ico{
    width:38px; height:38px; flex:0 0 auto; border-radius:11px;
    background:color-mix(in srgb, var(--brand) 10%, #fff);
    display:grid; place-items:center; color:var(--brand);
  }
  .links .ico svg{width:19px; height:19px}
  .links .txt{flex:1; min-width:0}
  .links .sub{display:block; font-weight:400; font-size:12.5px; color:var(--muted); margin-top:1px}
  .links .go{flex:0 0 auto; color:var(--muted)}
  .links .go svg{width:18px; height:18px}

  .foot{padding:20px; text-align:center; color:var(--muted); font-size:12px}
  .foot strong{color:var(--ink)}

  /* 很窄的手機再縮一點 */
  @media (max-width:360px){
    .avatar{width:92px; height:92px}
    .name{font-size:20px}
    .links a{padding:12px 13px; font-size:14.5px}
  }

  /* 尊重「減少動態效果」的系統設定 */
  @media (prefers-reduced-motion:reduce){ *{transition:none !important} }
</style>
</head>

<body>
<main class="card">

  <div class="cover"></div>

  <div class="head">

    <!-- ===== 頭像 =====
         現在放的是「市政大樓」示意圖。要換成真正的標誌或你的照片：
         把下面整個 <svg>…</svg> 換成這一行，並且把 avatar.jpg
         跟 index.html 放在同一個資料夾、一起上傳：
             <img class="avatar" src="avatar.jpg" alt="頭像">
         注意：不要寫 C:\\Users\\... 這種路徑，那只有你的電腦找得到。 -->
    <svg class="avatar" viewBox="0 0 106 106" role="img" aria-label="市政大樓示意圖">
      <defs>
        <linearGradient id="av" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0f6b4f"/><stop offset="1" stop-color="#17a67c"/>
        </linearGradient>
      </defs>
      <circle cx="53" cy="53" r="53" fill="url(#av)"/>
      <g fill="#fff">
        <rect x="49.5" y="17" width="7" height="11" rx="1.5"/>
        <path d="M53 27 84 46H22z"/>
        <rect x="28" y="50" width="7" height="24" rx="1"/>
        <rect x="42" y="50" width="7" height="24" rx="1"/>
        <rect x="57" y="50" width="7" height="24" rx="1"/>
        <rect x="71" y="50" width="7" height="24" rx="1"/>
        <rect x="22" y="77" width="62" height="7" rx="2"/>
      </g>
    </svg>

    <!-- ===== 改這裡：名字、頭銜、簡介 ===== -->
    <h1 class="name">
      臺北市政府
      <svg viewBox="0 0 24 24" fill="currentColor" aria-label="已認證"><path d="M12 2 9.6 4.4 6.3 4l-.5 3.3L2.8 8.9 4.4 12l-1.6 3.1 3 1.6.5 3.3 3.3-.4L12 22l2.4-2.4 3.3.4.5-3.3 3-1.6L19.6 12l1.6-3.1-3-1.6-.5-3.3-3.3.4z"/><path d="m10.7 15.3-3-3 1.4-1.4 1.6 1.6 4.2-4.2 1.4 1.4z" fill="#fff"/></svg>
    </h1>
    <p class="role">市民服務 ・ 施政資訊 ・ 活動公告</p>
    <p class="bio">歡迎市民多加利用各項線上服務。洽公前請先確認服務時間與所需文件。</p>

    <!-- ===== 改這裡：常見聯絡方式 icon 區 ===== -->
    <nav class="icons" aria-label="聯絡方式">
      <a href="tel:+886227208889" aria-label="打電話">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>
      </a>
      <a href="https://www.google.com/maps/search/?api=1&amp;query=臺北市信義區市府路1號" target="_blank" rel="noopener" aria-label="看地圖">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </a>
      <a href="https://www.gov.taipei" target="_blank" rel="noopener" aria-label="官方網站">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </a>
      <a href="mailto:someone@example.gov.tw" aria-label="寄電子郵件">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
      </a>
    </nav>
  </div>

  <!-- ===== 改這裡：聯絡資訊 ===== -->
  <div class="section">📇 聯絡資訊</div>
  <div class="links">
    <a href="tel:+886227208889">
      <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg></span>
      <span class="txt">02-2720-8889<span class="sub">總機服務電話</span></span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
    </a>

    <a href="tel:1999">
      <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 21 6v12L3 14z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg></span>
      <span class="txt">1999 市民熱線<span class="sub">陳情、詢問、服務申請</span></span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
    </a>

    <a href="https://www.google.com/maps/search/?api=1&amp;query=臺北市信義區市府路1號" target="_blank" rel="noopener">
      <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
      <span class="txt">臺北市信義區市府路1號<span class="sub">110204　點我開地圖</span></span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
    </a>
  </div>

  <!-- ===== 改這裡：想放幾顆按鈕就複製幾次 ===== -->
  <div class="section">🔗 常用連結</div>
  <div class="links">
    <a href="https://www.gov.taipei" target="_blank" rel="noopener">
      <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></span>
      <span class="txt">臺北市政府全球資訊網<span class="sub">施政資訊與各局處入口</span></span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
    </a>

    <a href="#">
      <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg></span>
      <span class="txt">線上申辦服務<span class="sub">把 href 換成你要連的網址</span></span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
    </a>

    <a href="#">
      <span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></span>
      <span class="txt">最新活動公告<span class="sub">把 href 換成你要連的網址</span></span>
      <span class="go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>
    </a>
  </div>

  <footer class="foot">
    <!-- 這頁是完全公開的，任何人拿到網址都打得開：只放可對外公開的資訊，不要放個資。 -->
    <strong>這是 Zero to Deploy 的教學練習範本，不是官方網站。</strong><br>
    把上面的內容改成你自己或科室的，這頁就是你的電子名片了。
  </footer>

</main>
</body>
</html>`;
