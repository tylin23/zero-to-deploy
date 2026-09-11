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

// SVG 元素建立器
function svgEl(tag, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

function viewMap() {
  const wrap = el("div", { class: "mapview" });
  wrap.append(
    el("div", { class: "map-head" }, [
      el("span", { class: "eyebrow" }, "部署地圖"),
      el("h1", {}, "沿著路徑闖關 🗺️"),
      el("p", { class: "hint" }, "從起點一路往下走，每一站學會一種部署方式。"),
    ])
  );

  // 找出「目前這關」＝第一個尚未完成、且已開放的關
  const currentId = (mapOrder.find((l) => l.status === "ready" && !isComplete(l.id)) || {}).id;

  const trail = el("div", { class: "trail" });
  const svg = svgEl("svg", { class: "trail__svg", preserveAspectRatio: "none" });
  const pathBase = svgEl("path", { class: "trail__path" });
  const pathDone = svgEl("path", { class: "trail__path--done" });
  const pathDash = svgEl("path", { class: "trail__path--dash" });
  svg.append(pathBase, pathDone, pathDash);
  trail.append(svg);

  mapOrder.forEach((lv, i) => {
    const done = isComplete(lv.id);
    const locked = lv.status !== "ready";
    const isCurrent = lv.id === currentId;
    let cls = "trail-node ";
    if (locked) cls += "is-locked";
    else if (done) cls += "is-done";
    else if (isCurrent) cls += "is-current";
    else cls += "is-open";

    const btn = el("button", {
      class: "node-btn",
      type: "button",
      disabled: locked ? "true" : null,
      "aria-label": lv.title + (locked ? "（即將推出）" : ""),
      onClick: () => { if (!locked) navigate("#/level/" + lv.id); },
    }, [
      el("span", { class: "node-emoji" }, lv.emoji),
      locked ? el("span", { class: "node-lock" }, "🔒") : null,
      done ? el("span", { class: "node-check" }, "✓") : null,
    ]);

    const node = el("div", { class: cls, "data-i": i }, [
      el("span", { class: "node-num" }, String(i + 1)),
      done ? el("span", { class: "node-stars" }, "⭐⭐⭐") : null,
      isCurrent ? el("span", { class: "node-flag" }, "從這開始") : null,
      btn,
      el("div", { class: "node-label" }, el("div", { class: "node-label__title" }, lv.title)),
    ]);
    trail.append(node);
  });

  // 終點旗標
  trail.append(el("div", { class: "trail-finish" }, [
    el("div", { class: "trail-finish__icon" }, "🏆"),
    el("div", { class: "trail-finish__text" }, "全部部署技能達成！"),
  ]));

  wrap.append(trail);

  // 徽章櫃
  const badges = Object.values(getState().badges);
  if (badges.length) {
    const shelf = el("div", { class: "card stack shelf" });
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
  layoutTrail(); // 進 DOM 後才量得到尺寸
}

// 把節點沿蜿蜒路徑排好，並畫出連接的路徑線
function layoutTrail() {
  const trail = document.querySelector(".trail");
  if (!trail) return;
  const nodes = [...trail.querySelectorAll(".trail-node")];
  if (!nodes.length) return;

  const W = trail.clientWidth || trail.offsetWidth || 520;
  const gap = W < 420 ? 118 : 134;
  const padTop = 78;
  const padBottom = 96;
  const amp = Math.min(W * 0.3, 150);
  const cx = W / 2;

  const pts = nodes.map((n, i) => {
    const y = padTop + i * gap;
    const x = cx + amp * Math.sin(i * 0.95 + 0.4);
    n.style.left = x + "px";
    n.style.top = y + "px";
    return { x, y };
  });

  const totalH = padTop + (nodes.length - 1) * gap + padBottom;
  trail.style.height = totalH + "px";

  // 終點旗標放在最後一顆節點下方
  const finish = trail.querySelector(".trail-finish");
  if (finish) {
    finish.style.left = cx + "px";
    finish.style.top = padTop + (nodes.length - 1) * gap + 60 + "px";
  }

  // 用平滑曲線把各節點中心連起來
  const buildPath = (list) => {
    if (list.length < 2) return "";
    let d = `M ${list[0].x} ${list[0].y}`;
    for (let i = 1; i < list.length; i++) {
      const p0 = list[i - 1], p1 = list[i];
      const my = (p0.y + p1.y) / 2;
      d += ` C ${p0.x} ${my}, ${p1.x} ${my}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const svg = trail.querySelector(".trail__svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${totalH}`);
  svg.setAttribute("width", W);
  svg.setAttribute("height", totalH);

  const fullD = buildPath(pts);
  svg.querySelector(".trail__path").setAttribute("d", fullD);
  svg.querySelector(".trail__path--dash").setAttribute("d", fullD);

  // 進度線：從起點畫到「最後一顆已完成節點」
  let lastDone = -1;
  nodes.forEach((n, i) => { if (n.classList.contains("is-done")) lastDone = i; });
  const donePath = svg.querySelector(".trail__path--done");
  if (lastDone >= 1) donePath.setAttribute("d", buildPath(pts.slice(0, lastDone + 1)));
  else donePath.setAttribute("d", "");
}

// 視窗改變大小時重新排列路徑（節流）
let trailResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(trailResizeTimer);
  trailResizeTimer = setTimeout(layoutTrail, 120);
});

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
