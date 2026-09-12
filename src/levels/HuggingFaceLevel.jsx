import { useState } from "react";
import Level from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import Browser from "../components/Browser.jsx";
import { BADGES } from "../data/levels.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 超簡易「情感分析」：用關鍵字模擬一個 AI 模型（僅供教學示意）
const POS = [
  "好",
  "棒",
  "讚",
  "愛",
  "喜歡",
  "開心",
  "優",
  "推",
  "great",
  "good",
  "love",
  "happy",
  "nice",
  "讚讚",
];
const NEG = [
  "爛",
  "差",
  "討厭",
  "難過",
  "糟",
  "失望",
  "生氣",
  "雷",
  "bad",
  "hate",
  "sad",
  "angry",
  "terrible",
];

function analyzeSentiment(text) {
  const t = text.toLowerCase();
  let pos = 0,
    neg = 0;
  POS.forEach((w) => {
    if (t.includes(w)) pos++;
  });
  NEG.forEach((w) => {
    if (t.includes(w)) neg++;
  });
  if (pos === 0 && neg === 0) return { label: "中性", emoji: "😐", score: 0.5, color: "var(--muted)" };
  if (pos >= neg)
    return { label: "正面", emoji: "😊", score: Math.min(0.99, 0.6 + pos * 0.12), color: "var(--success)" };
  return { label: "負面", emoji: "😞", score: Math.min(0.99, 0.6 + neg * 0.12), color: "var(--danger)" };
}

export default function HuggingFaceLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.hfSpace}
      done={{
        icon: "🤗",
        title: "AI 應用上線達成！",
        text: "你已經看懂 AI 原生的部署方式：把模型或 App 交給 Hugging Face Spaces，它幫你 host 和跑，你只要一個網址就能分享互動式 AI。",
        secondary: { label: "回地圖", onClick: () => ctx.goMap() },
        primary: { label: "看看下一關 →", onClick: () => ctx.goMap() },
      }}
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
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">
        步驟 1 / 3 · 這是什麼
      </span>
      <h2 className="text-2xl font-bold text-ink">AI 原生 App 怎麼部署？認識 Hugging Face</h2>
      <div className="callout callout-info">
        <b className="text-ink">Hugging Face</b> 是 AI 界的大本營，放了很多現成的模型。它的{" "}
        <b className="text-ink">Spaces</b> 讓你把一個互動式 AI App（用 Gradio / Streamlit 寫）
        <b className="text-ink">一鍵部署</b>、直接拿到公開網址 —— 而且不用自己準備昂貴的 GPU 伺服器。
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ["🧠", "用現成模型", "不用從零訓練，站上挑一個來用"],
          ["🎛️", "Gradio 寫介面", "幾行 Python 就有輸入框＋按鈕"],
          ["🚀", "Spaces 幫你 host", "推上去就有網址，免顧伺服器"],
        ].map(([i, t, d]) => (
          <div key={t} className="card">
            <div className="text-3xl">{i}</div>
            <b className="text-ink text-sm">{t}</b>
            <p className="text-muted text-sm m-0">{d}</p>
          </div>
        ))}
      </div>
      <div className="callout">
        和第 2 關的 GitHub Pages 很像 —— 都是「把東西推上去，平台給你網址」。差別是 Spaces 還會幫你
        <b className="text-ink">跑後端運算（跑 AI 模型）</b>，這是純靜態的 GitHub Pages
        做不到的。行政上可用來做<b className="text-ink">民意/陳情文字的情緒分析、常見問答小幫手</b>等。
      </div>
      <div
        className="callout"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">⚠️ 公務提醒：</b>Spaces 屬<b className="text-ink">境外第三方平台</b>
        ，上傳的文字/資料會交給它處理。示範一律用去識別化或假資料，切勿上傳真實民眾個資或機敏公務資料。
      </div>
      <button type="button" className="btn btn-primary" onClick={onNext}>
        下一步：部署一個 AI Demo 來玩 →
      </button>
    </div>
  );
}

