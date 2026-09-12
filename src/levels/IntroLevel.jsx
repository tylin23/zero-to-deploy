import { useRef, useState } from "react";
import StepBar from "../components/StepBar.jsx";
import Quiz from "../components/Quiz.jsx";
import DoneScreen from "../components/DoneScreen.jsx";
import { BADGES } from "../data/levels.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function IntroLevel({ ctx }) {
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const next = () => setStep((s) => s + 1);

  if (finished) {
    return (
      <DoneScreen
        icon="🧭"
        title="第一關完成！"
        badge={BADGES.concept}
        text="你已經懂了核心概念：部署 = 把檔案放到別人連得到的電腦上。接下來，我們用真正的服務「GitHub Pages」把它做出來。"
        secondary={{ label: "回地圖", onClick: () => ctx.goMap() }}
        primary={{ label: "前往 GitHub Pages 關 →", onClick: () => ctx.navigate("#/level/github-pages") }}
      />
    );
  }

  return (
    <div className="card space-y-4">
      <StepBar current={step} total={3} doneUntil={step - 1} />
      {step === 0 && <ConceptStep onNext={next} />}
      {step === 1 && (
        <div className="space-y-4">
          <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">第二步 · 檢查一下</span>
          <Quiz
            question="為什麼不能只把網頁放在「自己的筆電」上就好？"
            options={[
              { text: "因為筆電會關機、會睡眠，別人不一定連得到", correct: true },
              { text: "因為筆電不能開網頁", correct: false },
              { text: "因為 HTML 只能在伺服器打開", correct: false },
            ]}
            explainOk="沒錯！要「一直開著、有固定網址」，別人才隨時看得到 —— 這就是為什麼我們需要部署到伺服器 / 託管服務。"
            explainNo="再想想：關鍵在於「別人能不能隨時連到你的電腦」。"
            onCorrect={() => setTimeout(next, 900)}
          />
        </div>
      )}
      {step === 2 && <DeployStep onDone={() => { setFinished(true); ctx.complete(BADGES.concept); }} />}
    </div>
  );
}

function ConceptStep({ onNext }) {
  const [left, setLeft] = useState("0%");
  const [emoji, setEmoji] = useState("📨");
  const [opacity, setOpacity] = useState(0);
  const [log, setLog] = useState("👉 按「播放」看看資料怎麼跑");
  const playing = useRef(false);

  const play = async () => {
    if (playing.current) return;
    playing.current = true;
    const send = async (e, l, msg) => {
      setEmoji(e); setOpacity(1); setLeft("0%"); setLog(msg);
      await sleep(30); setLeft(l); await sleep(1000);
    };
    await send("📨", "88%", "① 瀏覽器送出請求：「我要看這個網頁」");
    await send("📄", "0%", "② 伺服器回傳網頁檔案（HTML/CSS/JS）");
    setOpacity(0);
    setLog("③ 瀏覽器把檔案畫成畫面 → 你就看到網站了！🎉");
    playing.current = false;
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">第一步 · 概念</span>
      <h2 className="text-2xl font-bold text-ink">民眾打開你做的「活動公告頁」時，發生了什麼事？</h2>
      <p className="text-muted text-sm">情境：你想把一頁「里民活動公告」放上網，讓民眾查得到。點按鈕看「瀏覽器 ↔ 伺服器」的對話：</p>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2.5">
        <Node emoji="💻" label="你的瀏覽器" sub="使用者 / 前端" />
        <div className="relative h-[60px] max-sm:rotate-90">
          <div className="absolute top-1/2 left-0 right-0 h-1 rounded-full" style={{ background: "var(--track)" }} />
          <div className="absolute top-1/2 -translate-y-1/2 text-2xl transition-[left,opacity] duration-[900ms]" style={{ left, opacity }}>{emoji}</div>
        </div>
        <Node emoji="🖥️" label="伺服器" sub="一直開著的電腦" />
      </div>

      <p className="callout callout-info min-h-[1.2em]">{log}</p>
      <button type="button" className="btn btn-accent" onClick={play}>▶ 播放</button>

      <div className="callout">
        所以「<b className="text-ink">部署（Deploy）</b>」就是：把你做好的網頁檔案（例如那頁活動公告），放到一台「一直開著、大家都連得到」的電腦（伺服器）上，民眾才看得到。也因為是放到別人連得到的地方，<b className="text-ink">上傳前要先確認這份內容可以對外公開</b>。
      </div>
      <button type="button" className="btn btn-primary" onClick={onNext}>我懂了，下一步 →</button>
    </div>
  );
}

function Node({ emoji, label, sub }) {
  return (
    <div className="text-center py-4 px-3 rounded-[22px] border-2 border-line bg-surface" style={{ boxShadow: "0 5px 0 var(--border)" }}>
      <span className="text-[42px] block">{emoji}</span>
      <div className="font-extrabold mt-1.5">{label}</div>
      <div className="text-xs text-muted">{sub}</div>
    </div>
  );
}

function DeployStep({ onDone }) {
  const [picked, setPicked] = useState(false);
  const [over, setOver] = useState(false);
  const [filled, setFilled] = useState(false);

  const place = () => {
    if (filled) return;
    setFilled(true);
    setTimeout(onDone, 900);
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">第三步 · 動手試試</span>
      <h2 className="text-2xl font-bold text-ink">把你的網頁「放上」伺服器</h2>
      <p className="text-muted text-sm">把 index.html 拖到伺服器上（手機可以用點的：先點檔案，再點伺服器）</p>

      <div className="text-center mb-1.5">
        {!filled && (
          <span
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", "file")}
            onClick={() => setPicked((p) => !p)}
            className={`inline-flex items-center gap-2 py-3 px-[18px] rounded-[14px] bg-surface border-2 font-bold cursor-grab select-none ${picked ? "border-accent animate-pulseRing" : "border-line"}`}
            style={{ boxShadow: "0 5px 0 var(--border)" }}
          >📄 index.html</span>
        )}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); place(); }}
        onClick={() => { if (picked) place(); }}
        className={`border-[3px] border-dashed rounded-[22px] p-6 text-center font-semibold transition-all
          ${filled ? "border-solid border-mint bg-successSoft text-success font-extrabold"
            : over ? "border-primary bg-primarySoft text-primary"
            : picked ? "border-accent bg-surface text-muted animate-pulseRing" : "border-line bg-surface text-muted"}`}
      >
        {filled ? (
          <span>✅ 上線了！你的活動公告頁現在在：<br /><code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">https://你的機關.example.gov.tw/活動公告</code></span>
        ) : "🖥️  這是一台開著的伺服器 — 把檔案放進來"}
      </div>
    </div>
  );
}
