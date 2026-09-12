import { useState } from "react";
import Level from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import Browser from "../components/Browser.jsx";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";
import { OPEN_DATA } from "../content/openData.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 站內模擬用的 API：打的是「臺北市陳情系統類別資料」這份真實開放資料。
// 網址與欄位都照真的寫，回傳值是示範用的假資料（真實內容請看第 3 步的連結）。
// 三個選項刻意只差在參數，用來教 limit / offset 這兩個最常見的查詢參數。
const ROW = (id, no, main, sub, org, dept, recv, send, close) => ({
  _id: id,
  案件編號: no,
  案件主類別: main,
  案件次類別: sub,
  受理機關: org,
  受理科室: dept,
  受理日期: recv,
  送達日期: send,
  結案日期: close,
});

const ROWS = [
  ROW(
    1,
    "202601-004512",
    "交通運輸",
    "停車問題",
    "交通局",
    "停車管理工程處",
    "2026-01-05",
    "2026-01-05",
    "2026-01-12"
  ),
  ROW(
    2,
    "202601-004513",
    "環境保護",
    "垃圾清運",
    "環境保護局",
    "內湖區清潔隊",
    "2026-01-05",
    "2026-01-06",
    "2026-01-09"
  ),
  ROW(
    3,
    "202601-004514",
    "都市發展",
    "建築管理",
    "都市發展局",
    "建築管理工程處",
    "2026-01-06",
    "2026-01-06",
    "2026-01-20"
  ),
  ROW(
    4,
    "202601-004515",
    "交通運輸",
    "號誌標線",
    "交通局",
    "交通管制工程處",
    "2026-01-06",
    "2026-01-07",
    "2026-01-15"
  ),
  ROW(
    5,
    "202601-004516",
    "公園綠地",
    "行道樹修剪",
    "工務局",
    "公園路燈工程管理處",
    "2026-01-07",
    "2026-01-07",
    "2026-01-18"
  ),
  ROW(
    6,
    "202601-004517",
    "環境保護",
    "噪音",
    "環境保護局",
    "稽查大隊",
    "2026-01-07",
    "2026-01-08",
    "2026-01-14"
  ),
];

// data.taipei 的回傳外層固定長這樣
const envelope = (limit, offset) => ({
  result: {
    limit,
    offset,
    count: 48231,
    sort: "",
    results: ROWS.slice(offset, offset + limit),
  },
});

const API = "/api/v1/dataset/7e5c4a52-…";

const ENDPOINTS = [
  {
    method: "GET",
    path: API + "?scope=resourceAquire&limit=1",
    label: "先拿 1 筆看看長什麼樣",
    data: envelope(1, 0),
  },
  {
    method: "GET",
    path: API + "?scope=resourceAquire&limit=3",
    label: "一次拿 3 筆",
    data: envelope(3, 0),
  },
  {
    method: "GET",
    path: API + "?scope=resourceAquire&limit=3&offset=3",
    label: "跳過前 3 筆再拿 3 筆（分頁）",
    data: envelope(3, 3),
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
          ["🙋", "① 你發出請求 request", "照菜單點餐：「我要上個月的陳情案件分類」"],
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
        <b className="text-ink">串接市府開放資料</b>。這一關就用一份真的：研考會發布的
        <b className="text-ink">「臺北市陳情系統類別資料」</b>
        —— 每個月更新，記錄陳情案件的類別、受理機關與處理日期。
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
            <div className="text-sm text-ink">{OPEN_DATA.fields.join("、")}</div>
          </div>
          <div>
            <div className="text-xs font-extrabold text-muted mb-1">🚫 沒有的東西</div>
            <div className="text-sm text-ink">{OPEN_DATA.hasNot.join("、")}</div>
          </div>
        </div>
        <p className="text-sm text-ink mt-2.5 mb-0">
          它敢公開，正是因為<b>個資的部分被拿掉了</b>
          —— 只留下「哪一類、哪個機關、什麼時候」。這就是第 3 關講的界線：
          <b>去識別化後的統計可以公開，含姓名電話的陳情原文不行。</b>
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
        JSON。下面第一條就是<b className="text-ink">臺北市政府開放資料的真實 API</b>
        ，點下去會在新分頁看到一整包 JSON（公開資料，不需登入、沒有個資）：
      </div>

      <div className="grid gap-2.5">
        <a
          href={OPEN_DATA.apiUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="gh-btn gh-btn-row"
        >
          <span>🔗 GET 臺北市開放資料 API（會直接看到 JSON）</span>
          <span>↗</span>
        </a>
        <a
          href={OPEN_DATA.datasetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="gh-btn gh-btn-row"
        >
          <span>🔗 這份資料的說明頁（欄位、更新頻率、授權）</span>
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

      <Quiz {...QUIZZES.api} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>
        完成這一關 🎉
      </button>
    </div>
  );
}
