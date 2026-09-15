import { useState } from "react";
import Level, { Eyebrow } from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

/* 納管前的最後一關，也是界線最吃緊的一關：
   前面所有關卡的資料不是唯讀（讀開放資料），就是別人幫你收（借一份 Google 表單）。
   Firebase 第一次讓前端「直接讀寫一個資料庫」—— 而誰能讀、誰能寫，變成你自己要設。 */

/* 安全規則模擬器：同一份資料，三種規則，三種來訪者。
   ok = 這個人在這條規則下能不能讀／寫。 */
const RULES = [
  {
    id: "open",
    code: "allow read, write: if true;",
    label: "全部開放",
    note: "測試模式最常留下來的那一行",
    who: { guest: true, other: true, owner: true },
    verdict: "bad",
    why: "誰都能讀、誰都能寫 —— 包含把整個資料庫抄走或清空的人。Firebase 建立時的「測試模式」規則 30 天後會失效，很多人就直接貼這一行讓它「不要再跳錯誤」，然後就這樣上線了。",
  },
  {
    id: "loggedin",
    code: "allow read, write: if request.auth != null;",
    label: "登入才能用",
    note: "看起來很安全，其實是最常見的錯",
    who: { guest: false, other: true, owner: true },
    verdict: "bad",
    why: "它只檢查「有沒有登入」，沒檢查「是不是你的資料」。任何人只要辦一個帳號登入，就能讀寫「所有人」的資料 —— 名詞小教室那張「登入 vs 權限」卡講的就是這件事：你是誰，和你能做什麼，是兩件事。",
  },
  {
    id: "owner",
    code: "allow read, write: if request.auth.uid == resource.data.owner;",
    label: "只能動自己的",
    note: "把「誰能做什麼」也寫進去",
    who: { guest: false, other: false, owner: true },
    verdict: "good",
    why: "除了要登入，還比對「這筆資料的擁有者是不是你」。這才是真正的權限控管。實務上還會依欄位、依角色再細分，但先抓住這個骨架。",
  },
];

const VISITORS = [
  { id: "guest", emoji: "🚶", name: "沒登入的路人", sub: "知道網址而已" },
  { id: "other", emoji: "🧑", name: "登入的其他人", sub: "隨便辦一個帳號就有" },
  { id: "owner", emoji: "🙋", name: "資料的主人", sub: "本來就該看得到" },
];

/* 界線判斷：這一關不做「真的去開一個 Firebase 專案」，
   因為對這個受眾，正確答案多半是「先問資訊單位」。 */
const CASES = [
  {
    id: "proto",
    text: "想做一個雛形給科長看：一個內部工具，資料全部是自己編的假資料。",
    answer: "ok",
    why: "假資料、給內部看、目的是驗證想法 —— 這正是 Firebase 最適合的用法。五分鐘就有資料庫和登入，不用等任何人。",
  },
  {
    id: "citizen",
    text: "做一個市民報名系統，把姓名、電話、身分證字號存進 Firestore。",
    answer: "no",
    why: "市民個資存進境外平台的資料庫，這是紅線。而且系統一旦有人在用就下不來了 —— 這種規模的東西本來就該走機關的正式流程。",
  },
  {
    id: "internal",
    text: "科內五個人共用的值班表，要登入才看得到，內容只有姓名和班別。",
    answer: "ask",
    why: "有同仁的姓名，而且是會持續使用的內部系統 —— 屬於灰色地帶。先問資訊單位：機關可能已經有現成的共用平台，不必另外接一個境外服務。",
  },
  {
    id: "public",
    text: "把已經公開的活動場地清單放進去，讓網頁查詢，任何人都能看。",
    answer: "ok",
    why: "本來就公開的資料，讀取開放沒問題。但寫入一定要關掉 —— 不然任何人都能改掉你的場地清單。",
  },
];

const V = {
  ok: { label: "✅ 可以自己做", color: "var(--diy-green-text)", soft: "var(--success-soft)" },
  ask: {
    label: "⚠️ 先問資訊單位",
    color: "var(--diy-yellow-text)",
    soft: "color-mix(in srgb, var(--sun) 16%, var(--surface))",
  },
  no: { label: "⛔ 不該這樣做", color: "var(--diy-red-text)", soft: "var(--danger-soft)" },
};

const CHECKLIST = [
  "資料庫規則不是 if true —— 去 Console 的「規則」頁自己看一眼，不要相信記憶",
  "寫入至少要登入，而且比對「是不是本人的資料」",
  "裡面沒有真實的市民個資（練習一律用假資料）",
  "知道免費額度用完會怎樣 —— 被大量寫入灌爆時，是停止服務還是開始收費",
  "這個東西如果變成同仁天天在用的系統，已經跟資訊單位報備過了",
];

