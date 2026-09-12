import { useState } from "react";
import Level from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

export default function GasLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.gasPush}
      done={{ ...DONE.gas }}
      steps={[
        ({ next }) => <ConceptStep onNext={next} />,
        ({ next }) => <SimStep onNext={next} />,
        ({ finish }) => <RealStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：概念 ---------- */
function ConceptStep({ onNext }) {
  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 1 / 3 · 這是什麼
      </span>
      <h2 className="text-2xl font-bold text-ink">GAS 是什麼？為什麼能「自動推播」？</h2>
      <div className="callout callout-info">
        <b className="text-ink">GAS（Google Apps Script）</b>是 Google 提供的
        <b className="text-ink">免費雲端小程式</b>。行政上很常這樣用：
        <b className="text-ink">
          市民用 Google 表單向市政信箱陳情 → GAS 自動把「有新案件」通知承辦科室的群組
        </b>
        。它可以「定時」或「有事發生時」自動執行，執行時再去呼叫別人的 API（上一關學的！）把訊息推到
        Slack/Teams/LINE 等地方。
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ["⏰", "① 觸發", "時間到了，或有事件發生"],
          ["☁️", "② GAS 執行", "在 Google 雲端跑你寫的一小段程式"],
          ["📣", "③ 呼叫 API 推播", "POST 到 Webhook，把通知送出去"],
        ].map(([i, t, d]) => (
          <div key={t} className="card">
            <div className="text-3xl">{i}</div>
            <b className="text-ink text-sm">{t}</b>
            <p className="text-muted text-sm m-0">{d}</p>
          </div>
        ))}
      </div>
      <div className="callout">
        重點：你不用自己準備一台「一直開著的伺服器」，Google 幫你跑。這就是所謂的{" "}
        <b className="text-ink">Serverless（免伺服器）</b> 自動化。
      </div>
      <button type="button" className="btn btn-primary" onClick={onNext}>
        下一步：讓它跑一次給你看 →
      </button>
    </div>
  );
}

/* ---------- 步驟 2：站內模擬推播流程 ---------- */
const TRIGGERS = [
  { id: "time", icon: "⏰", label: "定時觸發", sub: "每天 9:00 彙整昨日案件" },
  { id: "event", icon: "⚡", label: "事件觸發", sub: "市民送出陳情表單時" },
];

function SimStep({ onNext }) {
  const [msg, setMsg] = useState("新報修案 A-1130512：中正路路燈不亮");
  const [trigger, setTrigger] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | running | done
  const [chat, setChat] = useState([]);
  const [pkt, setPkt] = useState({ left: "0%", opacity: 0 });

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
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 2 / 3 · 讓它跑一次
      </span>
      <h2 className="text-2xl font-bold text-ink">組一條「市民陳情 → 自動通知承辦」流程 ⚙️</h2>

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
              className={`gh-btn.5 ${trigger === t.id ? "!border-primary !bg-primarySoft text-primary" : ""}`}
            >
              {t.icon} {t.label}
              <span className="text-muted font-normal ml-1">· {t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 流程視覺 */}
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
          className="btn btn-accent"
          onClick={run}
          disabled={!trigger || status === "running"}
        >
          {status === "running" ? "GAS 執行中…" : "▶ 執行 GAS"}
        </button>
        {!trigger && <p className="text-muted text-sm mt-2">先選一個觸發方式，再按執行。</p>}
      </div>

      {/* 模擬聊天室 */}
      <div className="border-2 border-line rounded-[18px] bg-surface2 p-3.5 min-h-[90px]">
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
                  <div className="text-sm bg-surface border border-line rounded-lg px-3 py-1.5 inline-block mt-0.5">
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="button" className="btn btn-primary" disabled={status !== "done"} onClick={onNext}>
        {status === "done" ? "我懂流程了，看看真的怎麼設 →" : "先成功推播一次再繼續"}
      </button>
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
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 3 / 3 · 真的做一次
      </span>
      <h2 className="text-2xl font-bold text-ink">在真的 GAS 上做一個推播 📮</h2>
      <div className="callout">
        真的做起來也是點一點就好。下面是最小可行的做法（以 Discord Webhook 為例）：
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
              style={{ background: "var(--primary)" }}
            >
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="font-bold">
                {it.href ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer" className="text-primary">
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

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.gas} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>
        完成這一關 🎉
      </button>
    </div>
  );
}
