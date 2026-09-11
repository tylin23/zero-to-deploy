// =========================================================
// 進度狀態管理：把「哪些關過了、拿了哪些徽章」存在瀏覽器 localStorage
// 全部包在 try/catch，避免無痕視窗或封鎖 storage 時整站壞掉
// =========================================================

const KEY = "ztd_progress_v1";

const DEFAULT_STATE = {
  completed: {}, // { levelId: true }
  badges: {},    // { badgeId: { name, icon, desc, at } }
  theme: null,   // "light" | "dark" | null(跟系統)
};

function safeRead() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function safeWrite(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* 忽略：無法寫入時網站仍可正常使用，只是進度不保留 */
  }
}

let state = safeRead();

export function getState() {
  return state;
}

export function isComplete(levelId) {
  return !!state.completed[levelId];
}

export function markComplete(levelId) {
  state.completed[levelId] = true;
  safeWrite(state);
}

export function awardBadge(badge) {
  if (state.badges[badge.id]) return false; // 已經有了
  state.badges[badge.id] = { ...badge, at: Date.now() };
  safeWrite(state);
  return true;
}

export function completionRatio(totalLevels) {
  const done = Object.keys(state.completed).length;
  return totalLevels ? Math.round((done / totalLevels) * 100) : 0;
}

export function getTheme() {
  return state.theme;
}

export function setTheme(theme) {
  state.theme = theme;
  safeWrite(state);
}

export function resetAll() {
  state = { ...DEFAULT_STATE };
  safeWrite(state);
}