export default function FirebaseLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.firebase}
      done={{ ...DONE.firebase }}
      steps={[
        ({ next }) => <ConceptStep onNext={next} />,
        ({ next }) => <RulesStep onNext={next} />,
        ({ finish }) => <BoundaryStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：它跨過了哪一條線 ---------- */
function ConceptStep({ onNext }) {
  const [on, setOn] = useState(false);

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 1 / 3 · 這是什麼</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">第一次，你的網頁有了資料庫 🔥</h2>

      <div className="callout callout-info">
        前面每一關的資料，不是<b className="text-ink">唯讀</b>（讀開放資料），就是
        <b className="text-ink">別人幫你收</b>（平台的表單）。Firebase 不一樣 —— 它讓你的網頁
        <b className="text-ink">直接讀寫一個資料庫</b>，而且附帶登入功能。
      </div>

      <div className="border-2 border-line rounded-[18px] bg-surface2 p-4 space-y-3">
        <label className="flex items-center gap-2.5 text-sm font-bold cursor-pointer">
          <input
            type="checkbox"
            checked={on}
            onChange={(e) => setOn(e.target.checked)}
            style={{ width: 20, height: 20, accentColor: "var(--mint)" }}
          />
          改用 Firebase
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2.5" data-arch>
          <div className="card card-sm text-center">
            <div className="text-3xl">🖥️</div>
            <div className="text-sm font-bold text-ink mt-1">你的網頁</div>
            <div className="text-xs text-muted">靜態檔案</div>
          </div>
          <div className="text-2xl text-muted text-center">→</div>
          <div
            className="card card-sm text-center"
            style={{ borderColor: on ? "var(--mint)" : "var(--border)" }}
          >
            <div className="text-3xl">{on ? "🔥" : "🏗️"}</div>
            <div className="text-sm font-bold text-ink mt-1">
              {on ? "Firebase（資料庫＋登入）" : "要自己寫的後端"}
            </div>
            <div className="text-xs text-muted">{on ? "Google 幫你架好了" : "沒有它就存不了資料"}</div>
          </div>
        </div>

        <p className="text-sm text-muted m-0">
          {on ? (
            <>
              <b className="text-ink">注意：它不是「沒有後端」，是後端別人幫你寫好了。</b>
              　所以「誰能讀、誰能寫」這件事沒有消失 —— 它變成一份你要自己設定的
              <b className="text-ink">安全規則</b>。下一步就是這個。
            </>
          ) : (
            <>沒有 Firebase 的話，要存資料就得自己寫一台後端、再自己找地方跑 —— 那是第 10 關「Flask」和第 11 關「自架」的範圍。</>
          )}
        </p>
      </div>

      <div
        className="callout"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">等一下 —— 第 3 關不是說金鑰不能放在前端嗎？</b>
        <div className="mt-1.5">
          Firebase 的設定裡有一個叫 <code className="font-mono text-xs">apiKey</code> 的東西，而且它
          <b className="text-ink">本來就是要放在網頁裡的</b>、公開沒關係。因為它不是密碼，只是「哪一個
          Firebase 專案」的<b className="text-ink">識別碼</b> —— 就像門牌號碼，知道門牌不等於能進門。
        </div>
        <div className="mt-1.5">
          <b className="text-ink">真正的門鎖是安全規則。</b>
          這也是為什麼下一步那麼重要：門牌是公開的，所以鎖沒鎖好，全世界都進得來。
        </div>
      </div>

      <button type="button" className="btn btn-primary" disabled={!on} onClick={onNext}>
        {on ? "下一步：那把鎖怎麼設 →" : "先把上面的勾勾打開"}
      </button>
    </div>
  );
}

/* ---------- 步驟 2：安全規則模擬器 ---------- */
function RulesStep({ onNext }) {
  const [rid, setRid] = useState(null);
  const [seen, setSeen] = useState(() => new Set());
  const rule = RULES.find((r) => r.id === rid);
  const all = seen.size === RULES.length;

  const pick = (id) => {
    setRid(id);
    setSeen((s) => new Set(s).add(id));
  };

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 2 / 3 · 核心</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">安全規則：誰能讀，誰能寫 🔐</h2>
      <p className="text-muted text-sm">三種規則都點一次，看看同一份資料，誰進得來。</p>

      <div className="flex flex-wrap gap-2">
        {RULES.map((r) => (
          <button
            key={r.id}
            type="button"
            data-rule={r.id}
            onClick={() => pick(r.id)}
            className={`gh-btn ${rid === r.id ? "!border-primary !bg-primarySoft text-primary" : ""}`}
          >
            {seen.has(r.id) && rid !== r.id ? "✓ " : ""}
            {r.label}
          </button>
        ))}
      </div>

      {rule ? (
        <>
          <pre className="font-mono text-[13px] bg-surface2 border border-line rounded-[10px] p-3 overflow-x-auto whitespace-pre m-0">
            {rule.code}
          </pre>
          <p className="text-xs text-muted m-0">{rule.note}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" data-visitors>
            {VISITORS.map((v) => {
              const can = rule.who[v.id];
              return (
                <div
                  key={v.id}
                  data-visitor={v.id}
                  className="border-2 rounded-[14px] p-3 text-center"
                  style={{
                    borderColor: can ? "var(--danger)" : "var(--border)",
                    background: can
                      ? "color-mix(in srgb, var(--danger) 8%, var(--surface))"
                      : "var(--surface)",
                  }}
                >
                  <div className="text-3xl">{v.emoji}</div>
                  <div className="text-sm font-bold text-ink mt-1">{v.name}</div>
                  <div className="text-xs text-muted mb-2">{v.sub}</div>
                  <div
                    className="text-sm font-extrabold"
                    style={{ color: can ? "var(--danger)" : "var(--diy-green-text)" }}
                  >
                    {can ? "能讀 · 能寫" : "進不來"}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted m-0">
            （「資料的主人」進得來是應該的，所以第三種規則才是對的 —— 紅色只是提醒「這個人現在打得開」。）
          </p>

          <div
            className="callout"
            style={{
              borderLeftColor: rule.verdict === "good" ? "var(--mint)" : "var(--danger)",
              background:
                rule.verdict === "good"
                  ? "color-mix(in srgb, var(--mint) 12%, var(--surface))"
                  : "color-mix(in srgb, var(--danger) 8%, var(--surface))",
            }}
          >
            <b className="text-ink">{rule.verdict === "good" ? "✅ 這個才對：" : "⚠️ 問題在哪："}</b>
            <div className="mt-1">{rule.why}</div>
          </div>
        </>
      ) : (
        <div className="text-muted text-sm py-6 text-center border-2 border-line rounded-[14px] bg-surface2">
          👆 先點上面一種規則
        </div>
      )}

      {all && (
        <div
          className="callout"
          style={{
            borderLeftColor: "var(--danger)",
            background: "color-mix(in srgb, var(--danger) 8%, var(--surface))",
          }}
        >
          <b className="text-ink">這不是假想的問題。</b>
          <div className="mt-1.5">
            有研究抽樣了 950 個開源專案的 Firebase 規則，
            <b className="text-ink">將近四分之一把資料庫留在全世界都讀得到的狀態</b>
            ；2024 年另一份研究掃出超過 1.2 億筆外洩記錄，包含 email、明文密碼、位置與財務資料。
          </div>
          <div className="mt-1.5">
            原因幾乎都一樣：<b className="text-ink">開發時為了方便把規則開開的，然後忘了關</b>
            。而 AI 幫你寫的 app 特別容易這樣 —— 它會讓程式「跑得起來」，但不會提醒你回頭把門鎖上。
          </div>
        </div>
      )}

      <button type="button" className="btn btn-primary" disabled={!all} onClick={onNext}>
        {all ? "下一步：那我到底能不能用？ →" : `三種規則都點看看（${seen.size} / 3）`}
      </button>
    </div>
  );
}

/* ---------- 步驟 3：界線 + 上線前檢查 + 測驗 ---------- */
function BoundaryStep({ onFinish }) {
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState(() => CHECKLIST.map(() => false));
  const [passed, setPassed] = useState(false);
  const answered = Object.keys(picked).length;
  const all = answered === CASES.length;

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 3 / 3 · 界線</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">那我到底能不能用？🚦</h2>

      <div className="callout">
        Firebase 很好用，但它讓你<b className="text-ink">一個人就能架起一個真的系統</b> ——
        而這正是界線最容易被跨過去的時候。四個情境，用你在第 4 關學的那條線判斷。
      </div>

      <div className="grid gap-2.5">
        {CASES.map((c) => {
          const my = picked[c.id];
          const right = my === c.answer;
          return (
            <div key={c.id} data-fb={c.id} className="border-2 border-line rounded-[14px] bg-surface p-3.5">
              <p className="text-[15px] text-ink m-0 mb-2.5">{c.text}</p>
              {!my ? (
                <div className="flex flex-wrap gap-2">
                  {["ok", "ask", "no"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className="gh-btn gh-btn-sm"
                      onClick={() => setPicked((s) => ({ ...s, [c.id]: v }))}
                    >
                      {V[v].label}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-[12px] p-3 border-2"
                  style={{ borderColor: "var(--border)", background: V[c.answer].soft }}
                >
                  <div className="text-sm font-extrabold mb-1" style={{ color: V[c.answer].color }}>
                    {right ? "判斷正確 —— " : "正解是 —— "}
                    {V[c.answer].label}
                  </div>
                  <p className="text-sm text-ink m-0">{c.why}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {all && (
        <div className="border-2 border-line rounded-[16px] bg-surface2 p-4 space-y-2.5">
          <div className="text-[13px] font-extrabold text-muted">
            ✅ 真的要用的話，上線前把這五件事確認過
          </div>
          <ul className="list-none p-0 m-0 grid gap-2">
            {CHECKLIST.map((t, i) => (
              <li key={i}>
                <label className="flex gap-2.5 items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={(e) => setChecked((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
                    className="mt-0.5 shrink-0"
                    style={{ accentColor: "var(--mint)", width: 20, height: 20 }}
                  />
                  <span className="text-sm text-ink">{t}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted m-0">
            第一項特別重要：<b className="text-ink">去 Console 的「規則」頁自己看一眼</b>
            。很多外洩案例不是不知道要設，是<b className="text-ink">以為自己設過了</b>。
          </p>
        </div>
      )}

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.firebase} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!all || !passed} onClick={onFinish}>
        {all ? "完成這一關 🎉" : "先把四個情境都判斷過"}
      </button>
    </div>
  );
}
