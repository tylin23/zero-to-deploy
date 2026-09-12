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
        title="自架伺服器達成！"
        badge={BADGES.selfHost}
        text="你懂了自架的全貌：跑一個 server 監聽 port、開防火牆、對外要 public IP 和 port forwarding。完全掌控、但也要自己顧。之後有 Docker 可以讓這件事更好管理。"
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
      <h2 className="text-2xl font-bold text-ink">「自架」就是把自己的電腦當伺服器</h2>
      <div className="callout callout-info">
        前面都用別人的平台（GitHub、HF）幫你 host。<b className="text-ink">自架（Self-host）</b>則是：在<b className="text-ink">你自己的電腦</b>跑一個 server，自己扛起「那台一直開著的電腦」的角色。好處是完全掌控、免費；代價是要自己維護、電腦得一直開著、還要處理連線與安全。
      </div>
      <div className="callout" style={{ borderLeftColor: "var(--sun)", background: "color-mix(in srgb, var(--sun) 14%, var(--surface))" }}>
        <b className="text-ink">🏢 行政情境：</b>做一個「只給同仁用、資料不出機關」的內部查詢／登記小工具時，架在<b className="text-ink">機關內網（localhost/內網）</b>反而比丟到境外平台更能保護不可公開的資料 —— 但一旦要對外開放，就得先經機關資安評估與核准。
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["🔌", "Port（連接埠）", "server 會「監聽」一個號碼，例如 8000。像電腦裡的門牌號"],
          ["🧱", "防火牆", "預設會擋掉外來連線，要開放你的 port 才進得來"],
          ["🌍", "Public IP", "對外的地址，別人要靠它才找得到你家網路"],
          ["🔀", "Port forwarding", "家用路由器要把外部連線『轉』給你那台電腦"],
        ].map(([i, t, d]) => (
          <div key={t} className="card"><div className="text-3xl">{i}</div><b className="text-ink text-sm">{t}</b><p className="text-muted text-sm m-0">{d}</p></div>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={onNext}>下一步：試著讓外面連進來 →</button>
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
      <span className="text-xs font-extrabold shrink-0" style={{ color: on ? "var(--success)" : "var(--muted)" }}>{on ? "已開啟" : "未開啟"}</span>
      <span className={`w-12 h-7 rounded-full relative transition-colors shrink-0 ${on ? "bg-mint" : "bg-surface2 border border-line"}`}>
        <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

/* ---------- 步驟 2：讓訪客連進來的挑戰 ---------- */
function ChallengeStep({ onNext }) {
  const [server, setServer] = useState(false);
  const [firewall, setFirewall] = useState(false);
  const [forward, setForward] = useState(false);
  const [result, setResult] = useState(null); // { ok, text }
  const [win, setWin] = useState(false);

  const tryConnect = () => {
    let r;
    if (!server) r = { ok: false, text: "❌ 連線被拒 —— 你的電腦根本沒在跑 server（沒人接電話）。" };
    else if (!firewall) r = { ok: false, text: "❌ 連線逾時 —— 防火牆把外來連線擋掉了，要開放 8080。" };
    else if (!forward) r = { ok: false, text: "❌ 找不到你 —— 家用路由器不知道要把外部連線轉給哪台電腦（需要 port forwarding）。" };
    else { r = { ok: true, text: "✅ 訪客成功連到 http://203.0.113.5:8080，看到你的網站了！" }; setWin(true); }
    setResult(r);
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 2 / 3 · 動手挑戰</span>
      <h2 className="text-2xl font-bold text-ink">讓一個外部訪客連到你的電腦 🎯</h2>
      <p className="text-muted text-sm">把下面三個開關打開，再按「訪客嘗試連線」。缺哪一步，訪客就會卡在哪 —— 從錯誤訊息學會每一步在做什麼。</p>

      <div className="grid gap-2.5">
        <Toggle on={server} onToggle={() => { setServer(!server); setResult(null); }} icon="🖥️" title="啟動 server，監聽 port 8080" desc="你的電腦開始『接電話』" />
        <Toggle on={firewall} onToggle={() => { setFirewall(!firewall); setResult(null); }} icon="🧱" title="防火牆開放 port 8080" desc="允許外來連線進入這個 port" />
        <Toggle on={forward} onToggle={() => { setForward(!forward); setResult(null); }} icon="🔀" title="路由器設定 port forwarding" desc="把對外的連線轉給你這台電腦" />
      </div>

      <div className="text-center">
        <button type="button" className="btn btn-accent" onClick={tryConnect}>🧑‍💻 訪客嘗試連線</button>
      </div>

      {result && (
        <div className={`py-3 px-4 rounded-[14px] text-sm font-bold ${result.ok ? "bg-successSoft text-success" : "bg-dangerSoft text-danger"}`}>
          {result.text}
        </div>
      )}

      <button type="button" className="btn btn-primary" disabled={!win} onClick={onNext}>
        {win ? "成功了！看看在自己電腦怎麼實際做 →" : "先讓訪客成功連上一次"}
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
        最安全、最簡單的自架體驗：只在<b className="text-ink">自己電腦（localhost）</b>跑，不對外開放。只要有 Python，一行指令就行。到你要分享的資料夾，打開終端機／命令提示字元，執行：
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-bold">終端機指令</span>
          <button type="button" className="gh-btn !py-1.5" onClick={copy}>{copied ? "✓ 已複製" : "📋 複製"}</button>
        </div>
        <pre className="font-mono text-sm bg-surface2 border border-line rounded-[10px] p-3.5 overflow-x-auto whitespace-pre">{"$ " + CMD}</pre>
      </div>

      <div className="callout callout-info">
        然後打開瀏覽器，前往 <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">http://localhost:8000</code> —— 你就在自己的電腦上跑起一個網站伺服器了！（<code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">localhost</code> = 這台電腦自己）
      </div>

      <hr className="border-0 border-t border-line my-2" />

      <Quiz
        question="你在自己電腦跑起了 localhost:8000，但同學在他家連不到這個網址。為什麼？"
        options={[
          { text: "localhost 只代表『這台電腦自己』；要讓別人連到，需要對外 IP＋開放防火牆/port forwarding", correct: true },
          { text: "因為 Python 不能做伺服器", correct: false },
          { text: "因為 localhost 一定要收費才能用", correct: false },
        ]}
        explainOk="正解！localhost / 127.0.0.1 永遠指『本機自己』。要對外，就得處理第 2 關那三件事（public IP、防火牆、port forwarding）—— 這也是為什麼很多人乾脆用託管平台。"
        explainNo="回想一下：localhost 是『這台電腦自己』的意思，外面的人本來就到不了。"
        onCorrect={() => setPassed(true)}
      />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>完成這一關 🎉</button>
    </div>
  );
}
