import { useEffect, useRef, useState } from "react";
import Level from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";

const PROCESS_MS = 900;

export default function ExeQueueLevel({ ctx }) {
  return (
    <Level ctx={ctx} badge={BADGES.exeQueue}
      done={{
        icon: "🏆",
        title: "最後一關完成，全線通關！",
        text: "你走完了整張部署地圖：從「網站怎麼被看到」到 GitHub Pages、API、自動推播、AI、自架、Docker，最後是 EXE 與工作佇列。恭喜你把部署的全貌都摸過一遍了！🎉",
        secondary: { label: "回地圖", onClick: () => ctx.goMap() },
        primary: { label: "回地圖 🏆", onClick: () => ctx.goMap() },
      }}
      steps={[
        ({ next }) => <ConceptStep onNext={next} />,
        ({ next }) => <QueueStep onNext={next} />,
        ({ finish }) => <ExeStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：概念（EXE + Queue 兩個收尾主題） ---------- */
function ConceptStep({ onNext }) {
  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 1 / 3 · 這是什麼</span>
      <h2 className="text-2xl font-bold text-ink">兩個常見的收尾：EXE 與工作佇列</h2>

      <div className="callout callout-info">
        <b className="text-ink">📦 EXE（執行檔）</b>：把程式和它需要的環境打包成一個可以<b className="text-ink">直接雙擊執行</b>的檔案，交給不懂技術的同仁，也不用他們安裝一堆東西。例如把「<b className="text-ink">批次公文改檔名、報表轉檔</b>」的小工具打包發給大家用。
      </div>
      <div className="callout">
        <b className="text-ink">🎢 Queue（工作佇列）</b>：當任務很多、或很耗時（例如<b className="text-ink">大量寄送活動／繳費通知</b>、產月報表），不要讓使用者站著等。把任務丟進<b className="text-ink">佇列排隊</b>，由背景的 worker 一個一個慢慢處理。好處是：使用者馬上得到回應、系統不會被瞬間塞爆、失敗還能重試。
      </div>
      <button type="button" className="btn btn-primary" onClick={onNext}>下一步：玩玩看工作佇列 →</button>
    </div>
  );
}

/* ---------- 步驟 2：工作佇列模擬器 ---------- */
function QueueStep({ onNext }) {
  const [tasks, setTasks] = useState([]);
  const counter = useRef(0);

  // 單一 worker：每 200ms 檢查一次；處理中的任務滿 PROCESS_MS 就完成，否則抓下一個排隊的來處理
  useEffect(() => {
    const iv = setInterval(() => {
      setTasks((ts) => {
        const proc = ts.find((t) => t.status === "processing");
        if (proc) {
          if (Date.now() - proc.startedAt >= PROCESS_MS) return ts.map((t) => (t.id === proc.id ? { ...t, status: "done" } : t));
          return ts;
        }
        const wi = ts.findIndex((t) => t.status === "waiting");
        if (wi >= 0) return ts.map((t, i) => (i === wi ? { ...t, status: "processing", startedAt: Date.now() } : t));
        return ts;
      });
    }, 200);
    return () => clearInterval(iv);
  }, []);

  const submit = () => {
    counter.current += 1;
    setTasks((ts) => [...ts, { id: counter.current, label: "#" + counter.current, status: "waiting" }]);
  };

  const waiting = tasks.filter((t) => t.status === "waiting").length;
  const processing = tasks.filter((t) => t.status === "processing").length;
  const done = tasks.filter((t) => t.status === "done").length;

  const chip = (t) => {
    if (t.status === "done") return "border-mint bg-successSoft text-success";
    if (t.status === "processing") return "border-primary bg-primarySoft text-primary animate-pulseRing";
    return "border-line bg-surface text-muted";
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 2 / 3 · 動手玩</span>
      <h2 className="text-2xl font-bold text-ink">送出一堆通知任務，看佇列怎麼消化 🎢</h2>
      <p className="text-muted text-sm">想像要一次寄大量通知：狂按「送出任務」，任務會先排隊，背景 worker 再一個一個處理 —— 民眾／承辦不用站著等。</p>

      <div className="text-center">
        <button type="button" className="btn btn-accent" onClick={submit}>➕ 送出任務</button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-center">
        {[["排隊中", waiting, "var(--muted)"], ["處理中", processing, "var(--primary)"], ["已完成", done, "var(--success)"]].map(([label, n, c]) => (
          <div key={label} className="card !p-3">
            <div className="text-2xl font-extrabold" style={{ color: c }}>{n}</div>
            <div className="text-xs text-muted">{label}</div>
          </div>
        ))}
      </div>

      {/* worker 狀態 */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <span className="text-xl">🤖</span> Worker：{processing > 0 ? "處理中…" : waiting > 0 ? "準備抓下一個" : "閒著（沒任務）"}
      </div>

      {/* 佇列視覺 */}
      <div className="border-2 border-line rounded-[18px] bg-surface2 p-3.5 min-h-[70px]">
        {tasks.length === 0 ? (
          <div className="text-muted text-sm text-center py-2">佇列是空的 —— 按上面的按鈕送出任務</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {tasks.map((t) => (
              <span key={t.id} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 text-xs font-bold ${chip(t)}`}>
                {t.status === "done" ? "✓" : t.status === "processing" ? "⏳" : "•"} {t.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <button type="button" className="btn btn-primary" disabled={done < 3} onClick={onNext}>
        {done >= 3 ? "我懂佇列了，看看 EXE →" : `再處理完 ${Math.max(0, 3 - done)} 個任務就能繼續`}
      </button>
    </div>
  );
}

/* ---------- 步驟 3：EXE 打包示意 + 最終測驗 ---------- */
function ExeStep({ onFinish }) {
  const [packed, setPacked] = useState(false);
  const [passed, setPassed] = useState(false);

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">步驟 3 / 3 · 收尾</span>
      <h2 className="text-2xl font-bold text-ink">把工具打包成一個 EXE 📦</h2>
      <p className="text-muted text-sm">把「你的程式」和「執行環境」打包成一個檔案，別人雙擊就能用，不必安裝任何東西。</p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="card text-center !p-4">
          <div className="text-3xl">📄</div>
          <div className="text-sm font-bold text-ink mt-1">你的程式</div>
          <div className="text-xs text-muted">＋ 執行環境</div>
        </div>
        <div className="text-2xl text-muted">→</div>
        <div className="card text-center !p-4" style={{ borderColor: packed ? "var(--mint)" : "var(--border)" }}>
          <div className="text-3xl">{packed ? "📦" : "❔"}</div>
          <div className="text-sm font-bold text-ink mt-1">{packed ? "my-tool.exe" : "還沒打包"}</div>
          <div className="text-xs text-muted">{packed ? "雙擊就能執行" : ""}</div>
        </div>
      </div>

      {!packed ? (
        <div className="text-center">
          <button type="button" className="btn btn-accent" onClick={() => setPacked(true)}>🔨 打包成 EXE</button>
        </div>
      ) : (
        <div className="callout" style={{ borderLeftColor: "var(--success)", background: "var(--success-soft)", color: "var(--success)" }}>
          <b>✅ 打包完成！</b> 你可以把 <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">my-tool.exe</code> 直接傳給別人，他雙擊就能用。
          <div className="text-muted text-xs mt-1 font-normal">（實務上常用 PyInstaller、pkg、Electron Builder 等工具來做。）</div>
        </div>
      )}

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.exeQueue} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!packed || !passed} onClick={onFinish}>完成整張地圖 🏆</button>
    </div>
  );
}
