import { useState } from "react";
import Level, { Eyebrow } from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* 原本這一關只教「推播通知」一種玩法，會讓人以為 GAS 就只能做這件事。
   其實一個 GAS 專案更像一個小型網站專案：可以放好幾個 .gs 檔（程式邏輯），
   也可以加 .html 檔（畫面）。這裡把「玩法」拆成三種，貫穿三個步驟：
   推播通知（今天實際動手做）、寫入試算表（當免費資料庫）、
   網頁應用程式（.gs + .html，給你自己的網址）。 */
const VARIANTS = [
  {
    id: "push",
    icon: "🔔",
    label: "推播通知",
    sub: "定時或事件觸發，呼叫外部 API",
    files: ".gs",
  },
  {
    id: "sheet",
    icon: "📊",
    label: "寫入試算表",
    sub: "把試算表當免費資料庫",
    files: ".gs",
  },
  {
    id: "webapp",
    icon: "🖥️",
    label: "網頁應用程式",
    sub: "有人打開網址時才執行",
    files: ".gs ＋ .html",
  },
];

const GAS_CODE = `function pushMessage() {
  // 把這裡換成你的 Webhook 網址（Discord / Slack 都可以）
  // 提醒：Webhook 網址等同密鑰，勿寫進公開的 repo 或截圖外流
  const webhook = "https://你的-webhook-網址";

  // 通知內容用案號代替市民個資（勿放姓名、電話）
  const payload = { content: "市政信箱新案 1130512-007，請承辦同仁查看" };

  // 用 GAS 內建的 UrlFetchApp 呼叫別人的 API
  UrlFetchApp.fetch(webhook, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  });
}`;

const SHEET_CODE = `function logToSheet(content) {
  // 把試算表當免費資料庫：每次執行都新增一列
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("紀錄");
  sheet.appendRow([new Date(), content]);
}`;

const WEBAPP_CODE_GS = `// Code.gs —— 網頁應用程式的後端
function doGet() {
  // 有人打開你的網址時，這個函式才會被呼叫
  return HtmlService.createHtmlOutputFromFile("Page");
}`;

const WEBAPP_CODE_HTML = `<!-- Page.html —— 使用者看到的畫面 -->
<h1>陳情案件查詢</h1>
<input id="caseNo" placeholder="輸入案號">
<button onclick="alert('查詢中…')">查詢</button>`;

