// 第 4 關給學生下載的範本：一頁「陳情案件分類儀表板」。
//
// 設計重點：
//  1. 單一 dashboard.html，零外部檔案（沒有圖、沒有 CDN、圖表用 CSS 長條做），
//     學生直接放進第 2 關那個 repo 就會動。
//  2. 真的去打 data.taipei 的 API；萬一被瀏覽器的 CORS 擋住（或平台維護、
//     沒網路），就退回內建的範例資料並在畫面上說清楚原因 —— 不會開天窗，
//     而且「為什麼會被擋」本身就是一個值得講的概念。
//  3. 統計是「對抓回來的這幾筆」做的，畫面上會標明，不會讓人誤以為是全量統計。
export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>陳情案件分類儀表板</title>
<style>
  :root{
    --brand:#26418f; --brand-2:#3b7dd8;
    --ink:#1f2733; --muted:#6b7480; --line:#e6e8ec; --card:#fff; --bg:#f3f4f6;
    --warn-bg:#fff7e6; --warn-line:#e0a800; --ok:#0c6b41;
  }
  *{box-sizing:border-box}
  html{color-scheme:light}
  body{
    margin:0; background:var(--bg); color:var(--ink); line-height:1.6;
    font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
    padding:24px 16px 48px; -webkit-font-smoothing:antialiased;
  }
  .wrap{max-width:860px; margin:0 auto}
  h1{font-size:clamp(20px,4vw,28px); margin:0 0 4px}
  .src{color:var(--muted); font-size:13px; margin:0 0 18px}
  .src a{color:var(--brand)}

  .card{background:var(--card); border:1px solid var(--line); border-radius:16px;
        padding:18px; margin-bottom:14px}
  h2{font-size:16px; margin:0 0 12px}

  /* 狀態列：告訴使用者現在看到的是真資料還是備援資料 */
  .status{border-radius:12px; padding:12px 14px; font-size:13.5px; margin-bottom:14px;
          border:1px solid var(--line); background:#fff}
  .status.live{border-color:#9ad5b8; background:#eafaf2; color:var(--ok)}
  .status.fallback{border-color:var(--warn-line); background:var(--warn-bg)}
  .status b{display:block; margin-bottom:2px}

  /* KPI */
  .kpis{display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); margin-bottom:14px}
  .kpi{background:var(--card); border:1px solid var(--line); border-radius:16px; padding:16px}
  .kpi .n{font-size:28px; font-weight:800; color:var(--brand)}
  .kpi .t{font-size:13px; color:var(--muted)}

  /* 長條圖：純 CSS，不用任何圖表套件 */
  .bar{display:grid; grid-template-columns:minmax(84px,auto) 1fr auto; gap:10px;
       align-items:center; margin-bottom:8px; font-size:14px}
  /* span 預設是 inline，width/height 會被忽略 —— 一定要 block 長條才畫得出來 */
  .bar .track{display:block; width:100%}
  .bar .fill{display:block; height:14px; border-radius:999px;
             background:linear-gradient(90deg,var(--brand),var(--brand-2)); min-width:3px}
  .bar .v{font-variant-numeric:tabular-nums; color:var(--muted); font-size:13px}

  /* 表格：窄螢幕可以橫向捲，頁面本身不會歪 */
  .scroll{overflow-x:auto}
  table{border-collapse:collapse; width:100%; font-size:13.5px; min-width:560px}
  th,td{text-align:left; padding:9px 10px; border-bottom:1px solid var(--line); white-space:nowrap}
  th{background:#f7f9fc; font-size:12.5px; color:var(--muted)}

  button{
    font:inherit; font-weight:700; cursor:pointer; color:#fff; background:var(--brand);
    border:0; border-radius:12px; padding:10px 16px;
  }
  button:disabled{opacity:.55; cursor:default}
  .foot{color:var(--muted); font-size:12px; text-align:center; margin-top:18px}
</style>
</head>
<body>
<div class="wrap">

  <h1>📊 陳情案件分類儀表板</h1>
  <p class="src">
    資料來源：臺北市資料大平臺「臺北市陳情系統類別資料」（研考會提供，每月更新）・
    <a href="https://data.taipei/dataset/detail?id=cb423c17-88eb-4231-a725-f1b93247d1bf"
       target="_blank" rel="noopener">資料集說明頁 ↗</a>
  </p>

  <div id="status" class="status">⏳ 正在向 data.taipei 取資料…</div>

  <div class="kpis">
    <div class="kpi"><div class="n" id="kTotal">—</div><div class="t">資料集總案件數</div></div>
    <div class="kpi"><div class="n" id="kRows">—</div><div class="t">這次抓回來的筆數</div></div>
    <div class="kpi"><div class="n" id="kCats">—</div><div class="t">出現的主類別數</div></div>
  </div>

  <div class="card">
    <h2>案件主類別分佈 <span style="font-weight:400;color:var(--muted);font-size:13px">（只統計抓回來的這幾筆）</span></h2>
    <div id="bars"></div>
  </div>

  <div class="card">
    <h2>案件明細</h2>
    <div class="scroll"><table>
      <thead><tr>
        <th>案件編號</th><th>主類別</th><th>次類別</th>
        <th>受理機關</th><th>受理科室</th><th>受理日期</th><th>結案日期</th>
      </tr></thead>
      <tbody id="rows"></tbody>
    </table></div>
  </div>

  <p><button id="reload" type="button">↻ 重新抓一次</button></p>

  <p class="foot">
    這是 Zero to Deploy 的教學練習範本，不是官方儀表板。<br>
    這頁完全公開：這份開放資料已去識別化（沒有陳情人姓名、電話、陳情內容），所以可以這樣放。
  </p>
</div>

<script>
  // ===== 想換成別份開放資料，改這一行就好 =====
  var API = "https://data.taipei/api/v1/dataset/7e5c4a52-b2ed-49c0-a103-caa72bda9d47?scope=resourceAquire&limit=200";

  // 萬一連不到（CORS／沒網路／平台維護）就用這份內建範例，畫面才不會空白
  var SAMPLE = {
    result: { count: 48231, results: [
      { "案件編號":"202601-004512","案件主類別":"交通運輸","案件次類別":"停車問題","受理機關":"交通局","受理科室":"停車管理工程處","受理日期":"2026-01-05","送達日期":"2026-01-05","結案日期":"2026-01-12" },
      { "案件編號":"202601-004513","案件主類別":"環境保護","案件次類別":"垃圾清運","受理機關":"環境保護局","受理科室":"內湖區清潔隊","受理日期":"2026-01-05","送達日期":"2026-01-06","結案日期":"2026-01-09" },
      { "案件編號":"202601-004514","案件主類別":"都市發展","案件次類別":"建築管理","受理機關":"都市發展局","受理科室":"建築管理工程處","受理日期":"2026-01-06","送達日期":"2026-01-06","結案日期":"2026-01-20" },
      { "案件編號":"202601-004515","案件主類別":"交通運輸","案件次類別":"號誌標線","受理機關":"交通局","受理科室":"交通管制工程處","受理日期":"2026-01-06","送達日期":"2026-01-07","結案日期":"2026-01-15" },
      { "案件編號":"202601-004516","案件主類別":"公園綠地","案件次類別":"行道樹修剪","受理機關":"工務局","受理科室":"公園路燈工程管理處","受理日期":"2026-01-07","送達日期":"2026-01-07","結案日期":"2026-01-18" },
      { "案件編號":"202601-004517","案件主類別":"環境保護","案件次類別":"噪音","受理機關":"環境保護局","受理科室":"稽查大隊","受理日期":"2026-01-07","送達日期":"2026-01-08","結案日期":"2026-01-14" },
      { "案件編號":"202601-004518","案件主類別":"交通運輸","案件次類別":"公車服務","受理機關":"交通局","受理科室":"公共運輸處","受理日期":"2026-01-08","送達日期":"2026-01-08","結案日期":"2026-01-16" },
      { "案件編號":"202601-004519","案件主類別":"社會福利","案件次類別":"長照服務","受理機關":"社會局","受理科室":"老人福利科","受理日期":"2026-01-08","送達日期":"2026-01-09","結案日期":"2026-01-22" }
    ]}
  };

  var $ = function (id) { return document.getElementById(id); };

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function render(data, live, why) {
    var r = (data && data.result) || {};
    var rows = r.results || [];

    // 狀態列
    var s = $("status");
    if (live) {
      s.className = "status live";
      s.innerHTML = "<b>✅ 這是剛剛從 data.taipei 抓回來的真實資料</b>" +
        "按「重新抓一次」會再送一個 GET 請求。";
    } else {
      s.className = "status fallback";
      s.innerHTML = "<b>⚠️ 抓不到即時資料，畫面顯示的是內建的範例資料</b>" +
        "常見原因：① 瀏覽器的跨網域限制（CORS）—— 網頁去要「別人家網域」的資料時，" +
        "要對方允許才給；② 沒有網路或平台維護中。" +
        (why ? "（訊息：" + esc(why) + "）" : "") +
        "　想確認 API 本身沒問題，可以直接在新分頁打開那串網址 —— " +
        "那是一般瀏覽，不受這個限制。";
    }

    // 統計
    var counts = {};
    rows.forEach(function (row) {
      var k = row["案件主類別"] || "（未分類）";
      counts[k] = (counts[k] || 0) + 1;
    });
    var pairs = Object.keys(counts).map(function (k) { return [k, counts[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; });

    $("kTotal").textContent = r.count != null ? Number(r.count).toLocaleString("zh-TW") : "—";
    $("kRows").textContent = rows.length;
    $("kCats").textContent = pairs.length;

    var max = pairs.length ? pairs[0][1] : 1;
    $("bars").innerHTML = pairs.map(function (p) {
      var pct = Math.round((p[1] / max) * 100);
      return '<div class="bar"><span>' + esc(p[0]) + '</span>' +
             '<span class="track"><span class="fill" style="width:' + pct + '%"></span></span>' +
             '<span class="v">' + p[1] + ' 件</span></div>';
    }).join("") || '<p style="color:var(--muted)">沒有資料</p>';

    var F = ["案件編號","案件主類別","案件次類別","受理機關","受理科室","受理日期","結案日期"];
    $("rows").innerHTML = rows.slice(0, 30).map(function (row) {
      return "<tr>" + F.map(function (f) { return "<td>" + esc(row[f]) + "</td>"; }).join("") + "</tr>";
    }).join("");
  }

  function load() {
    var btn = $("reload");
    btn.disabled = true;
    $("status").className = "status";
    $("status").textContent = "⏳ 正在向 data.taipei 取資料…";

    fetch(API)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) { render(data, true); })
      .catch(function (err) { render(SAMPLE, false, err && err.message); })
      .then(function () { btn.disabled = false; });
  }

  $("reload").addEventListener("click", load);
  load();
</script>
</body>
</html>`;
