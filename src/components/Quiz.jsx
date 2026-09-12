import { useState } from "react";

// 單選小測驗：答對才呼叫 onCorrect()
// options: [{ text, correct }]
export default function Quiz({ question, options, explainOk, explainNo, onCorrect }) {
  const [locked, setLocked] = useState(false); // 答對後鎖定
  const [disabled, setDisabled] = useState({}); // 答錯的選項各自 disable
  const [feedback, setFeedback] = useState(null); // { ok, text }

  const pick = (opt, i) => {
    if (locked || disabled[i]) return;
    if (opt.correct) {
      setLocked(true);
      setFeedback({ ok: true, text: explainOk || "答對了！" });
      onCorrect && onCorrect();
    } else {
      setDisabled((d) => ({ ...d, [i]: true }));
      setFeedback({ ok: false, text: explainNo || "再想想看～" });
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-extrabold text-muted">小測驗</p>
      <h3 className="text-lg font-bold text-ink">{question}</h3>
      <div className="grid gap-2.5">
        {options.map((opt, i) => {
          const isCorrect = locked && opt.correct;
          const isWrong = disabled[i];
          let cls = "border-line bg-surface hover:border-primary hover:bg-primarySoft";
          if (isCorrect) cls = "border-mint bg-successSoft text-success font-extrabold";
          else if (isWrong) cls = "border-danger bg-dangerSoft text-danger opacity-80";
          return (
            <button
              key={i}
              type="button"
              disabled={locked || isWrong}
              onClick={() => pick(opt, i)}
              className={`text-left px-4 py-3.5 rounded-[14px] border-2 text-[15px] flex items-center gap-2.5 transition-all ${cls}`}
              style={{ boxShadow: isCorrect ? "0 4px 0 var(--mint-dark)" : "0 4px 0 var(--border)" }}
            >
              <span>{opt.text}</span>
              {isCorrect && <span className="ml-auto font-extrabold">✓</span>}
              {isWrong && <span className="ml-auto font-extrabold">✗</span>}
            </button>
          );
        })}
      </div>
      {feedback && (
        <div
          className={`mt-3 py-3 px-4 rounded-[14px] text-sm font-bold ${feedback.ok ? "bg-successSoft text-success" : "bg-dangerSoft text-danger"}`}
        >
          {feedback.text}
        </div>
      )}
    </div>
  );
}
