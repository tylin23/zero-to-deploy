import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";

// 進度／徽章／主題狀態，存在瀏覽器 localStorage（全部包 try/catch）
const KEY = "ztd_progress_v1";
const DEFAULT = { completed: {}, badges: {}, theme: null };

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch {
    return { ...DEFAULT };
  }
}
function write(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* 忽略 */ }
}

const Ctx = createContext(null);

export function ProgressProvider({ children }) {
  const [state, setState] = useState(read);

  // 套用主題到 <html data-theme>
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme) root.setAttribute("data-theme", state.theme);
    else root.removeAttribute("data-theme");
  }, [state.theme]);

  const markComplete = useCallback((levelId) => {
    setState((s) => {
      if (s.completed[levelId]) return s;
      const next = { ...s, completed: { ...s.completed, [levelId]: true } };
      write(next);
      return next;
    });
  }, []);

  const awardBadge = useCallback((badge) => {
    setState((s) => {
      if (!badge || s.badges[badge.id]) return s;
      const next = { ...s, badges: { ...s.badges, [badge.id]: { ...badge, at: Date.now() } } };
      write(next);
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setState((s) => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const cur = s.theme || (prefersDark ? "dark" : "light");
      const next = { ...s, theme: cur === "dark" ? "light" : "dark" };
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next = { ...DEFAULT };
    write(next);
    setState(next);
  }, []);

  const isComplete = useCallback((id) => !!state.completed[id], [state.completed]);

  const value = useMemo(
    () => ({
      completed: state.completed,
      badges: state.badges,
      theme: state.theme,
      isComplete,
      markComplete,
      awardBadge,
      toggleTheme,
      reset,
      ratio: (total) => (total ? Math.round((Object.keys(state.completed).length / total) * 100) : 0),
    }),
    [state, isComplete, markComplete, awardBadge, toggleTheme, reset]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProgress must be used within ProgressProvider");
  return v;
}
