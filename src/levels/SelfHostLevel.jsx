import { useState } from "react";
import StepBar from "../components/StepBar.jsx";
import Quiz from "../components/Quiz.jsx";
import DoneScreen from "../components/DoneScreen.jsx";
import { BADGES } from "../data/levels.js";

const CMD = "python -m http.server 8000";

export default function SelfHostLevel({ ctx }) {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const next = () => setStep((s) => s + 1);

  if (finished) {
    return (
      <DoneScreen
        icon="🖥️"
        title="自架：內網與對外的差別"
        badge={BADGES.selfHost}
        text="關鍵不是技術有多難，而是：只給機關內部用，設定好就能跑；要讓民眾連得到，就必須先通過資安評估與核准，並交由資訊單位在受管控的環境提供。"
        secondary={{ label: "回地圖", onClick: () => ctx.goMap() }}
        primary={{ label: "看看下一關 →", onClick: () => ctx.goMap() }}
      />
    );
  }

  return (
    <div>
      <StepBar current={step} total={3} doneUntil={step - 1} />
      <div className="card">
        {step === 0 && <ConceptStep onNext={next} />}
        {step === 1 && <ChallengeStep onNext={next} />}
        {step === 2 && <RealStep onFinish={() => { setFinished(true); ctx.complete(BADGES.selfHost); }} />}
      </div>
    </div>
  );
}

/* ---------- 步驟 1：概念 ---------- */
function ConceptStep({ onNext }) {
  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 1 / 3 · 這是什麼</span>
      <h2 className="text-2xl font-bold text-ink">「自架」＝ 用機關自己的電腦當伺服器</h2>
      <div className="callout callout-info">
        前面都用別人的平台（GitHub、HF）幫你 host。<b className="text-ink">自架（Self-host）</b>則是：在<b className="text-ink">機關自己的電腦</b>上跑一個 server。
        它最大的價值是 —— <b className="text-ink">資料不出機關</b>，適合放不能公開的內部資料。
      </div>
      <div className="callout" style={{ borderLeftColor: "var(--sun)", background: "color-mix(in srgb, var(--sun) 14%, var(--surface))" }}>
        <b className="text-ink">🏢 這一關的重點：</b>「只給同仁在內網用」和「讓民眾從外面連」是<b className="text-ink">完全不同的兩件事</b>。
        前者設定好就能跑；後者是<b className="text-ink">機關層級的決定</b>，要走資安評估與核准，通常由資訊單位處理。
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["🔌", "Port（連接埠）", "server 會「監聽」一個號碼，例如 8000，像電腦裡的門牌號"],
          ["🧱", "防火牆", "預設擋掉外來連線，要開放這個 port 才連得進來"],
          ["🏢", "內網 vs 對外", "內網＝只有機關內連得到；對外＝民眾也連得到"],
          ["📋", "資安評估與核准", "對外提供服務要先經機關同意 —— 這不是技術問題，是程序"],
        ].map(([i, t, d]) => (
          <div key={t} className="card"><div className="text-3xl">{i}</div><b className="text-ink text-sm">{t}</b><p className="text-muted text-sm m-0">{d}</p></div>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={onNext}>下一步：試試看誰連得上 →</button>
    </div>
  );
}

