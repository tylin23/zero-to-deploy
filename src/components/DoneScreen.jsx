import { useEffect } from "react";
import { celebrate } from "../lib/confetti.js";

// 過關畫面：icon + 徽章 + 說明 + 導覽按鈕
export default function DoneScreen({ icon = "🎉", title, badge, text, primary, secondary }) {
  useEffect(() => { celebrate(); }, []);

  return (
    <div className="text-center py-5 px-2.5 space-y-4">
      <div className="text-[72px] animate-pop">{icon}</div>
      <h2 className="text-2xl font-bold text-ink">{title || "過關！"}</h2>
      {badge && (
        <div
          className="inline-flex flex-col items-center gap-1 py-4 px-6 rounded-[22px] border-2 border-line"
          style={{ background: "linear-gradient(150deg, var(--accent-soft), var(--primary-soft))", boxShadow: "0 6px 0 var(--border)" }}
        >
          <span className="text-[46px]">{badge.icon}</span>
          <span className="font-extrabold text-base text-ink">{badge.name}</span>
          <span className="text-xs text-muted">{badge.desc}</span>
        </div>
      )}
      {text && <p className="text-muted text-sm max-w-md mx-auto">{text}</p>}
      <div className="flex gap-3 justify-center flex-wrap pt-1">
        {secondary && (
          <button type="button" className="btn btn-ghost" onClick={secondary.onClick}>{secondary.label}</button>
        )}
        {primary && (
          <button type="button" className="btn btn-primary" onClick={primary.onClick}>{primary.label}</button>
        )}
      </div>
    </div>
  );
}
