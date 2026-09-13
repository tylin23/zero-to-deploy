import { useState } from "react";
import Level from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import Browser from "../components/Browser.jsx";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";
import { OPEN_DATA } from "../content/openData.js";
import { DASHBOARD_HTML } from "../content/dashboardPage.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function downloadDashboard() {
  const blob = new Blob([DASHBOARD_HTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dashboard.html";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// 站內模擬用的 API：打的是 YouBike 即時資訊這份真實開放資料。
// 網址與欄位都照真的寫，數值是示範用的（真實數字請按第 3 步的連結看）。
// 三個選項示範的是「這個 API 一次把全部給你，篩選要自己做」。
const ST = (sna, sarea, rent, ret, qty) => ({
  sna,
  sarea,
  ar: "（地址）",
  available_rent_bikes: rent,
  available_return_bikes: ret,
  Quantity: qty,
  mday: "2026-09-13 03:03:03",
});

const STATIONS = [
  ST("YouBike2.0_捷運科技大樓站", "大安區", 13, 14, 28),
  ST("YouBike2.0_臺北市政府", "信義區", 22, 8, 31),
  ST("YouBike2.0_臺北車站(東三門)", "中正區", 0, 40, 41),
  ST("YouBike2.0_大安森林公園站", "大安區", 17, 11, 29),
];

const ENDPOINTS = [
  {
    method: "GET",
    path: "/dotapp/youbike/v2/youbike_immediate.json",
    label: "拿全部站點（這個 API 一次給你全部）",
    data: STATIONS,
  },
  {
    method: "GET",
    path: "/dotapp/youbike/v2/youbike_immediate.json",
    label: "只看大安區（自己篩）",
    data: STATIONS.filter((x) => x.sarea === "大安區"),
  },
  {
    method: "GET",
    path: "/dotapp/youbike/v2/youbike_immediate.json",
    label: "只看還有車的站（自己篩）",
    data: STATIONS.filter((x) => x.available_rent_bikes > 0),
  },
];

export default function ApiLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.apiBasics}
      done={{ ...DONE.api }}
      steps={[
        ({ next }) => <ConceptStep onNext={next} />,
        ({ next }) => <TesterStep onNext={next} />,
        ({ finish }) => <RealStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：概念（餐廳點餐比喻） ---------- */
function ConceptStep({ onNext }) {
  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 1 / 3 · 這是什麼
      </span>
      <h2 className="text-2xl font-bold text-ink">API 是什麼？用「餐廳點餐」來想</h2>
      <div className="callout callout-info">
        API 就像餐廳的<b className="text-ink">服務生＋菜單</b>
        ：你（前端）不會自己衝進廚房，而是照著菜單點餐，服務生（API）幫你把需求送進廚房（後端），再把做好的菜（資料）端回來給你。
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ["🙋", "① 你發出請求 request", "照菜單點餐：「我要現在全市 YouBike 各站還剩幾台車」"],
          ["🧑‍🍳", "② 後端處理", "廚房照單做菜（查資料庫、運算）"],
          ["📦", "③ 回傳 response", "把資料打包成 JSON 端回來給你"],
        ].map(([i, t, d]) => (
          <div key={t} className="card">
            <div className="text-3xl">{i}</div>
            <b className="text-ink text-sm">{t}</b>
            <p className="text-muted text-sm m-0">{d}</p>
          </div>
        ))}
      </div>

      <div className="callout">
        重點是「<b className="text-ink">照規則問、拿到結構化的答案</b>」。這份規則包含：要去哪個網址（
        <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">
          endpoint
        </code>
        ）、用什麼方法（<b className="text-ink">GET</b> 拿資料、<b className="text-ink">POST</b>{" "}
        送資料），回來的通常是 <b className="text-ink">JSON</b>。行政情境最常見的用法，就是
        <b className="text-ink">串接市府開放資料</b>。這一關就用一份真的：
        <b className="text-ink">YouBike2.0 即時資訊</b>
        —— 每分鐘更新，全市每一站現在還剩幾台車、還有幾個空位。
      </div>
      <div
        className="callout"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">先看清楚這份資料「有什麼、沒有什麼」：</b>
        <div className="grid gap-2 sm:grid-cols-2 mt-2">
          <div>
            <div className="text-xs font-extrabold text-muted mb-1">✅ 有的欄位</div>
            <div className="text-sm text-ink">
              {OPEN_DATA.fields.map(([k, zh]) => zh + "（" + k + "）").join("、")}
            </div>
          </div>
          <div>
            <div className="text-xs font-extrabold text-muted mb-1">🚫 沒有的東西</div>
            <div className="text-sm text-ink">{OPEN_DATA.hasNot.join("、")}</div>
          </div>
        </div>
        <p className="text-sm text-ink mt-2.5 mb-0">
          它敢公開，是因為它只到<b>「現況」這一層</b>
          —— 哪一站現在剩幾台車，而不是誰借走了哪一台。這就是第 4 關講的界線：
          <b>去識別化後的統計可以公開，帶得到個人的紀錄不行。</b>
        </p>
      </div>

      <button type="button" className="btn btn-primary" onClick={onNext}>
        下一步：自己送一個 request →
      </button>
    </div>
  );
}

