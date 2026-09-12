import { useState } from "react";
import Level from "../components/Level.jsx";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

// 三種判斷
const CHOICES = [
  { id: "self", label: "✅ 可以自己做", color: "var(--mint)" },
  { id: "ask", label: "⚠️ 先問資訊單位", color: "var(--sun)" },
  { id: "no", label: "⛔ 不該這樣做", color: "var(--danger)" },
];

// 情境題（貼近公務日常）
const CASES = [
  {
    text: "把已經核定、可對外公開的活動公告，做成一頁網站放上網。",
    answer: "self",
    why: "內容已核定可公開、不含個資，做一頁靜態公告頁在你的權責內 —— 這正是後面 GitHub Pages 那關要教的。",
  },
  {
    text: "做一個收集民眾姓名、電話的報名表單頁，放到 GitHub Pages 上。",
    answer: "no",
    why: "GitHub Pages 是「完全公開」的靜態託管，沒有權限控管。收個資等於把民眾資料放在公開網路上。要收個資，請用機關既有系統或先洽資訊單位。",
  },
  {
    text: "把已經公開的統計數字，做成一張看板給同仁參考。",
    answer: "self",
    why: "用的是已公開資料、也不是對外的正式服務，屬於可以自己做的範圍。",
  },
  {
    text: "用境外的 AI 服務，分析含民眾姓名的陳情內容。",
    answer: "no",
    why: "「個資」加上「境外第三方」，兩條紅線都踩到了。真要做，必須先去識別化，並依機關個資與資安規範辦理、取得核准。",
  },
  {
    text: "想做一個給「全機關同仁」共用、要長期使用的查詢系統。",
    answer: "ask",
    why: "跨單位、全機關、且要長期維運 —— 已超出個人自主開發的範圍，應該先找資訊單位評估與納管，否則你一異動就變成沒人維護的黑盒子。",
  },
  {
    text: "民眾線上申辦後，用「案號」把通知推到承辦同仁的群組。",
    answer: "self",
    why: "通知只帶案號、不含個資，屬於科室內部流程自動化，可以自己做 —— 但要注意 Webhook 網址等同密鑰，別外流。",
  },
];

export default function BoundaryLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.boundary}
      done={{
        ...DONE.boundary,
        primary: { label: "開始第一關 →", onClick: () => ctx.navigate("#/level/intro") },
      }}
      steps={[({ next }) => <RedLines onNext={next} />, ({ finish }) => <CaseGame onFinish={finish} />]}
    />
  );
}

/* ---------- 步驟 1：紅線在哪 ---------- */
function RedLines({ onNext }) {
  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 1 / 2 · 先認得紅線
      </span>
      <h2 className="text-2xl font-bold text-ink">動手之前，先問自己一句話</h2>

      <div className="callout callout-info">
        自己做小工具解決業務上的麻煩，是好事。但公務環境有它的界線 —— 動手前先問：
        <b className="text-ink">「這件事，我可以自己做嗎？」</b>
      </div>

      <div>
        <div className="text-[13px] font-extrabold text-muted mb-2">碰到這五件事其中之一，就先停下來 👇</div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {[
            ["🧑", "個資", "姓名、電話、身分證號、案件內容"],
            ["🔒", "機敏資料", "未公開公文、內部檔案"],
            ["🌐", "對外正式服務", "民眾會當成官方系統在用的"],
            ["🏢", "跨單位 / 全機關", "不只你科室自己用"],
            ["🔑", "帳號與權限", "需要登入、要控管誰能看誰能改"],
          ].map(([i, t, d]) => (
            <div
              key={t}
              className="flex gap-2.5 items-start py-3 px-3.5 border-2 border-line rounded-[14px] bg-surface"
            >
              <span className="text-2xl shrink-0">{i}</span>
              <div>
                <div className="font-bold text-ink text-sm">{t}</div>
                <div className="text-xs text-muted">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="callout"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">停下來 ≠ 不能做。</b>只是代表這件事該由資訊單位評估、或由他們納管後再做 ——
        對你也是保護。
      </div>

      <button type="button" className="btn btn-primary" onClick={onNext}>
        下一步：來判斷幾個實際情境 →
      </button>
    </div>
  );
}

/* ---------- 步驟 2：情境判斷 ---------- */
function CaseGame({ onFinish }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const c = CASES[idx];
  const correct = picked === c.answer;
  const isLast = idx === CASES.length - 1;

  const next = () => {
    setIdx((i) => i + 1);
    setPicked(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
          步驟 2 / 2 · 情境判斷
        </span>
        <span className="text-xs font-extrabold text-muted">
          第 {idx + 1} / {CASES.length} 題
        </span>
      </div>

      <div className="border-2 border-line rounded-[18px] bg-surface2 p-4 sm:p-5">
        <div className="text-xs font-extrabold text-muted mb-1.5">情境</div>
        <p className="text-ink text-[17px] font-semibold m-0">{c.text}</p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        {CHOICES.map((ch) => {
          const isPicked = picked === ch.id;
          const isAnswer = ch.id === c.answer;
          let style = { borderColor: "var(--border)", background: "var(--surface)" };
          if (correct && isAnswer)
            style = {
              borderColor: ch.color,
              background: `color-mix(in srgb, ${ch.color} 16%, var(--surface))`,
            };
          else if (isPicked && !correct)
            style = { borderColor: "var(--danger)", background: "var(--danger-soft)", opacity: 0.7 };
          return (
            <button
              key={ch.id}
              type="button"
              disabled={correct}
              onClick={() => setPicked(ch.id)}
              className="py-3 px-3 rounded-[14px] border-2 font-bold text-sm transition-all"
              style={style}
            >
              {ch.label}
            </button>
          );
        })}
      </div>

      {picked && !correct && (
        <div className="py-3 px-4 rounded-[14px] text-sm font-bold bg-dangerSoft text-danger">
          再想想看 —— 回頭看看那五條紅線，這個情境踩到了嗎？
        </div>
      )}

      {correct && (
        <div className="space-y-3">
          <div className="py-3 px-4 rounded-[14px] text-sm bg-successSoft">
            <b className="text-success">✓ 判斷正確！</b>
            <div className="text-ink mt-1">{c.why}</div>
          </div>
          <button type="button" className="btn btn-primary" onClick={isLast ? onFinish : next}>
            {isLast ? "完成這一關 🎉" : "下一題 →"}
          </button>
        </div>
      )}
    </div>
  );
}