/* ---------- 步驟 2：模擬建立 Space + 玩 AI demo ---------- */
function SimStep({ onNext }) {
  const [phase, setPhase] = useState("create"); // create | building | live
  const [analyzedOnce, setAnalyzedOnce] = useState(false);

  const create = async () => {
    setPhase("building");
    await sleep(1100);
    setPhase("live");
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">
        步驟 2 / 3 · 部署來玩
      </span>
      <h2 className="text-2xl font-bold text-ink">建一個 Space，部署一個「民意情緒分析」AI</h2>

      {phase === "create" && (
        <Browser url="huggingface.co/new-space">
          <h3 className="mt-0 text-ink font-bold">Create a new Space</h3>
          <div className="mb-3.5">
            <label className="text-[13px] font-bold block mb-1.5">Space name</label>
            <input className="gh-input" value="opinion-sentiment" readOnly />
          </div>
          <div className="mb-3.5">
            <label className="text-[13px] font-bold block mb-1.5">Select the SDK</label>
            <div className="flex flex-wrap gap-2">
              <span className="gh-btn gh-btn-selected">🎛️ Gradio</span>
              <span className="gh-btn opacity-60">Streamlit</span>
              <span className="gh-btn opacity-60">Static</span>
            </div>
          </div>
          <div className="mb-3.5">
            <label className="text-[13px] font-bold block mb-1.5">Hardware</label>
            <span className="pill bg-successSoft text-success">CPU basic · 免費</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-accentDark bg-accentSoft py-1 px-3 rounded-full mb-2.5">
            👉 按「Create Space」，平台就會幫你建置
          </div>
          <div>
            <button type="button" className="gh-btn gh-btn-green animate-pulseRing" onClick={create}>
              Create Space
            </button>
          </div>
        </Browser>
      )}

      {phase === "building" && (
        <Browser url="huggingface.co/spaces/你/opinion-sentiment">
          <div className="text-center py-10 text-muted">
            <div className="text-4xl mb-2 animate-pop">⚙️</div>
            Building… 正在安裝環境、啟動你的 AI App
          </div>
        </Browser>
      )}

      {phase === "live" && (
        <>
          <div
            className="callout"
            style={{
              borderLeftColor: "var(--success)",
              background: "var(--success-soft)",
              color: "var(--success)",
            }}
          >
            <b>✅ 上線了！</b> 你的 Space 有網址了：
            <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line ml-1">
              你.hf.space/opinion-sentiment
            </code>
          </div>
          <SentimentDemo onAnalyzed={() => setAnalyzedOnce(true)} />
        </>
      )}

      <button type="button" className="btn btn-primary" disabled={!analyzedOnce} onClick={onNext}>
        {analyzedOnce ? "我玩過了，看看真的怎麼做 →" : "先部署並試玩一次 AI"}
      </button>
    </div>
  );
}

function SentimentDemo({ onAnalyzed }) {
  const [text, setText] = useState("承辦人員態度親切，處理很快，謝謝！");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (loading) return;
    setLoading(true);
    setResult(null);
    await sleep(600);
    setResult(analyzeSentiment(text));
    setLoading(false);
    onAnalyzed();
  };

  return (
    <div className="border-2 border-line rounded-[18px] bg-surface2 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🤗</span>
        <b className="text-ink">民意情緒分析 Demo</b>
        <span className="pill bg-primarySoft text-primary">Gradio</span>
      </div>
      <label className="text-[13px] font-bold block mb-1.5">
        輸入一則民眾回饋（示範用去識別化文字），AI 幫你判斷情緒
      </label>
      <textarea
        className="gh-input gh-input-sans resize-none"
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="button" className="btn btn-accent btn-md mt-2.5" onClick={run} disabled={loading}>
        {loading ? "分析中…" : "分析 Analyze"}
      </button>

      {result && (
        <div className="mt-3 bg-surface border border-line rounded-[12px] p-3.5 animate-pop">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{result.emoji}</span>
            <div>
              <div className="font-extrabold text-ink" style={{ color: result.color }}>
                {result.label}
              </div>
              <div className="text-xs text-muted">信心 {(result.score * 100).toFixed(0)}%</div>
            </div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-surface2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${result.score * 100}%`, background: result.color }}
            />
          </div>
        </div>
      )}
      <p className="text-muted text-xs mt-2">（這裡是教學用的簡化示意；真的 Space 會跑真正的 AI 模型。）</p>
    </div>
  );
}

/* ---------- 步驟 3：真的做一次 + 測驗 ---------- */
function RealStep({ onFinish }) {
  const [opened, setOpened] = useState(false);
  const [passed, setPassed] = useState(false);

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">
        步驟 3 / 3 · 真的做一次
      </span>
      <h2 className="text-2xl font-bold text-ink">去真的 Hugging Face 逛一圈 🌍</h2>
      <div className="callout">
        最快的方式：找一個現成的 Space 直接玩，或按「Duplicate this
        Space」複製一份成自己的。之後想自己做，就建一個 Gradio Space、把{" "}
        <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">app.py</code>{" "}
        推上去即可。
      </div>

      <div className="grid gap-2.5">
        <a
          href="https://huggingface.co/spaces"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="gh-btn gh-btn-row"
        >
          <span>🔗 逛逛 Hugging Face Spaces</span>
          <span>↗</span>
        </a>
        <a
          href="https://huggingface.co/new-space"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="gh-btn gh-btn-row"
        >
          <span>🔗 建立我的第一個 Space</span>
          <span>↗</span>
        </a>
      </div>
      {opened && (
        <p className="text-success text-sm font-bold">
          ✓ 開好了！挑一個 Space 玩玩看，或按 Duplicate 複製成自己的。
        </p>
      )}

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.huggingface} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>
        完成這一關 🎉
      </button>
    </div>
  );
}
