import { useState } from "react";
import { mapOrder, EXTRA_METHODS, EVAL, PICKER, diffText, diyTextColor, diyText } from "../data/levels.js";

// 比較清單同時涵蓋「關卡」與「沒有獨立關卡的部署方式」（例如 AI 工具的分享連結）
const ALL = [...EXTRA_METHODS, ...mapOrder];
const meta = (id) => ALL.find((l) => l.id === id) || {};
// 沒有自己的關卡時，連到介紹它的那一關
const levelOf = (row) => row.goLevel || row.id;
const rowsFor = (phase) => ALL.filter((l) => EVAL[l.id]?.phase === phase);

// 資料界線用的底色：跟 diyTextColor 同一組語意（綠可自己做 / 黃要留意 / 紅接近紅線）
const diyBg = {
  green: "color-mix(in srgb, var(--success) 12%, var(--surface))",
  yellow: "color-mix(in srgb, var(--sun) 16%, var(--surface))",
  red: "color-mix(in srgb, var(--danger) 10%, var(--surface))",
};

export default function Guide({ navigate }) {
  const [pick, setPick] = useState(null);

  const pre = rowsFor("pre");
  const post = rowsFor("post");

  return (
    <div>
      <div className="text-center mb-5">
        <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">選型指南</span>
        <h1 className="text-[clamp(24px,5vw,34px)] font-bold text-ink">我該用哪一種部署方式？ 🧭</h1>
        <p className="text-muted text-sm">
          依難易度、資料界線、費用、維護一次比較。先確認你要做的事，再挑最合適的。
        </p>
      </div>

      {/* 幫我選 */}
      <div className="card space-y-3 mb-6">
        <h3 className="text-ink font-bold">🙋 幫我選：你想做什麼？</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {PICKER.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPick(p)}
              className={`text-left px-3.5 py-2.5 rounded-[12px] border-2 text-sm leading-snug transition-all ${pick === p ? "border-primary bg-primarySoft" : "border-line bg-surface hover:border-primary"}`}
            >
              {p.q}
            </button>
          ))}
        </div>
        {pick && (
          <div className="callout callout-info animate-pop">
            建議用{" "}
            <b className="text-ink">
              {meta(pick.to).emoji} {meta(pick.to).title}
            </b>
            　—　{pick.why}
            <div className="mt-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => navigate("#/level/" + levelOf(meta(pick.to)))}
              >
                前往這一關 →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 納管前 */}
      <h3 className="text-ink font-bold mb-2">🙋 納管前：你可以自己做的</h3>
      <CompareList rows={pre} navigate={navigate} />

      {/* 納管後 */}
      <h3 className="text-ink font-bold mt-7 mb-2">🏛️ 偏正式系統（通常交資訊單位 / 納管後）</h3>
      <p className="text-muted text-sm mb-2">
        這些多半不是自己動手的範圍，了解即可；碰到就是「該找資訊單位」的訊號。
      </p>
      <CompareList rows={post} navigate={navigate} />

      <div
        className="callout mt-6"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">不論用哪一種：</b>
        只要碰到「個資／機敏／對外正式服務／跨局處或全市府」，就停下來找資訊單位。詳見{" "}
        <button
          type="button"
          onClick={() => navigate("#/risk")}
          className="text-ink font-bold underline underline-offset-2"
        >
          風險預告書
        </button>
        。
      </div>
    </div>
  );
}

// 以前這裡是一張八欄的表，但欄位一多，「什麼時候選它」這個最該看的欄位
// 反而被擠到最右邊、在桌機上就被切掉了。改成一張一張卡片，手機一欄、桌機兩欄。
function CompareList({ rows, navigate }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {rows.map((l) => (
        <MethodCard key={l.id} row={l} navigate={navigate} />
      ))}
    </div>
  );
}

function MethodCard({ row, navigate }) {
  const ev = EVAL[row.id];
  return (
    <div data-method={row.id} className="card-sm bg-surface border-2 border-line rounded-[14px] p-4 space-y-2.5">
      {/* 名稱 + 難易度 */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => navigate("#/level/" + levelOf(row))}
          className="font-bold text-ink hover:text-primary text-left leading-snug"
        >
          {row.emoji} {row.title} ↗
        </button>
        <span className="text-xs whitespace-nowrap text-muted mt-0.5">{diffText(ev.difficulty)}</span>
      </div>
      {row.note && <div className="text-muted text-xs -mt-1">{row.note}</div>}

      {/* 資料界線：整段用底色強調，這是本站最在意的一欄 */}
      <div
        className="rounded-[10px] px-3 py-2 text-xs leading-relaxed"
        style={{ background: diyBg[ev.diy] }}
      >
        <b style={{ color: diyTextColor[ev.diy] }}>{diyText[ev.diy]}</b>
        <span className="text-ink">　{ev.risk}</span>
      </div>

      {/* 什麼時候選它：原本被擠到表格最右邊看不到，現在放在顯眼的位置 */}
      <div className="text-sm text-ink leading-relaxed">
        <b className="text-accentText text-xs">✅ 什麼時候選它</b>
        <div className="mt-0.5">{ev.scenario}</div>
      </div>

      {/* 其餘四欄：兩欄小網格，不再需要左右捲動 */}
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs pt-1 border-t-2 border-line">
        <Field k="靜／動" v={ev.kind} />
        <Field k="開放範圍" v={ev.openness} />
        <Field k="費用" v={ev.cost} />
        <Field k="維護" v={ev.maintain} />
      </dl>
    </div>
  );
}

function Field({ k, v }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted">{k}</dt>
      <dd className="text-ink font-bold leading-snug break-words">{v}</dd>
    </div>
  );
}