/* ---------- 步驟 2：站內 API 測試器 ---------- */
function TesterStep({ onNext }) {
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [sentOnce, setSentOnce] = useState(false);
  const ep = ENDPOINTS[selected];

  const send = async () => {
    if (status === "loading") return;
    setStatus("loading");
    await sleep(650);
    setStatus("done");
    setSentOnce(true);
  };

  const pick = (i) => {
    setSelected(i);
    setStatus("idle");
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 2 / 3 · 自己試一次
      </span>
      <h2 className="text-2xl font-bold text-ink">送出一個 API 請求，看看回什麼</h2>
      <p className="text-muted text-sm">選一個要問的東西，按「送出 Send」，看伺服器回你的 JSON。</p>

      <div className="flex flex-wrap gap-2">
        {ENDPOINTS.map((e, i) => (
          <button
            key={e.path}
            type="button"
            onClick={() => pick(i)}
            className={`gh-btn ${selected === i ? "!border-primary !bg-primarySoft text-primary" : ""}`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <Browser url="api.example.com">
        {/* request 列 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="pill bg-successSoft text-success">{ep.method}</span>
          <code className="font-mono text-sm bg-surface2 px-2 py-1 rounded border border-line flex-1 min-w-[160px] truncate">
            {ep.path}
          </code>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={send}
            disabled={status === "loading"}
          >
            {status === "loading" ? "傳送中…" : "送出 Send ▸"}
          </button>
        </div>

        {/* response 區 */}
        <div className="mt-3">
          <div className="text-xs font-extrabold text-muted mb-1.5">Response</div>
          {status === "idle" && (
            <div className="text-muted text-sm py-6 text-center">👆 按「送出」看看回應</div>
          )}
          {status === "loading" && (
            <div className="text-muted text-sm py-6 text-center">⏳ 等待伺服器回應…</div>
          )}
          {status === "done" && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="pill bg-successSoft text-success">200 OK</span>
                <span className="text-xs text-muted">application/json · 約 40 ms</span>
              </div>
              <pre className="font-mono text-[13px] bg-surface2 border border-line rounded-[10px] p-3.5 overflow-x-auto whitespace-pre">
                {JSON.stringify(ep.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Browser>

      <div className="callout">
        看到了嗎？回來的不是一整頁網頁，而是<b className="text-ink">乾淨的資料（JSON）</b>
        。前端拿到後，就能自己決定怎麼把它畫成畫面 —— 這就是前後端「分工」的方式。
      </div>

      <button type="button" className="btn btn-primary" disabled={!sentOnce} onClick={onNext}>
        {sentOnce ? "下一步：試試真的 API →" : "先送出一次再繼續"}
      </button>
    </div>
  );
}

/* ---------- 步驟 3：真的打一個公開 API + 測驗 ---------- */
function RealStep({ onFinish }) {
  const [opened, setOpened] = useState(false);
  const [passed, setPassed] = useState(false);

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 3 / 3 · 真的看一次
      </span>
      <h2 className="text-2xl font-bold text-ink">打開一個真正的開放資料 API 🌍</h2>
      <div className="callout">
        很多 API 用 <b className="text-ink">GET</b> 的時候，其實在瀏覽器貼上網址就能直接看到回傳的
        JSON。下面第一條就是<b className="text-ink">臺北市政府 YouBike 的真實即時 API</b>
        ，點下去會在新分頁看到全市一千多站的資料（公開資料，不需登入、沒有個資）：
      </div>

      <div className="grid gap-2.5">
        <a
          href={OPEN_DATA.apiUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="gh-btn gh-btn-row"
        >
          <span>🔗 GET YouBike 即時資訊（會直接看到一整包 JSON）</span>
          <span>↗</span>
        </a>
        <a
          href={OPEN_DATA.portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="gh-btn gh-btn-row"
        >
          <span>🔗 逛逛「臺北市資料大平臺」data.taipei</span>
          <span>↗</span>
        </a>
      </div>
      {opened && (
        <p className="text-success text-sm font-bold">
          ✓ 你剛剛就發了一個真的 GET request！瀏覽器幫你把回來的 JSON 顯示出來了。
        </p>
      )}

      <hr className="border-0 border-t border-line my-2" />

      <h3 className="text-ink font-bold">換你把這包 JSON 變成一張看板 📊</h3>
      <div className="callout callout-info">
        看懂 JSON 只是一半。<b className="text-ink">真正有用的是把它變成同仁看得懂的畫面</b>
        —— 這就是「靜態網站 ＋ 讀 API」：網頁本身還是那幾個檔案（跟第 3 關一樣好部署）， 資料則是每次打開時去
        API 拿最新的。
      </div>

      <button type="button" className="btn btn-accent" onClick={downloadDashboard}>
        ⬇ 下載 dashboard.html（YouBike 即時看板）
      </button>

      <ol className="list-decimal pl-5 m-0 grid gap-2 text-sm">
        <li>
          下載{" "}
          <code className="font-mono bg-surface2 px-1.5 py-0.5 rounded border border-line">
            dashboard.html
          </code>
          。它是<b className="text-ink">單一檔案</b>，圖表用純 CSS 畫，不需要任何額外檔案。
        </li>
        <li>
          把它上傳到<b className="text-ink">第 3 關那個 repo</b>（Add file → Upload files → Commit）。
        </li>
        <li>
          打開 <b className="text-ink">你的網址 + /dashboard.html</b>，就看到你的儀表板了。
        </li>
      </ol>

      <div
        className="callout"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">如果畫面上出現黃色提示說「抓不到即時資料」</b>
        ，那不是你做錯 —— 網頁去要「別人家網域」的資料時，要對方允許才給（這個限制叫
        <b className="text-ink"> CORS</b>）。範本遇到這種情況會自動改用內建的範例資料， 畫面不會空白。想確認
        API 本身沒問題，直接在新分頁打開上面那串網址就看得到。
      </div>

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.api} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>
        完成這一關 🎉
      </button>
    </div>
  );
}
