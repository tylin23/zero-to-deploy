import { useState } from "react";
import Level, { Eyebrow } from "../components/Level.jsx";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

// 三種判斷
const CHOICES = [
  { id: "self", label: "✅ 可以自己做", color: "var(--mint)" },
  { id: "ask", label: "⚠️ 先問資訊單位", color: "var(--sun)" },
  { id: "no", label: "⛔ 不該這樣做", color: "var(--danger)" },
];

// 情境題（貼近公務日常）。
// 排在 GitHub Pages 之後，所以可以回頭指「你剛剛做的那件事」；
// 還沒教到的東西一律用白話描述，並在解析裡標出之後哪一關會做到。
const CASES = [
  {
    text: "把已經核定、可以對外公開的「市民健康講座」公告，做成一頁網站放上網。",
    answer: "self",
    why: "這就是你上一關做的事：內容已核定可公開、也不含任何人的個資，做一頁公告頁在你的權責內。",
  },
  {
    text: "做一個收集市民姓名、電話的講座報名表單頁，用上一關同樣的方式放上網。",
    answer: "no",
    why: "你上一關親眼看到了：放上去的網址任何人都打得開，沒有「誰可以看」這種設定。把市民的姓名電話放在那裡，等於攤在公開的網路上。要收個資，請用機關既有的系統，或先洽資訊單位。",
  },
  {
    text: "把環保局已經公開的空氣品質數字，做成一張看板給科室同仁參考。",
    answer: "self",
    why: "用的是已公開的開放資料，也不是給市民用的正式服務，屬於可以自己做的範圍。（第 4 關就會教你怎麼讓這張看板自動去抓最新數字）",
  },
  {
    text: "把 1999 市民熱線的陳情原文（含姓名、電話）貼進網路上的 AI 服務，請它幫你分類。",
    answer: "no",
    why: "兩條紅線同時踩到：一是個資，二是交給機關以外的第三方公司 —— 這類 AI 服務多半在國外，貼進去的文字就離開機關了。真要做，必須先把姓名電話等資訊拿掉，並依機關個資與資安規範取得核准。（第 6 關會實際做一次，也會再提醒這件事）",
  },
  {
    text: "想做一個給「全市府各局處」共用、而且要用好幾年的場地借用查詢系統。",
    answer: "ask",
    why: "跨局處、全市府、還要長期維運 —— 已經超出個人自主開發的範圍，應該先找資訊單位評估與納管。否則你一調職，它就變成沒人會修的黑盒子。",
  },
  {
    text: "市民向市政信箱陳情後，自動在科室的群組聊天室貼一則「有新案件，案號 1130512-007」。",
    answer: "self",
    why: "通知只帶案號、不帶姓名電話，屬於科室內部的流程自動化，可以自己做。（第 5 關會實際做一次；到時候要注意，那組「發通知用的網址」等同鑰匙，別外流）",
  },
];

export default function BoundaryLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.boundary}
      done={DONE.boundary}
      steps={[({ next }) => <RedLines onNext={next} />, ({ finish }) => <CaseGame onFinish={finish} />]}
    />
  );
}

/* ---------- 步驟 1：紅線在哪 ---------- */
function RedLines({ onNext }) {
  return (
    <div className="space-y-4">
      <Eyebrow>步驟 1 / 2 · 先認得紅線</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">你剛剛上線的那一頁，誰看得到？</h2>

      <div className="callout callout-info">
        答案是：<b className="text-ink">任何人。</b>只要拿到網址就打得開，不用帳號密碼，搜尋引擎也找得到。
        這不是 GitHub Pages 的缺點，而是它本來就是「給大家看」用的。
        <br />
        <br />
        所以真正要練的不是技術，而是動手前先問一句：
        <b className="text-ink">「這件事，我可以自己做嗎？」</b>
      </div>

      <div>
        <div className="text-[13px] font-extrabold text-muted mb-2">碰到這五件事其中之一，就先停下來 👇</div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {[
            ["🧑", "個資", "市民姓名、電話、身分證號、陳情內容"],
            ["🔒", "機敏資料", "未公開公文、內部檔案、標案資料"],
            ["🌐", "市民會當成市府官方系統在用的", "對外的正式服務"],
            ["🏢", "跨局處 / 全市府", "不只你科室自己用"],
            ["🔑", "需要登入、要分誰能看", "帳號與權限"],
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
        <b className="text-ink">停下來 ≠ 不能做。</b>只是代表這件事該由資訊單位評估、或由他們接手管理後再做 ——
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
        <Eyebrow>步驟 2 / 2 · 情境判斷</Eyebrow>
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
