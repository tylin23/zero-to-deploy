// =========================================================
// 關卡共用元件：步驟指示條、單選小測驗、過關畫面
// 讓每一關的檔案專心寫「內容」，不用重複刻 UI
// =========================================================
import { el, celebrate } from "./ui.js";

// 步驟進度圓點條
export function stepBar(current, total, doneUntil = -1) {
  const bar = el("div", { class: "steps" });
  for (let i = 0; i < total; i++) {
    let cls = "step-dot";
    if (i <= doneUntil) cls += " is-done";
    else if (i === current) cls += " is-active";
    bar.append(el("div", { class: cls }));
  }
  return bar;
}

// 單選測驗卡：答對才呼叫 onCorrect()
// spec = { question, options:[{text, correct}], explainOk, explainNo }
export function quiz(spec, onCorrect) {
  const wrap = el("div", { class: "stack" });
  const q = el("p", { class: "step-count" }, "小測驗");
  const title = el("h3", {}, spec.question);
  const list = el("div", { class: "quiz" });
  const feedback = el("div", { style: "display:none" });
  let answered = false;

  spec.options.forEach((opt) => {
    const btn = el("button", { class: "quiz-opt", type: "button" }, [
      el("span", {}, opt.text),
      el("span", { class: "quiz-opt__mark" }),
    ]);
    btn.addEventListener("click", () => {
      if (answered && opt.correct === false) return;
      if (answered) return;
      answered = true;
      // 標示所有選項
      [...list.children].forEach((c) => (c.disabled = true));
      if (opt.correct) {
        btn.classList.add("is-correct");
        btn.querySelector(".quiz-opt__mark").textContent = "✓";
        feedback.className = "quiz-feedback ok";
        feedback.textContent = spec.explainOk || "答對了！";
        feedback.style.display = "block";
        onCorrect && onCorrect();
      } else {
        btn.classList.add("is-wrong");
        btn.querySelector(".quiz-opt__mark").textContent = "✗";
        feedback.className = "quiz-feedback no";
        feedback.textContent = spec.explainNo || "再想想看～";
        feedback.style.display = "block";
        // 標出正解，允許重試其他
        answered = false;
        btn.disabled = true;
        [...list.children].forEach((c) => {
          if (c !== btn) c.disabled = false;
        });
      }
    });
    list.append(btn);
  });

  wrap.append(q, title, list, feedback);
  return wrap;
}

// 過關畫面
// opts = { icon, badge:{icon,name,desc}, title, text, primary:{label,onClick}, secondary:{label,onClick} }
export function doneScreen(opts) {
  const panel = el("div", { class: "done-panel stack" });
  panel.append(el("div", { class: "done-panel__emoji" }, opts.icon || "🎉"));
  panel.append(el("h2", {}, opts.title || "過關！"));
  if (opts.badge) {
    panel.append(
      el("div", { class: "badge" }, [
        el("span", { class: "badge__icon" }, opts.badge.icon),
        el("span", { class: "badge__name" }, opts.badge.name),
        el("span", { class: "badge__desc" }, opts.badge.desc),
      ])
    );
  }
  if (opts.text) panel.append(el("p", { class: "hint" }, opts.text));

  const nav = el("div", { style: "display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:8px" });
  if (opts.secondary) {
    nav.append(el("button", { class: "btn btn--ghost", type: "button", onClick: opts.secondary.onClick }, opts.secondary.label));
  }
  if (opts.primary) {
    nav.append(el("button", { class: "btn btn--primary", type: "button", onClick: opts.primary.onClick }, opts.primary.label));
  }
  panel.append(nav);

  celebrate();
  return panel;
}
