import { diffText, diyColor, diyText } from "../data/levels.js";

// 關卡標題下的「評估標籤條」：難易度、靜/動、資料界線、費用、維護
export default function EvalBar({ ev }) {
  if (!ev) return null;
  const chip = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border-2";
  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-1">
      <span className={chip} style={{ borderColor: "var(--border)", background: "var(--surface)" }} title="上手難易度">
        {diffText(ev.difficulty)}
      </span>
      <span className={chip} style={{ borderColor: "var(--border)", background: "var(--surface)" }} title="靜態或動態">
        {ev.kind}
      </span>
      <span className={chip} style={{ borderColor: diyColor[ev.diy], background: "color-mix(in srgb, " + diyColor[ev.diy] + " 14%, var(--surface))" }} title="資料界線">
        {diyText[ev.diy]}
      </span>
      <span className={chip} style={{ borderColor: "var(--border)", background: "var(--surface)" }} title="費用">💰 {ev.cost}</span>
      <span className={chip} style={{ borderColor: "var(--border)", background: "var(--surface)" }} title="維護負擔">🛠 {ev.maintain}</span>
    </div>
  );
}
