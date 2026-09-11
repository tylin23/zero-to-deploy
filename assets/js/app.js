// =========================================================
// 主程式：主題、進度條、路由（首頁 / 地圖 / 關卡）
// =========================================================
import { el, scrollTop } from "./ui.js";
import {
  getState, isComplete, markComplete, awardBadge,
  completionRatio, getTheme, setTheme, resetAll,
} from "./state.js";
import { playable, mapOrder, totalReady } from "./levels/index.js";

const app = document.getElementById("app");

/* ---------- 主題（深淺色） ---------- */
function applyTheme() {
  const saved = getTheme();
  const root = document.documentElement;
  if (saved) root.setAttribute("data-theme", saved);
  else root.removeAttribute("data-theme"); // 跟系統
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved ? saved === "dark" : prefersDark;
  document.getElementById("theme-toggle").textContent = isDark ? "☀️" : "🌙";
}
document.getElementById("theme-toggle").addEventListener("click", () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const cur = getTheme() || (prefersDark ? "dark" : "light");
  setTheme(cur === "dark" ? "light" : "dark");
  applyTheme();
});

/* ---------- 進度條 ---------- */
function refreshProgress() {
  const pct = completionRatio(totalReady);
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-label").textContent = pct + "%";
}

/* ---------- 重設進度 ---------- */
document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("要清除所有學習進度與徽章嗎？")) {
    resetAll();
    refreshProgress();
    location.hash = "#/";
    route();
  }
});

/* ---------- 關卡給的 context ---------- */
function makeCtx(levelId) {
  return {
    isDone: isComplete(levelId),
    complete(badge) {
      markComplete(levelId);
      if (badge) awardBadge(badge);
      refreshProgress();
    },
    goMap() { navigate("#/map"); },
    navigate,
  };
}

function navigate(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

/* ---------- 各頁面 ---------- */
function viewHome() {
  const s = getState();
  const started = Object.keys(s.completed).length > 0;
  const wrap = el("div", { class: "hero" }, [
    el("div", { class: "hero__badge" }, ["🎮 互動教材", " · 邊玩邊學部署"]),
    el("h1", { class: "hero__title" }, [
      "從零到部署，",
      el("span", { class: "grad" }, "親手把網站放上網"),
    ]),
    el("p", { class: "hero__sub" }, "不用先懂一堆指令。用闖關的方式，一步步搞懂「部署」是什麼，並且真的把你的第一個網站上線 —— 第一站：GitHub Pages。"),
    el("div", { class: "hero__cta" }, [
      el("button", { class: "btn btn--primary btn--lg", type: "button", onClick: () => navigate("#/map") },
        started ? "繼續闖關 →" : "開始冒險 →"),
      el("button", { class: "btn btn--ghost btn--lg", type: "button", onClick: () => navigate("#/level/intro") }, "直接看第一關"),
    ]),
    el("div", { class: "hero__points" }, [
      el("div", { class: "hero__point" }, [el("b", {}, "🖱️"), "全程用滑鼠點"]),
      el("div", { class: "hero__point" }, [el("b", {}, "🧪"), "站內先模擬一次"]),
      el("div", { class: "hero__point" }, [el("b", {}, "🚀"), "真的部署上線"]),
    ]),
  ]);
  app.replaceChildren(wrap);
}

function viewMap() {
  const wrap = el("div");
  wrap.append(
    el("div", { class: "map-head" }, [
      el("span", { class: "eyebrow" }, "部署地圖"),
      el("h1", {}, "選一關開始"),
      el("p", { class: "hint" }, "跟著順序走最順。打勾的是已完成的關卡。"),
    ])
  );

  const grid = el("div", { class: "map-grid" });
  mapOrder.forEach((lv, i) => {
    const done = isComplete(lv.id);
    const locked = lv.status !== "ready";
    const card = el("button", {
      class: "level-card" + (locked ? " is-locked" : "") + (done ? " is-done" : ""),
      type: "button",
      disabled: locked ? "true" : null,
      onClick: () => { if (!locked) navigate("#/level/" + lv.id); },
    }, [
      el("div", { class: "level-card__top" }, [
        el("span", { class: "level-card__emoji" }, lv.emoji),
        el("span", { class: "level-card__num" }, "第 " + (i + 1) + " 關"),
      ]),
      el("h3", { class: "level-card__title" }, lv.title),
      el("p", { class: "level-card__tag" }, lv.tagline),
      el("div", { class: "level-card__foot" },
        locked
          ? [el("span", { class: "pill pill--muted" }, "🔒 即將推出")]
          : done
            ? [el("span", { class: "pill pill--success" }, "✓ 已完成")]
            : [el("span", { class: "pill pill--primary" }, "開始 →")]
      ),
    ]);
    grid.append(card);
  });
  wrap.append(grid);

  // 徽章櫃
  const badges = Object.values(getState().badges);
  if (badges.length) {
    const shelf = el("div", { class: "card stack", style: "margin-top:24px" });
    shelf.append(el("h3", {}, "🏅 我的徽章"));
    const row = el("div", { style: "display:flex;gap:14px;flex-wrap:wrap" });
    badges.forEach((b) =>
      row.append(el("div", { class: "badge", style: "margin:0" }, [
        el("span", { class: "badge__icon" }, b.icon),
        el("span", { class: "badge__name" }, b.name),
        el("span", { class: "badge__desc" }, b.desc),
      ]))
    );
    shelf.append(row);
    wrap.append(shelf);
  }

  app.replaceChildren(wrap);
}

function viewLevel(id) {
  const level = playable[id];
  if (!level) { navigate("#/map"); return; }

  const wrap = el("div");
  wrap.append(
    el("button", { class: "lv-back", type: "button", onClick: () => navigate("#/map") }, "← 回地圖"),
    el("div", { class: "lv-head" }, [
      el("span", { class: "lv-head__emoji" }, level.emoji),
      el("div", {}, [
        el("h1", {}, level.title),
        el("p", { class: "hint", style: "margin:0" }, level.tagline),
      ]),
    ])
  );
  const host = el("div");
  wrap.append(host);
  app.replaceChildren(wrap);

  level.render(host, makeCtx(id));
}

/* ---------- 路由 ---------- */
function route() {
  const hash = location.hash || "#/";
  app.focus({ preventScroll: true });
  if (hash === "#/" || hash === "") return viewHome();
  if (hash === "#/map") return viewMap();
  const m = hash.match(/^#\/level\/(.+)$/);
  if (m) return viewLevel(m[1]);
  viewHome();
}

window.addEventListener("hashchange", () => { route(); scrollTop(); });

/* ---------- 啟動 ---------- */
applyTheme();
refreshProgress();
route();
