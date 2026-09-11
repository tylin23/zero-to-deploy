import { useProgress } from "../state/progress.jsx";

export default function Home({ navigate }) {
  const { completed } = useProgress();
  const started = Object.keys(completed).length > 0;

  return (
    <div className="text-center py-4 sm:py-10">
      <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-surface border-2 border-line font-extrabold text-[13px] mb-6"
        style={{ boxShadow: "0 4px 0 var(--border)" }}>
        🎮 互動教材 · 邊玩邊學部署
      </div>

      <h1 className="font-extrabold tracking-tight mb-4 text-[clamp(32px,7vw,56px)] text-ink">
        從零到部署，
        <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(120deg, var(--primary), var(--accent))" }}>
          親手把網站放上網
        </span>
      </h1>

      <p className="text-muted mx-auto mb-8 max-w-[620px] text-[clamp(15px,2.4vw,19px)]">
        不用先懂一堆指令。用闖關的方式，一步步搞懂「部署」是什麼，並且真的把你的第一個網站上線 —— 第一站：GitHub Pages。
      </p>

      <div className="flex gap-3.5 justify-center flex-wrap">
        <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate("#/map")}>
          {started ? "繼續闖關 →" : "開始冒險 →"}
        </button>
        <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate("#/level/intro")}>直接看第一關</button>
      </div>

      <div className="flex gap-3.5 justify-center flex-wrap mt-9">
        {[["🖱️", "全程用滑鼠點"], ["🧪", "站內先模擬一次"], ["🚀", "真的部署上線"]].map(([icon, label]) => (
          <div key={label} className="bg-surface border-2 border-line rounded-[14px] py-4 px-5 font-bold text-sm" style={{ boxShadow: "0 5px 0 var(--border)" }}>
            <b className="block text-[26px] mb-1">{icon}</b>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
