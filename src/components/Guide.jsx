import { useState } from "react";
import { mapOrder, EVAL, PICKER, diffText, diyColor, diyText } from "../data/levels.js";

const meta = (id) => mapOrder.find((l) => l.id === id) || {};

export default function Guide({ navigate }) {
  const [pick, setPick] = useState(null);

  const pre = mapOrder.filter((l) => EVAL[l.id]?.phase === "pre");
  const post = mapOrder.filter((l) => EVAL[l.id]?.phase === "post");

  return (
    <div>
      <div className="text-center mb-5">
        <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">選型指南</span>
        <h1 className="text-[clamp(24px,5vw,34px)] font-bold text-ink">我該用哪一種部署方式？ 🧭</h1>
        <p className="text-muted text-sm">依難易度、靜/動、資料界線、費用、維護一次比較。先確認你要做的事，再挑最合適的。</p>
      </div>

      {/* 幫我選 */}
      <div className="card space-y-3 mb-6">
        <h3 className="text-ink font-bold">🙋 幫我選：你想做什麼？</h3>
        <div className="grid gap-2.5">
          {PICKER.map((p, i) => (
            <button key={i} type="button" onClick={() => setPick(p)}
              className={`text-left px-4 py-3 rounded-[14px] border-2 transition-all ${pick === p ? "border-primary bg-primarySoft" : "border-line bg-surface hover:border-primary"}`}>
              {p.q}
            </button>
          ))}
        </div>
        {pick && (
          <div className="callout callout-info animate-pop">
            建議用 <b className="text-ink">{meta(pick.to).emoji} {meta(pick.to).title}</b>　—　{pick.why}
            <div className="mt-2">
              <button type="button" className="btn btn-primary !py-2 !px-4 !text-sm" onClick={() => navigate("#/level/" + pick.to)}>前往這一關 →</button>
            </div>
          </div>
        )}
      </div>

      {/* 納管前比較表 */}
      <h3 className="text-ink font-bold mb-2">🙋 納管前：你可以自己做的</h3>
      <CompareTable rows={pre} navigate={navigate} />

      {/* 納管後 */}
      <h3 className="text-ink font-bold mt-6 mb-2">🏛️ 偏正式系統（通常交資訊單位 / 納管後）</h3>
      <p className="text-muted text-sm mb-2">這些多半不是自己動手的範圍，了解即可；碰到就是「該找資訊單位」的訊號。</p>
      <CompareTable rows={post} navigate={navigate} />

      <div className="callout mt-6" style={{ borderLeftColor: "var(--sun)", background: "color-mix(in srgb, var(--sun) 14%, var(--surface))" }}>
        <b className="text-ink">不論用哪一種：</b>只要碰到「個資／機敏／對外正式服務／跨單位或全機關」，就停下來找資訊單位。詳見 <button type="button" onClick={() => navigate("#/risk")} className="text-ink font-bold underline underline-offset-2">風險預告書</button>。
      </div>
    </div>
  );
}

function CompareTable({ rows, navigate }) {
  return (
    <div className="overflow-x-auto rounded-[14px] border-2 border-line">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-surface2 text-muted text-xs">
            {["部署方式", "難易度", "靜/動", "資料界線", "開放範圍", "費用", "維護", "最適合"].map((h) => (
              <th key={h} className="text-left font-extrabold px-3 py-2.5 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => {
            const ev = EVAL[l.id];
            return (
              <tr key={l.id} className="border-t-2 border-line align-top">
                <td className="px-3 py-3">
                  <button type="button" onClick={() => navigate("#/level/" + l.id)} className="font-bold text-ink hover:text-primary text-left">
                    {l.emoji} {l.title} ↗
                  </button>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">{diffText(ev.difficulty)}</td>
                <td className="px-3 py-3 whitespace-nowrap">{ev.kind}</td>
                <td className="px-3 py-3">
                  <span className="font-bold" style={{ color: diyColor[ev.diy] }}>{diyText[ev.diy]}</span>
                  <div className="text-muted text-xs mt-0.5">{ev.risk}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">{ev.openness}</td>
                <td className="px-3 py-3 whitespace-nowrap">{ev.cost}</td>
                <td className="px-3 py-3 whitespace-nowrap">{ev.maintain}</td>
                <td className="px-3 py-3 text-muted min-w-[150px]">{ev.scenario}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