export default function GasLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.gasPush}
      done={{ ...DONE.gas }}
      steps={[
        ({ next }) => <ConceptStep onNext={next} />,
        ({ next }) => <VariantStep onNext={next} />,
        ({ finish }) => <RealStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：概念 ---------- */
function ConceptStep({ onNext }) {
  return (
    <div className="space-y-4">
      <Eyebrow>步驟 1 / 3 · 這是什麼</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">GAS 專案裡到底能放什麼？</h2>

      <div className="callout callout-info">
        <b className="text-ink">GAS（Google Apps Script）</b>是 Google 提供的
        <b className="text-ink">免費雲端小程式</b>。但它不是只能寫一支自動化腳本 ——
        一個 GAS 專案更像一個小型網站專案：可以放好幾個{" "}
        <code className="font-mono text-xs bg-surface2 px-1.5 py-0.5 rounded border border-line">.gs</code>
        檔（程式邏輯，語法就是 JavaScript），也可以加{" "}
        <code className="font-mono text-xs bg-surface2 px-1.5 py-0.5 rounded border border-line">.html</code>
        檔（畫面）。
      </div>

      <div>
        <div className="text-[13px] font-extrabold text-muted mb-2">GAS 常見的三種玩法 👇</div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {VARIANTS.map((v) => (
            <div key={v.id} className="card card-sm">
              <div className="text-3xl">{v.icon}</div>
              <b className="text-ink text-sm block mt-1">{v.label}</b>
              <p className="text-muted text-xs m-0 mt-0.5">{v.sub}</p>
              <span className="inline-block mt-1.5 text-[11px] font-mono font-bold text-accentText bg-primarySoft px-1.5 py-0.5 rounded">
                {v.files}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="callout">
        <b className="text-ink">三種玩法，骨架都一樣：</b>
        <div className="mt-1.5">
          {[
            ["⏰", "① 觸發", "時間到了、有事件發生、或有人打開網址"],
            ["☁️", "② GAS 執行", "在 Google 雲端跑你寫的那段 .gs 程式"],
            ["🎯", "③ 做某件事", "推播、寫進試算表、或回傳一個網頁"],
          ].map(([i, t, d], idx) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-sm">
              {idx > 0 && (
                <span className="text-muted mx-1" aria-hidden="true">
                  →
                </span>
              )}
              <span aria-hidden="true">{i}</span>
              <b className="text-ink">{t}</b>
              <span className="text-muted">（{d}）</span>
            </span>
          ))}
        </div>
      </div>

      <div className="callout">
        重點：你不用自己準備一台「一直開著的伺服器」，Google 幫你跑。這就是所謂的{" "}
        <b className="text-ink">Serverless（免伺服器）</b> 自動化。
      </div>

      <button type="button" className="btn btn-primary" onClick={onNext}>
        下一步：三種玩法各跑一次 →
      </button>
    </div>
  );
}

/* ---------- 步驟 2：三種玩法分頁模擬 ----------
   只有「推播通知」是後面步驟 3 真的會動手做的，所以只有它會鎖住下一步；
   另外兩種是可以自由探索的加分內容，不擋流程 —— 逼使用者把三個分頁都
   點開才放行，只會把「體驗玩法」變成另一份作業。 */
function VariantStep({ onNext }) {
  const [tab, setTab] = useState("push");
  const [pushDone, setPushDone] = useState(false);
  const [sheetTried, setSheetTried] = useState(false);
  const [webappTried, setWebappTried] = useState(false);

  const tried = { push: pushDone, sheet: sheetTried, webapp: webappTried };

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 2 / 3 · 三種玩法各跑一次</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">選一個分頁，按按看 🎮</h2>
      <p className="text-muted text-sm m-0">
        「推播通知」要跑成功才能繼續 —— 步驟 3 會真的做這一個。另外兩個歡迎按按看，不強迫。
      </p>

      <div className="flex flex-wrap gap-2" role="tablist">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={tab === v.id}
            data-tab={v.id}
            onClick={() => setTab(v.id)}
            className={`px-3.5 py-2 rounded-[12px] border-2 text-sm font-bold transition-all ${
              tab === v.id ? "border-primary bg-primarySoft text-ink" : "border-line bg-surface text-ink"
            }`}
          >
            {v.icon} {v.label} {tried[v.id] && <span className="text-success">✓</span>}
          </button>
        ))}
      </div>

      {tab === "push" && <PushDemo done={pushDone} onDone={() => setPushDone(true)} />}
      {tab === "sheet" && <SheetDemo onTried={() => setSheetTried(true)} />}
      {tab === "webapp" && <WebAppDemo onTried={() => setWebappTried(true)} />}

      <button type="button" data-next="variant" className="btn btn-primary" disabled={!pushDone} onClick={onNext}>
        {pushDone ? "我懂流程了，去真的做一次 →" : "先在「推播通知」分頁成功執行一次"}
      </button>
    </div>
  );
}

