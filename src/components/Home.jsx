import { useProgress } from "../state/progress.jsx";
import { totalReady } from "../data/levels.js";
import { TERMS } from "../data/terms.js";

// 首頁＝課程總覽 Hub：說清楚「給誰、多久、有哪幾個部分」，並讓各入口都看得到
export default function Home({ navigate }) {
  const { completed, riskAck } = useProgress();
  const doneCount = Object.keys(completed).length;
  const started = doneCount > 0;
  const startTarget = riskAck ? "#/map" : "#/risk";

  const parts = [
    {
      icon: "🗺️",
      title: "闖關地圖",
      sub: `${totalReady} 關 · 動手做`,
      desc: "從「我做好了怎麼給別人用」一路做到把市府活動公告頁真的上線。每關都先在站內模擬，再帶你去平台實作。",
      to: startTarget,
      primary: true,
    },
    {
      icon: "🧭",
      title: "選型指南",
      sub: "我該用哪一種？",
      desc: "依難易度、靜態/動態、資料界線、費用、維護一次比較，還有「幫我選」直接推薦。",
      to: "#/guide",
    },
    {
      icon: "📇",
      title: "名詞小教室",
      sub: `${TERMS.length} 張概念卡`,
      desc: "快取、佇列、環境、權限…看懂這些詞，做事更順，也更能跟資訊局溝通。",
      to: "#/terms",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center pt-2">
        <div
          className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-surface border-2 border-line font-extrabold text-[13px] mb-5"
          style={{ boxShadow: "0 4px 0 var(--border)" }}
        >
          🏛️ 給非資訊背景的公務員
        </div>

        <h1 className="font-extrabold tracking-tight mb-4 text-[clamp(30px,6.5vw,52px)] text-ink">
          從零到部署，
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(120deg, var(--primary), var(--accent))" }}
          >
            親手把網站放上網
          </span>
        </h1>

        <p className="text-muted mx-auto mb-6 max-w-[640px] text-[clamp(15px,2.4vw,18px)]">
          不用寫程式、不用打指令。用闖關的方式搞懂「部署」到底在做什麼， 並且
          <b className="text-ink">真的把一頁市府公告上線</b>——
          同時清楚知道哪些事可以自己做、哪裡該找資訊單位。
        </p>

        <div className="flex gap-3 justify-center flex-wrap mb-4">
          <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate(startTarget)}>
            {started ? `繼續闖關（${doneCount}/${totalReady}）→` : "開始闖關 →"}
          </button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate("#/risk")}>
            ⚠️ 風險預告書
          </button>
        </div>

        <div className="callout callout-info max-w-[640px] mx-auto text-left mb-5 text-sm">
          <b className="text-ink">已經會用 AI 寫出東西了嗎？</b>
          很多同仁已經能請 AI 幫忙做出一個 HTML，雙擊就能在自己電腦上跑 —— 卻卡在「這要怎麼給別人用」。第 1
          關就從這個問題開始。
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-muted text-[13px]">
          <span>📚 {totalReady} 關</span>
          <span>⏱ 全部約 60–90 分鐘</span>
          <span>💰 全程使用免費工具</span>
          <span>🖱️ 盡量用滑鼠點完</span>
        </div>
      </section>

      {/* 這堂課有三個部分 */}
      <section>
        <h2 className="text-center text-ink text-xl font-bold mb-1">這堂課有三個部分</h2>
        <p className="text-center text-muted text-sm mb-5">可以照順序闖關，也可以隨時跳去查指南和名詞。</p>
        <div className="grid gap-4 md:grid-cols-3">
          {parts.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => navigate(p.to)}
              className="card text-left transition-transform active:translate-y-1 hover:border-primary"
              style={p.primary ? { borderColor: "var(--primary)" } : undefined}
            >
              <div className="text-4xl mb-1">{p.icon}</div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-extrabold text-ink text-lg">{p.title}</span>
                <span className="text-xs font-bold text-accentText">{p.sub}</span>
              </div>
              <p className="text-muted text-sm mt-1 mb-0">{p.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 學完你會 */}
      <section className="card">
        <h2 className="text-ink text-lg font-bold mb-3">學完你會…</h2>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {[
            ["🖱️", "把自己（或 AI 幫你）做好的 HTML，變成同仁和市民打得開的網址"],
            ["📢", "自己把一頁可公開的市府活動公告放上網，不用等排程"],
            ["📊", "把市府開放資料（例如 YouBike 即時資訊）變成一張看板"],
            ["📬", "讓市民線上陳情後，自動通知承辦科室"],
            ["🚧", "分辨哪些能自己做、哪些要先找資訊單位"],
          ].map(([i, t]) => (
            <div key={t} className="flex gap-2.5 items-start">
              <span className="text-xl shrink-0">{i}</span>
              <span className="text-sm text-ink">{t}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
