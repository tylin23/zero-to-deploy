import { useState } from "react";
import StepBar from "../components/StepBar.jsx";
import Quiz from "../components/Quiz.jsx";
import DoneScreen from "../components/DoneScreen.jsx";
import { BADGES } from "../data/levels.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const DOCKERFILE = `# 以官方 Node 環境當基底 —— 把「環境」一起打包
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install          # 套件也裝進容器裡
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]`;

export default function DockerLevel({ ctx }) {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const next = () => setStep((s) => s + 1);

  if (finished) {
    return (
      <DoneScreen
        icon="🐳"
        title="打包貨櫃達成！"
        badge={BADGES.docker}
        text="你懂了 Docker 的核心：把 App 和它需要的環境一起打包成 image，任何裝了 Docker 的機器都能跑出一樣的結果，徹底解決「在我電腦可以跑」的問題。"
        secondary={{ label: "回地圖", onClick: () => ctx.goMap() }}
        primary={{ label: "看看最後一關 →", onClick: () => ctx.goMap() }}
      />
    );
  }

  return (
    <div>
      <StepBar current={step} total={3} doneUntil={step - 1} />
      <div className="card">
        {step === 0 && <ConceptStep onNext={next} />}
        {step === 1 && <BuildStep onNext={next} />}
        {step === 2 && <RealStep onFinish={() => { setFinished(true); ctx.complete(BADGES.docker); }} />}
      </div>
    </div>
  );
}

/* ---------- 步驟 1：概念 ---------- */
function ConceptStep({ onNext }) {
  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 1 / 3 · 這是什麼</span>
      <h2 className="text-2xl font-bold text-ink">Docker：把 App 和「環境」一起打包</h2>
      <div className="callout callout-info">
        有沒有遇過「在我電腦可以跑，在你那邊卻壞掉」？多半是因為兩台電腦的<b className="text-ink">環境不一樣</b>（版本、套件、設定）。<b className="text-ink">Docker</b> 把 App 和它需要的整套環境一起裝進一個<b className="text-ink">容器（container）</b>，就像貨櫃：不管搬到哪艘船，裡面都一模一樣。
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ["📝", "Dockerfile", "一張「打包清單」，寫明要什麼環境"],
          ["📦", "Image（映像檔）", "照清單打包好的成品，可以複製分送"],
          ["🐳", "Container（容器）", "把 image 跑起來的執行實例"],
        ].map(([i, t, d]) => (
          <div key={t} className="card"><div className="text-3xl">{i}</div><b className="text-ink text-sm">{t}</b><p className="text-muted text-sm m-0">{d}</p></div>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={onNext}>下一步：自己打包一個來跑 →</button>
    </div>
  );
}

/* ---------- 步驟 2：打包 image，在不同機器上跑 ---------- */
function BuildStep({ onNext }) {
  const [includeEnv, setIncludeEnv] = useState(false);
  const [phase, setPhase] = useState("pack"); // pack | building | built
  const [runResult, setRunResult] = useState(null);
  const [win, setWin] = useState(false);

  const reset = () => { setPhase("pack"); setRunResult(null); };

  const build = async () => {
    setPhase("building");
    await sleep(1000);
    setPhase("built");
  };

  const run = () => {
    if (includeEnv) {
      setRunResult({ ok: true, text: "✅ 在兩台機器上都跑起來了，而且結果一模一樣！因為環境被一起打包在 image 裡。" });
      setWin(true);
    } else {
      setRunResult({ ok: false, text: "❌ 同事那台乾淨電腦沒裝 Node，容器裡也沒有 → 跑不起來。這就是「在我電腦可以跑、你那邊壞掉」。把環境一起打包再試一次！" });
    }
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 2 / 3 · 動手打包</span>
      <h2 className="text-2xl font-bold text-ink">組一個 image，搬到別台機器跑 📦</h2>

      <div className="border-2 border-line rounded-[18px] bg-surface2 p-4 space-y-2">
        <div className="text-[13px] font-extrabold text-muted">要打包進容器的東西：</div>
        <div className="flex items-center gap-2 text-sm"><span className="text-success">✓</span> 你的程式碼 <code className="font-mono text-xs bg-surface px-1.5 py-0.5 rounded border border-line">server.js</code></div>
        <label className="flex items-center gap-2.5 py-2.5 px-3 border-2 rounded-xl cursor-pointer bg-surface transition-colors"
          style={{ borderColor: includeEnv ? "var(--mint)" : "var(--border)" }}>
          <input type="checkbox" checked={includeEnv} onChange={(e) => { setIncludeEnv(e.target.checked); reset(); }} style={{ width: 20, height: 20, accentColor: "var(--mint)" }} />
          <div>
            <div className="font-bold text-ink text-sm">把「環境」也打包進去</div>
            <div className="text-xs text-muted">Node 18 執行環境 ＋ npm 套件（關鍵！）</div>
          </div>
        </label>
      </div>

      {phase !== "built" && (
        <div className="text-center">
          <button type="button" className="btn btn-accent" onClick={build} disabled={phase === "building"}>
            {phase === "building" ? "docker build 中…" : "🔨 docker build（打包成 image）"}
          </button>
        </div>
      )}

      {phase === "built" && (
        <>
          <div className="callout" style={{ borderLeftColor: "var(--success)", background: "var(--success-soft)", color: "var(--success)" }}>
            <b>✅ Image 打包完成：</b><code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line ml-1">my-app:1.0</code>
            {includeEnv ? "（已含環境）" : "（未含環境）"}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[["🖥️", "同事的乾淨電腦"], ["☁️", "雲端伺服器"]].map(([i, t]) => (
              <div key={t} className="card text-center !p-4">
                <div className="text-3xl">{i}</div>
                <div className="text-sm font-bold text-ink mt-1">{t}</div>
                <div className="text-xs text-muted">裝了 Docker</div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button type="button" className="btn btn-accent" onClick={run}>🐳 在兩台機器上 docker run</button>
          </div>

          {runResult && (
            <div className={`py-3 px-4 rounded-[14px] text-sm font-bold ${runResult.ok ? "bg-successSoft text-success" : "bg-dangerSoft text-danger"}`}>
              {runResult.text}
            </div>
          )}
        </>
      )}

      <button type="button" className="btn btn-primary" disabled={!win} onClick={onNext}>
        {win ? "太神奇了，看看真的怎麼寫 →" : "先成功在別台機器跑起來"}
      </button>
    </div>
  );
}

/* ---------- 步驟 3：真的做一次 + 測驗 ---------- */
function RealStep({ onFinish }) {
  const [copied, setCopied] = useState(false);
  const [passed, setPassed] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(DOCKERFILE); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* 忽略 */ }
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 3 / 3 · 真的做一次</span>
      <h2 className="text-2xl font-bold text-ink">真的寫一個 Dockerfile 🐳</h2>
      <div className="callout">
        先安裝 <a href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener noreferrer" className="text-primary">Docker Desktop ↗</a>，在專案根目錄放一個叫 <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">Dockerfile</code> 的檔案，內容像這樣：
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-bold">Dockerfile</span>
          <button type="button" className="gh-btn !py-1.5" onClick={copy}>{copied ? "✓ 已複製" : "📋 複製"}</button>
        </div>
        <pre className="font-mono text-[12.5px] bg-surface2 border border-line rounded-[10px] p-3.5 overflow-x-auto whitespace-pre">{DOCKERFILE}</pre>
      </div>

      <div>
        <div className="text-[13px] font-bold mb-1.5">然後在終端機執行這兩行：</div>
        <pre className="font-mono text-[13px] bg-surface2 border border-line rounded-[10px] p-3.5 overflow-x-auto whitespace-pre">{"$ docker build -t my-app:1.0 .   # 打包成 image\n$ docker run -p 3000:3000 my-app:1.0  # 把容器跑起來"}</pre>
      </div>

      <hr className="border-0 border-t border-line my-2" />

      <Quiz
        question="Docker 最主要幫你解決什麼問題？"
        options={[
          { text: "把 App 和它需要的環境一起打包，避免「我電腦能跑、你那邊壞掉」", correct: true },
          { text: "讓網頁的顏色變好看", correct: false },
          { text: "自動幫你買一台伺服器", correct: false },
        ]}
        explainOk="正是！Docker 把環境一起帶著走，任何裝了 Docker 的機器都能跑出一致結果。這也是雲端部署超常用它的原因。"
        explainNo="回想剛剛的互動：沒把環境打包，換台機器就壞了。Docker 就是要解決這個。"
        onCorrect={() => setPassed(true)}
      />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>完成這一關 🎉</button>
    </div>
  );
}
