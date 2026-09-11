// =========================================================
// 共用的小工具：建立 DOM、彈出提示 toast、過關彩帶動畫
// =========================================================

// 迷你 DOM 建立器：el("div", {class:"x"}, [child, "文字"])
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else node.setAttribute(k, v);
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const c of kids) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return node;
}

// 短暫的底部提示
let toastTimer;
export function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = el("div", { class: "toast" });
    document.body.append(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// 過關彩帶
export function celebrate() {
  const layer = document.getElementById("fx-layer");
  if (!layer) return;
  const colors = ["#5b5bf0", "#f97316", "#16a34a", "#e23d5a", "#febc2e", "#7c7cff"];
  const n = 90;
  for (let i = 0; i < n; i++) {
    const piece = el("div", { class: "confetti" });
    const size = 6 + Math.random() * 8;
    piece.style.background = colors[i % colors.length];
    piece.style.left = Math.random() * 100 + "%";
    piece.style.top = "-20px";
    piece.style.width = size + "px";
    piece.style.height = size * 1.4 + "px";
    piece.style.borderRadius = Math.random() > 0.5 ? "2px" : "50%";
    layer.append(piece);

    const dx = (Math.random() - 0.5) * 260;
    const dy = window.innerHeight + 60;
    const rot = (Math.random() - 0.5) * 900;
    const dur = 1600 + Math.random() * 1400;

    piece.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0.9 },
      ],
      { duration: dur, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" }
    ).onfinish = () => piece.remove();
  }
}

// 平滑捲到頁面頂端（換頁時用）
export function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
