import { useState } from "react";
import Level from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import Browser from "../components/Browser.jsx";
import { BADGES } from "../data/levels.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 站內模擬用的假 API：都用「政府開放資料」情境（不含任何個資）
const ENDPOINTS = [
  {
    method: "GET",
    path: "/aqi?site=Banqiao",
    label: "查空氣品質",
    data: { site: "板橋", aqi: 42, status: "良好", pm25: 12, time: "10:00" },
  },
  {
    method: "GET",
    path: "/garbage-truck?route=A",
    label: "查垃圾車位置",
    data: { route: "A", next_stop: "中山路一段", eta_min: 8 },
  },
  {
    method: "GET",
    path: "/venue/library",
    label: "查場館開放時間",
    data: { name: "市立圖書館", open: true, hours: "09:00–21:00", crowd: "適中" },
  },
];

export default function ApiLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.apiBasics}
      done={{
        icon: "🔌",
        title: "API 入門達成！",
        text: "你已經懂了 API 的核心：照著網址（endpoint）＋方法（GET/POST）發出 request，對方回你一包結構化的 JSON。之後很多部署（例如 AI 服務）都是靠 API 串起來的。",
        secondary: { label: "回地圖", onClick: () => ctx.goMap() },
        primary: { label: "看看下一關 →", onClick: () => ctx.goMap() },
      }}
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
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">
        步驟 1 / 3 · 這是什麼
      </span>
      <h2 className="text-2xl font-bold text-ink">API 是什麼？用「餐廳點餐」來想</h2>
      <div className="callout callout-info">
        API 就像餐廳的<b className="text-ink">服務生＋菜單</b>
        ：你（前端）不會自己衝進廚房，而是照著菜單點餐，服務生（API）幫你把需求送進廚房（後端），再把做好的菜（資料）端回來給你。
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ["🙋", "① 你發出請求 request", "照菜單點餐：「我要台北的天氣」"],
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
        <b className="text-ink">串接政府開放資料</b>（空氣品質、垃圾車、場館資訊）——
        這類公開資料沒有個資疑慮，最安全。
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
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">
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
            className="btn btn-primary !py-2 !px-4 !text-sm"
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
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">
        步驟 3 / 3 · 真的看一次
      </span>
      <h2 className="text-2xl font-bold text-ink">打開一個真正的開放資料 API 🌍</h2>
      <div className="callout">
        很多 API 用 <b className="text-ink">GET</b> 的時候，其實在瀏覽器貼上網址就能直接看到回傳的
        JSON。點下面的連結看看（都是<b className="text-ink">公開的開放資料</b>，不需登入、沒有個資）：
      </div>

      <div className="grid gap-2.5">
        <a
          href="https://api.open-meteo.com/v1/forecast?latitude=25.03&longitude=121.56&current_weather=true"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="gh-btn justify-between !py-3 !text-[15px]"
        >
          <span>🔗 GET 台北即時天氣（開放資料 JSON）</span>
          <span>↗</span>
        </a>
        <a
          href="https://data.gov.tw/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="gh-btn justify-between !py-3 !text-[15px]"
        >
          <span>🔗 逛逛「政府資料開放平臺」data.gov.tw</span>
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
