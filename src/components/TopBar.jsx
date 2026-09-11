import { useProgress } from "../state/progress.jsx";
import { totalReady } from "../data/levels.js";

export default function TopBar({ navigate }) {
  const { theme, toggleTheme, reset, ratio } = useProgress();
  const pct = ratio(totalReady);
  const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme ? theme === "dark" : prefersDark;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-3 py-3 px-4 sm:px-10 border-b border-line backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--surface) 78%, transparent)" }}>
      <button type="button" onClick={() => navigate("#/")} className="flex items-center gap-2.5 text-ink font-extrabold" aria-label="回首頁">
        <span className="text-2xl" style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,.15))" }}>🚀</span>
        <span className="text-lg hidden sm:inline">Zero to Deploy</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2" title="學習進度">
          <div className="w-[70px] sm:w-[150px] h-3 rounded-full bg-surface2 border-2 border-line overflow-hidden">
            <div className="h-full rounded-full transition-[width] duration-500" style={{ width: pct + "%", background: "linear-gradient(90deg, var(--accent), var(--primary))" }} />
          </div>
          <span className="text-[13px] font-extrabold text-muted w-9 text-right">{pct}%</span>
        </div>
        <IconButton label="切換深淺色" onClick={toggleTheme}>{isDark ? "☀️" : "🌙"}</IconButton>
        <IconButton label="重設進度" onClick={() => { if (confirm("要清除所有學習進度與徽章嗎？")) { reset(); navigate("#/"); } }}>↺</IconButton>
      </div>
    </header>
  );
}

function IconButton({ children, label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="w-10 h-10 rounded-[14px] border-2 border-line bg-surface text-ink text-[17px] grid place-items-center transition-transform active:translate-y-[3px]"
      style={{ boxShadow: "0 3px 0 var(--border)" }}
    >
      {children}
    </button>
  );
}