/* 分頁 ①：推播通知（沿用原本就做好的模擬） */
function PushDemo({ done, onDone }) {
  const [msg, setMsg] = useState("新報修案 A-1130512：中正路路燈不亮");
  const [trigger, setTrigger] = useState(null);
  const [status, setStatus] = useState(done ? "done" : "idle");
  const [chat, setChat] = useState([]);
  const [pkt, setPkt] = useState({ left: "0%", opacity: 0 });

  const TRIGGERS = [
    { id: "time", icon: "⏰", label: "定時觸發", sub: "每天 9:00 彙整昨日案件" },
    { id: "event", icon: "⚡", label: "事件觸發", sub: "市民送出陳情表單時" },
  ];

  const run = async () => {
    if (!trigger || status === "running") return;
    setStatus("running");
    setPkt({ left: "0%", opacity: 1 });
    await sleep(30);
    setPkt({ left: "100%", opacity: 1 });
    await sleep(900);
    setPkt({ left: "100%", opacity: 0 });
    setChat((c) => [...c, { id: Date.now(), text: msg || "（空白訊息）" }]);
    setStatus("done");
    onDone();
  };

  return (
    <div className="border-2 border-line rounded-[18px] bg-surface2 p-3.5 space-y-3.5" data-variant="push">
      <div>
        <label className="text-[13px] font-bold block mb-1.5">① 要推播的訊息（用案號，勿放市民個資）</label>
        <input
          className="gh-input gh-input-sans"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="輸入要自動送出的通知內容"
        />
      </div>

      <div>
        <label className="text-[13px] font-bold block mb-1.5">② 選一個觸發方式</label>
        <div className="flex flex-wrap gap-2">
          {TRIGGERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrigger(t.id)}
              className={`gh-btn ${trigger === t.id ? "!border-primary !bg-primarySoft text-primary" : ""}`}
            >
              {t.icon} {t.label}
              <span className="text-muted font-normal ml-1">· {t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mt-1">
        <FlowNode icon="☁️" label="GAS" sub={trigger ? "已設定觸發" : "先選觸發方式"} active={!!trigger} />
        <div className="relative h-[54px]">
          <div
            className="absolute top-1/2 left-0 right-0 h-1 rounded-full"
            style={{ background: "var(--track)" }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 text-xl transition-[left,opacity] duration-[900ms]"
            style={{ left: pkt.left, opacity: pkt.opacity }}
          >
            📤
          </div>
        </div>
        <FlowNode icon="💬" label="承辦科室群組" sub="收到通知的地方" active={status === "done"} />
      </div>

      <div className="text-center">
        <button
          type="button"
          data-run="push"
          className="btn btn-accent"
          onClick={run}
          disabled={!trigger || status === "running"}
        >
          {status === "running" ? "GAS 執行中…" : "▶ 執行 GAS"}
        </button>
        {!trigger && <p className="text-muted text-sm mt-2">先選一個觸發方式，再按執行。</p>}
      </div>

      <div className="border-2 border-line rounded-[18px] bg-surface p-3.5 min-h-[90px]">
        <div className="text-xs font-extrabold text-muted mb-2">💬 #市政信箱-承辦通知 頻道</div>
        {chat.length === 0 ? (
          <div className="text-muted text-sm text-center py-3">還沒有訊息 —— 執行一次看看</div>
        ) : (
          <div className="space-y-2">
            {chat.map((m) => (
              <div key={m.id} className="flex items-start gap-2 animate-pop">
                <span className="text-xl">🤖</span>
                <div>
                  <div className="text-xs font-bold text-ink">
                    市政信箱通知機器人 <span className="text-muted font-normal">· 剛剛</span>
                  </div>
                  <div className="text-sm bg-surface2 border border-line rounded-lg px-3 py-1.5 inline-block mt-0.5">
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* 分頁 ②：寫入試算表 —— 同一套骨架，「做某件事」換成寫一列資料進去 */
function SheetDemo({ onTried }) {
  const [content, setContent] = useState("陳情案 A-1130512：路燈不亮");
  const [rows, setRows] = useState([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    if (running) return;
    setRunning(true);
    await sleep(500);
    setRows((r) => [...r, { id: Date.now(), time: new Date().toLocaleTimeString("zh-TW"), content }]);
    setRunning(false);
    onTried();
  };

  return (
    <div className="border-2 border-line rounded-[18px] bg-surface2 p-3.5 space-y-3.5" data-variant="sheet">
      <div>
        <label className="text-[13px] font-bold block mb-1.5">要寫進試算表的內容</label>
        <div className="flex gap-2 flex-wrap">
          <input
            className="gh-input gh-input-sans flex-1 min-w-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="button" data-run="sheet" className="btn btn-accent" onClick={run} disabled={running}>
            {running ? "GAS 執行中…" : "▶ 寫入試算表"}
          </button>
        </div>
      </div>

      <div className="border-2 border-line rounded-[14px] bg-surface overflow-hidden">
        <div className="grid grid-cols-[110px_1fr] text-xs font-extrabold text-muted bg-surface2 px-3 py-2">
          <span>時間</span>
          <span>內容</span>
        </div>
        {rows.length === 0 ? (
          <div className="text-muted text-sm text-center py-4">還沒有資料列 —— 按上面的按鈕寫一列看看</div>
        ) : (
          <div>
            {rows.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-[110px_1fr] text-sm px-3 py-2 border-t border-line animate-pop"
              >
                <span className="text-muted font-mono text-xs">{r.time}</span>
                <span className="text-ink">{r.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted m-0">
        這張表就是 Google 試算表 —— 對很多小工具來說，這樣就已經是一個免費資料庫了，不用另外架資料庫。
      </p>
    </div>
  );
}

/* 分頁 ③：網頁應用程式 —— 跟另外兩種不一樣：不是自動觸發，
   是有人打開網址時，GAS 才執行 doGet() 把畫面送出去。 */
function WebAppDemo({ onTried }) {
  const [deployed, setDeployed] = useState(false);

  const deploy = () => {
    setDeployed(true);
    onTried();
  };

  return (
    <div className="border-2 border-line rounded-[18px] bg-surface2 p-3.5 space-y-3.5" data-variant="webapp">
      <div className="callout callout-info m-0">
        跟另外兩種不一樣：<b className="text-ink">網頁應用程式不是自動觸發的</b>
        ，而是<b className="text-ink">有人打開你給的網址時</b>，GAS 才執行 doGet()、把畫面送出去。
      </div>

      {!deployed ? (
        <div className="text-center py-3">
          <button type="button" data-run="webapp" className="btn btn-accent" onClick={deploy}>
            ▶ 部署網頁應用程式
          </button>
        </div>
      ) : (
        <div className="animate-pop">
          <div className="border-2 border-line rounded-[14px] overflow-hidden bg-surface">
            <div className="flex items-center gap-1.5 bg-surface2 px-3 py-2 border-b-2 border-line">
              <span className="w-2.5 h-2.5 rounded-full bg-danger" aria-hidden="true" />
              <span className="w-2.5 h-2.5 rounded-full bg-sun" aria-hidden="true" />
              <span className="w-2.5 h-2.5 rounded-full bg-success" aria-hidden="true" />
              <span className="ml-2 text-[11px] font-mono text-muted truncate">
                https://script.google.com/macros/s/……/exec
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-ink font-bold text-base m-0 mb-2">陳情案件查詢</h3>
              <div className="flex gap-2 flex-wrap">
                <input className="gh-input gh-input-sans flex-1 min-w-[140px]" placeholder="輸入案號" disabled />
                <button type="button" className="btn btn-primary btn-sm" disabled>
                  查詢
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted mt-2 mb-0">
            這個畫面就是 Page.html —— 任何人打開這個網址都會看到它，就像你在第 3 關做的網站一樣。
          </p>
        </div>
      )}
    </div>
  );
}

function FlowNode({ icon, label, sub, active }) {
  return (
    <div
      className={`text-center py-3.5 px-2 rounded-[18px] border-2 bg-surface transition-colors ${active ? "border-primary" : "border-line"}`}
      style={{ boxShadow: "0 4px 0 var(--border)" }}
    >
      <span className="text-3xl block">{icon}</span>
      <div className="font-extrabold text-sm mt-1">{label}</div>
      <div className="text-xs text-muted">{sub}</div>
    </div>
  );
}

/* ---------- 步驟 3：真的做一次（指南 + 程式碼 + 測驗） ---------- */
function RealStep({ onFinish }) {
  const [copied, setCopied] = useState(false);
  const [passed, setPassed] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(GAS_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 3 / 3 · 真的做一次</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">在真的 GAS 上做一個推播 📮</h2>
      <div className="callout">
        真的做起來也是點一點就好。下面用「推播通知」這個玩法示範最小可行的做法（以 Discord Webhook 為例）：
      </div>

      <ul className="list-none p-0 m-0 grid gap-2.5">
        {[
          {
            t: "在聊天平台建立一個 Webhook 網址",
            d: "Discord：頻道設定 → 整合 → 建立 Webhook，複製網址。（Slack、LINE 也都有類似功能）",
          },
          {
            t: "打開 Google Apps Script",
            d: "到 script.google.com → 新專案。",
            href: "https://script.google.com",
          },
          {
            t: "貼上下面這段程式碼，換成你的 Webhook 網址",
            d: "把 UrlFetchApp.fetch 裡的網址換成上一步複製的。",
          },
          { t: "按「執行」，回聊天室看有沒有收到訊息", d: "第一次會請你授權，按同意即可。" },
          { t: "（進階）設定觸發條件", d: "左側「觸發條件」→ 新增，選定時或事件，就會自動跑。" },
        ].map((it, i) => (
          <li
            key={i}
            className="flex gap-3 items-start py-3.5 px-4 border-2 border-line rounded-[14px] bg-surface"
          >
            <span
              className="w-6 h-6 shrink-0 rounded-full grid place-items-center text-xs font-extrabold text-white"
              style={{ background: "var(--primary-dark)" }}
            >
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="font-bold">
                {it.href ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer" className="text-accentText">
                    {it.t} ↗
                  </a>
                ) : (
                  it.t
                )}
              </div>
              <div className="text-[13.5px] text-muted mt-0.5">{it.d}</div>
            </div>
          </li>
        ))}
      </ul>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-bold">GAS 程式碼（可直接複製）</span>
          <button type="button" className="gh-btn gh-btn-sm" onClick={copy}>
            {copied ? "✓ 已複製" : "📋 複製"}
          </button>
        </div>
        <pre className="font-mono text-[12.5px] bg-surface2 border border-line rounded-[10px] p-3.5 overflow-x-auto whitespace-pre">
          {GAS_CODE}
        </pre>
      </div>

      <OtherVariantsHowTo />

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.gas} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>
        完成這一關 🎉
      </button>
    </div>
  );
}

/* 延伸內容收合起來，不擠壓主線（推播）的版面，想深入的人才點開。
   這裡把「其實還能做什麼」講到程式碼層級，並把「誰能打開這個網址」
   的界線判斷點出來 —— 跟第 4 關的紅線是同一套邏輯。 */
function OtherVariantsHowTo() {
  return (
    <details
      className="rounded-[14px] border-2 overflow-hidden"
      style={{
        borderColor: "color-mix(in srgb, var(--sun) 55%, var(--border))",
        background: "color-mix(in srgb, var(--sun) 10%, var(--surface))",
      }}
    >
      <summary className="cursor-pointer select-none list-none px-4 py-3 font-extrabold text-ink flex items-center gap-2 flex-wrap">
        <span className="text-lg" aria-hidden="true">
          🧩
        </span>
        <span>延伸：另外兩種玩法的程式碼長怎樣？</span>
        <span className="ml-auto text-muted text-xs font-normal hidden sm:inline">點此展開／收合</span>
      </summary>

      <div className="px-4 pb-4 space-y-4">
        <div>
          <div className="text-sm font-extrabold text-ink mb-1.5">📊 寫入試算表</div>
          <p className="text-[13.5px] text-muted m-0 mb-2">
            跟推播一樣是「觸發 → 執行」，只是最後一步換成 <code className="font-mono text-xs">appendRow</code>
            —— 新增一列，而不是呼叫外部 API。
          </p>
          <pre className="font-mono text-[12px] bg-surface2 border border-line rounded-[10px] p-3 overflow-x-auto whitespace-pre m-0">
            {SHEET_CODE}
          </pre>
        </div>

        <div>
          <div className="text-sm font-extrabold text-ink mb-1.5">🖥️ 網頁應用程式（.gs ＋ .html）</div>
          <p className="text-[13.5px] text-muted m-0 mb-2">
            這時 GAS 專案裡會有<b className="text-ink">兩個檔案</b>：一個 .gs 當後端、一個 .html 當畫面。
            部署後拿到一個網址，任何人打開就會看到 Page.html 那個畫面。
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <pre className="font-mono text-[12px] bg-surface2 border border-line rounded-[10px] p-3 overflow-x-auto whitespace-pre m-0">
              {WEBAPP_CODE_GS}
            </pre>
            <pre className="font-mono text-[12px] bg-surface2 border border-line rounded-[10px] p-3 overflow-x-auto whitespace-pre m-0">
              {WEBAPP_CODE_HTML}
            </pre>
          </div>
        </div>

        <div
          className="callout m-0"
          style={{
            borderLeftColor: "var(--danger)",
            background: "color-mix(in srgb, var(--danger) 8%, var(--surface))",
          }}
        >
          <b className="text-ink">部署網頁應用程式時要選「誰可以存取」：</b>
          選「僅自己」只有你打得開；選「知道連結的人」或「任何人」，那個網址就跟第 3 關做的網站一樣是公開的 ——
          第 4 關學過的那些紅線（個資、機敏資料……）一樣適用，先想清楚要給誰看。
        </div>
      </div>
    </details>
  );
}
