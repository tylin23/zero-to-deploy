import { useProgress } from "../state/progress.jsx";
import { totalReady } from "../data/levels.js";
import { NavTabs } from "./Nav.jsx";

export default function TopBar({ hash, navigate }) {
  const { theme, toggleTheme, ratio, completed } = useProgress();
  const pct = ratio(totalReady);
  const doneCount = Object.keys(completed).length;
  const prefersDark =
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme ? theme === "dark" : prefersDark;

  return (
    <header
      className="sticky top-0 z-50 flex items-center gap-3 py-2.5 px-4 sm:px-6 border-b border-line backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--surface) 88%, transparent)" }}
    >
      <button
        type="button"
        onClick={() => navigate("#/")}
        className="flex items-center gap-2.5 text-ink font-extrabold shrink-0"
        aria-label="回首頁"
      >
        <span className="text-2xl" style={{ filter: "drop-shadow(0 3px 4px rgba(0,0,0,.15))" }}>
          🚀
        </span>
        <span className="text-lg hidden sm:inline">Zero to Deploy</span>
      </button>

      <div className="mx-auto">
        <NavTabs hash={hash} navigate={navigate} />
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-2" title={`學習進度：已完成 ${doneCount} / ${totalReady} 關`}>
          <div className="w-[56px] sm:w-[120px] h-3 rounded-full bg-surface2 border-2 border-line overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: pct + "%",
                background: "linear-gradient(90deg, var(--accent), var(--primary))",
              }}
            />
          </div>
          <span
            data-testid="progress"
            className="text-[13px] font-extrabold text-muted tabular-nums whitespace-nowrap"
          >
            {doneCount}/{totalReady}
          </span>
        </div>
        <IconButton label="切換深淺色" onClick={toggleTheme}>
          {isDark ? "☀️" : "🌙"}
        </IconButton>
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