// 提到模組層級：避免每次 render 重新建立元件型別導致重新掛載（會讓焦點遺失）
function Toggle({ on, onToggle, icon, title, desc }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={title}
      onClick={onToggle}
      className={`flex items-center gap-3 w-full text-left py-3 px-4 border-2 rounded-[14px] transition-all ${on ? "border-mint bg-successSoft" : "border-line bg-surface"}`}>
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <div className="font-bold text-ink">{title}</div>
        <div className="text-[13px] text-muted">{desc}</div>
      </div>
      <span className="text-xs font-extrabold shrink-0" style={{ color: on ? "var(--success)" : "var(--muted)" }}>{on ? "已完成" : "未完成"}</span>
      <span className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${on ? "bg-mint" : "bg-surface2 border border-line"}`}>
        <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

/* ---------- 步驟 2：內網連得上 vs 對外連得上 ---------- */
function ChallengeStep({ onNext }) {
  const [server, setServer] = useState(false);
  const [firewall, setFirewall] = useState(false);
  const [approval, setApproval] = useState(false);
  const [result, setResult] = useState(null); // { kind: ok|warn|err, text }
  const [innerWin, setInnerWin] = useState(false);

  const clear = () => setResult(null);

  const tryInternal = () => {
    if (!server) return setResult({ kind: "err", text: "❌ 連不上 —— 這台電腦根本沒在跑 server（沒人接電話）。" });
    if (!firewall) return setResult({ kind: "err", text: "❌ 連線逾時 —— 這台電腦的防火牆擋住了 8000，要先開放這個 port。" });
    setInnerWin(true);
    setResult({ kind: "ok", text: "✅ 同仁從機關內網連上了！資料完全沒有離開機關 —— 這正是內部小工具最合適的做法。" });
  };

  const tryExternal = () => {
    if (!server || !firewall) return setResult({ kind: "err", text: "❌ 內網都還連不上了，先把上面兩項做好再說。" });
    if (!approval) return setResult({ kind: "warn", text: "⚠️ 技術上是通了，但「對外提供服務」必須先經機關資安評估與核准 —— 這一步不是技術問題，是程序問題。未經核准就對外開放，可能違反機關資安規範。" });
    setResult({ kind: "ok", text: "✅ 完成核准後，才由資訊單位協助在受管控的環境（機房／DMZ）對外提供服務，並負責後續更新與監控。" });
  };

  const tone = { ok: "bg-successSoft text-success", warn: "text-ink", err: "bg-dangerSoft text-danger" };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 2 / 3 · 動手挑戰</span>
      <h2 className="text-2xl font-bold text-ink">誰連得上你的內部工具？ 🎯</h2>
      <p className="text-muted text-sm">先把下面幾項打開，再分別試試「同仁從內網連」和「民眾從外網連」，看差別在哪。</p>

      <div className="grid gap-2.5">
        <Toggle on={server} onToggle={() => { setServer(!server); clear(); }} icon="🖥️" title="在機關電腦上啟動 server，監聽 port 8000" desc="你的電腦開始『接電話』" />
        <Toggle on={firewall} onToggle={() => { setFirewall(!firewall); clear(); }} icon="🧱" title="開放這台電腦防火牆的 port 8000" desc="允許連線進入這個 port" />
        <Toggle on={approval} onToggle={() => { setApproval(!approval); clear(); }} icon="📋" title="通過機關資安評估與核准" desc="只有要「對外」提供服務才需要 —— 這是程序，不是技術" />
      </div>

      <div className="flex flex-wrap gap-2.5 justify-center">
        <button type="button" className="btn btn-accent !py-2.5 !px-5 !text-sm" onClick={tryInternal}>👩‍💼 同仁從內網連線</button>
        <button type="button" className="btn btn-ghost !py-2.5 !px-5 !text-sm" onClick={tryExternal}>🧑‍💻 民眾從外網連線</button>
      </div>

      {result && (
        <div className={`py-3 px-4 rounded-[14px] text-sm font-bold ${tone[result.kind]}`}
          style={result.kind === "warn" ? { background: "color-mix(in srgb, var(--sun) 18%, var(--surface))" } : undefined}>
          {result.text}
        </div>
      )}

      <button type="button" className="btn btn-primary" disabled={!innerWin} onClick={onNext}>
        {innerWin ? "下一步：在自己電腦實際跑一個 →" : "先讓「同仁從內網」成功連上一次"}
      </button>
    </div>
  );
}

/* ---------- 步驟 3：真的在自己電腦跑一個 server ---------- */
function RealStep({ onFinish }) {
  const [copied, setCopied] = useState(false);
  const [passed, setPassed] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(CMD); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* 忽略 */ }
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 3 / 3 · 真的跑一個</span>
      <h2 className="text-2xl font-bold text-ink">在你自己的電腦跑一個 server 🚀</h2>
      <div className="callout">
        最安全的體驗：只在<b className="text-ink">自己電腦（localhost）</b>跑，完全不對外。只要有 Python，一行指令就行。
        到你要分享的資料夾，打開終端機／命令提示字元，執行：
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-bold">終端機指令</span>
          <button type="button" className="gh-btn !py-1.5" onClick={copy}>{copied ? "✓ 已複製" : "📋 複製"}</button>
        </div>
        <pre className="font-mono text-sm bg-surface2 border border-line rounded-[10px] p-3.5 overflow-x-auto whitespace-pre">{"$ " + CMD}</pre>
      </div>

      <div className="callout callout-info">
        然後開瀏覽器前往 <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">http://localhost:8000</code> —— 你就在自己的電腦上跑起一個網站伺服器了！
        （<code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">localhost</code> ＝ 這台電腦自己）
      </div>

      <hr className="border-0 border-t border-line my-2" />

      <Quiz
        question="你的內部小工具在內網跑得好好的，長官說「乾脆開放給民眾用」。你該怎麼回應？"
        options={[
          { text: "對外提供服務要先經資安評估與核准，並交由資訊單位在受管控環境提供", correct: true },
          { text: "直接把機關防火牆全部打開就好", correct: false },
          { text: "把電腦搬回家接網路，比較快", correct: false },
        ]}
        explainOk="正解！內網自用是你的權責範圍；一旦對外，就牽涉資安、個資、維運責任與長期維護 —— 那是機關層級的決定，要走正式程序、由資訊單位承接。"
        explainNo="再想想：對外開放不是把防火牆打開就好，它牽涉資安責任與長期維運，屬於機關層級的決定。"
        onCorrect={() => setPassed(true)}
      />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>完成這一關 🎉</button>
    </div>
  );
}
