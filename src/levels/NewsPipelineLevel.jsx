import { useState } from "react";
import Level, { Eyebrow } from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

/* 最後一關：把前面學過的四件事串成一條真的會自己跑的線。

   這一關刻意不教任何新的「部署方式」—— 它教的是「整合」：
   RSS（第 6 關的 API）→ Actions 排程（第 5 關）→ AI 摘要（第 8 關）
   → Discord webhook（第 7 關），金鑰放 Actions secrets（第 3 關）。

   ⚠️ 教學重點不是「怎麼接起來」，而是「什麼東西可以送進免費 AI」：
   免費方案的條款是你送進去的內容可能被拿去改善該公司的產品，
   所以只適合送「已經公開」的東西。這是這一關真正的骨幹。 */

const STAGES = [
  {
    id: "rss",
    icon: "📰",
    label: "北市府新聞稿 RSS",
    from: "第 6 關 · API",
    what: "市府把每天的新聞稿整理成一個固定網址，打開就是一包結構化資料（XML）。你不用去爬網頁，它主動整理好給你。",
    tip: "動手前先做一件事：把那個網址直接貼進瀏覽器打開看一眼，確認它實際有哪些欄位 —— 這就是第 6 關教的「先看回傳什麼再寫程式」。",
  },
  {
    id: "cron",
    icon: "⏰",
    label: "GitHub Actions 每天 12:00",
    from: "第 5 關 · Actions",
    what: "跟這個教學網站自動上線用的是同一套東西，只是觸發條件從「有人推程式碼」換成「時間到了」。不用自己準備一台一直開著的機器。",
    tip: "但它跑在 UTC，不是台灣時間 —— 下一步會實際換算一次。",
  },
  {
    id: "ai",
    icon: "🤖",
    label: "Gemini 摘要與分析",
    from: "第 8 關 · AI 服務",
    what: "把新聞稿全文丟給 AI，請它整理成摘要、標出相關的業務局處、以及建議列管的事項。這是整條線裡唯一「把資料交給外部公司」的一段。",
    tip: "也因此它是唯一需要做界線判斷的一段 —— 第 3 步會專門處理。",
  },
  {
    id: "discord",
    icon: "💬",
    label: "推到 Discord 給同仁",
    from: "第 7 關 · Webhook",
    what: "跟第 7 關用 GAS 推播是同一招：一個 webhook 網址，POST 一段 JSON 過去，群組就收到訊息。",
    tip: "那個 webhook 網址等同鑰匙，拿到的人都能用你的名義發訊息 —— 所以它要放 secrets。",
  },
];

/* 給學員直接拿去用的 prompt。

   這門課從第 1 關就在教「AI 幫你寫」，最後一關不該還要學員自己逐行手刻 ——
   但重點不是省事，是讓他們看見：真正要學的是「把需求講清楚」。
   所以這段 prompt 刻意把整關教過的四個坑都寫成明文條件（金鑰進 secrets、
   cron 是 UTC、聯絡人不進 AI、Discord 2000 字上限），
   照著貼出去，AI 寫出來的東西就會自己守住這一關的界線。 */
const AI_PROMPT = `我是臺北市政府的公務員，不是資訊人員。請幫我做一件每天會自動跑的事，並且用我看得懂的方式說明。

【我要做的事】
每天中午 12 點（台灣時間），自動抓臺北市政府的新聞稿 RSS，
請 AI 整理成當日彙整（每一則：一句話摘要、相關業務局處、建議列管事項），
再推到 Discord 頻道通知同仁。

【要用的東西】
- 新聞稿 RSS：https://www.gov.taipei/OpenData.aspx?SN=7DEC7150E6BAD606
- 排程：GitHub Actions（我沒有一台一直開著的機器）
- AI：Google Gemini API（免費方案）
- 通知：Discord Webhook

【請務必遵守的條件】
1. 金鑰絕對不可以寫在程式碼裡。請用 GitHub Actions secrets，
   名稱用 GEMINI_API_KEY 和 DISCORD_WEBHOOK，並告訴我去哪裡設定。
2. GitHub Actions 的 cron 跑的是 UTC，不是台灣時間。
   請幫我換算成正確的 UTC 時間，並在 yml 裡用註解寫清楚原因。
3. 除了排程，也要能手動觸發（workflow_dispatch），方便我測試。
4. 只把「新聞稿本身已經公開的內容」送給 AI。
   承辦人姓名、電話、分機、email 一律不要放進送給 AI 的文字，也不要推到 Discord。
5. Discord 單則訊息有 2000 字上限，超過請自動分段送出，不要讓它整個失敗。
6. 抓不到資料、AI 沒回應、Discord 推不出去的時候，
   要在 Actions 的紀錄裡留下看得懂的錯誤訊息，不要安靜地失敗。
7. 這個排程如果 60 天沒有新的 commit 會被 GitHub 自動停用，
   請提醒我這件事，並告訴我怎麼確認它還活著。

【請給我】
1. 放在 .github/workflows/ 底下的 workflow 檔
2. 實際執行的腳本檔
3. 一份我照著做就好的步驟清單：每個檔案要放在 repo 的哪個路徑、
   secrets 在哪裡設定、怎麼手動跑第一次確認它會動
4. 程式碼請加上中文註解說明「這段在做什麼」，我之後要自己維護

【最後提醒我一件事】
先幫我確認那個 RSS 網址實際回傳哪些欄位。
如果跟你預設的欄位名稱不一樣，直接告訴我要改哪一行。`;

/* 示範用的假新聞稿。人名、電話、分機都是編的 —— 這門課一路上都用假資料。 */
const SAMPLES = [
  {
    id: "road",
    org: "交通局",
    date: "115-03-12",
    title: "「中正區重慶南路一段道路品質改善工程」3 月 18 日起施工",
    body: "臺北市政府交通局表示，為改善重慶南路一段（忠孝西路至愛國西路）路面品質，訂於 3 月 18 日起進行路面刨除重鋪，預計 4 月 30 日完工。施工期間採半半施工方式，維持雙向各一車道通行，並於尖峰時段加派人員疏導。",
    contact: "交通局工務科 王小明　02-2720-8888 分機 1234",
    ai: {
      summary:
        "重慶南路一段（忠孝西路至愛國西路）3/18 起路面刨除重鋪，預計 4/30 完工；施工期間半半施工、維持雙向各一車道，尖峰加派疏導人力。",
      orgs: ["交通局（主辦）", "工務局新建工程處（協辦）"],
      track: ["開工前的用路人宣導是否完成", "施工期間交通維持計畫", "周邊里辦公處是否已通知"],
    },
  },
  {
    id: "lunch",
    org: "衛生局",
    date: "115-03-12",
    title: "本市校園午餐聯合稽查結果出爐　2 家供餐業者限期改善",
    body: "臺北市政府衛生局會同教育局辦理校園午餐聯合稽查，本次抽查 45 家供餐業者，其中 2 家因作業環境衛生不符規定，已要求限期改善並將於 2 週內複查。稽查結果同步公布於衛生局網站。",
    contact: "衛生局食品藥物管理科 陳美玲　02-2375-3000 分機 5678",
    ai: {
      summary:
        "衛生局會同教育局稽查 45 家校園午餐供餐業者，2 家環境衛生不符規定、限期改善，2 週內複查，結果已公布於局網。",
      orgs: ["衛生局（主辦）", "教育局（會同稽查）"],
      track: ["2 週後的複查結果", "不合格業者供餐學校的後續處理", "是否需通知家長會"],
    },
  },
];

/* 界線判斷：這一關唯一會把資料交給外部公司的是「送進 AI」那一段，
   所以三題全部圍著「什麼東西可以送進去」打轉。 */
const AI_CASES = [
  {
    id: "public",
    text: "已經發布在市府官網上的新聞稿全文。",
    answer: "ok",
    why: "已核定、已經對外公開的內容 —— 送進 AI 不會讓任何本來看不到的人看到它。這就是為什麼這條線選「新聞稿」當素材，而不是選內部公文。",
  },
  {
    id: "contact",
    text: "新聞稿最後那行「新聞聯絡人：王小明　02-2375-3000 分機 5678」。",
    answer: "ask",
    why: "這是印在公開新聞稿上的公務聯絡資訊，不是私人個資 —— 但有兩件事要想：一是免費方案會把你送進去的內容拿去改善該公司的產品，二是推進群組等於再散布一次。要做列管追蹤，推「哪個局處」通常就夠了，人名留在原始連結裡讓要找的人自己點進去。",
  },
  {
    id: "draft",
    text: "還在簽核中、尚未發布的新聞稿草稿，想先請 AI 潤稿。",
    answer: "no",
    why: "未公開＝機敏。免費方案的條款是你送進去的內容可能被拿去訓練，等於把還沒發布的東西交出去了。真的要用 AI 潤稿，得走機關核可過的服務，或至少確認該方案沒有「拿去訓練」這條。",
  },
];

const FV = {
  ok: { label: "✅ 可以送", color: "var(--diy-green-text)", soft: "var(--success-soft)" },
  ask: {
    label: "⚠️ 先想一下",
    color: "var(--diy-yellow-text)",
    soft: "color-mix(in srgb, var(--sun) 16%, var(--surface))",
  },
  no: { label: "⛔ 不該送", color: "var(--diy-red-text)", soft: "var(--danger-soft)" },
};

const WORKFLOW_YML = `name: 每日新聞稿彙整

on:
  schedule:
    # ⚠️ Actions 的排程跑在 UTC，不是台灣時間。
    # 台灣 12:00 = UTC 04:00，所以這裡寫 4 不是 12。
    - cron: "0 4 * * *"
  workflow_dispatch:   # 加這行就能在網頁上手動按一下就跑，測試時很好用

jobs:
  digest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: node scripts/news-digest.mjs
        env:
          # 金鑰不寫在程式碼裡，從 secrets 帶進來
          GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
          DISCORD_WEBHOOK: \${{ secrets.DISCORD_WEBHOOK }}`;

const SCRIPT_JS = `const FEED = "https://www.gov.taipei/OpenData.aspx?SN=7DEC7150E6BAD606";

// 1) 抓 RSS。Node 20 內建 fetch，不用裝任何套件
const xml = await fetch(FEED).then((r) => r.text());

// 2) 取出項目。這裡用的是 RSS 2.0 的通用欄位 ——
//    動手前請先把 FEED 那個網址貼進瀏覽器，確認實際有哪些欄位
const pick = (block, tag) => {
  const m = block.match(
    new RegExp(\`<\${tag}>(?:<!\\\\[CDATA\\\\[)?([\\\\s\\\\S]*?)(?:\\\\]\\\\]>)?</\${tag}>\`)
  );
  return m ? m[1].trim() : "";
};
const items = [...xml.matchAll(/<item>([\\s\\S]*?)<\\/item>/g)]
  .map((m) => ({
    title: pick(m[1], "title"),
    link: pick(m[1], "link"),
    date: pick(m[1], "pubDate"),
  }))
  .slice(0, 10); // 一天最多處理 10 則，免費額度有限

if (items.length === 0) {
  console.log("今天沒有新項目，結束");
  process.exit(0);
}

// 3) 請 Gemini 摘要 + 標出相關局處
const prompt = \`你是市府幕僚。請把以下新聞稿標題整理成每日彙整，
每則輸出：一句話摘要、可能相關的業務局處、建議列管事項。
用繁體中文，簡潔條列。

\${items.map((it, i) => \`\${i + 1}. \${it.title}（\${it.link}）\`).join("\\n")}\`;

const res = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  }
).then((r) => r.json());

const summary = res?.candidates?.[0]?.content?.parts?.[0]?.text ?? "（AI 沒有回傳內容）";

// 4) 推到 Discord。單則訊息上限 2000 字，先截斷再送
await fetch(process.env.DISCORD_WEBHOOK, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    content: \`📰 **今日市府新聞稿彙整**（\${items.length} 則）\\n\\n\${summary}\`.slice(0, 1900),
  }),
});

console.log("已推送", items.length, "則");`;

export default function NewsPipelineLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.newsPipeline}
      done={{ ...DONE.newsPipeline }}
      steps={[
        ({ next }) => <StageStep onNext={next} />,
        ({ next }) => <RunStep onNext={next} />,
        ({ next }) => <BoundaryStep onNext={next} />,
        ({ finish }) => <RealStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：這條線串起了什麼 ---------- */
function StageStep({ onNext }) {
  const [open, setOpen] = useState("rss");

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 1 / 4 · 這是什麼</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">最後一關：把學過的四件事串成一條線 🔗</h2>

      <div className="callout callout-info">
        這一關<b className="text-ink">沒有新的部署方式要學</b>
        —— 它要做的是把你前面學過的東西接起來，變成一件每天中午會自己發生的事：
        <b className="text-ink">
          抓市府新聞稿 → 請 AI 摘要並標出相關局處 → 推到 Discord 給同仁，方便列管追蹤
        </b>
        。
      </div>

      <div className="grid gap-2" data-stages>
        {STAGES.map((s, i) => {
          const isOpen = open === s.id;
          return (
            <div key={s.id} data-stage={s.id}>
              {i > 0 && (
                <div className="text-center text-muted text-lg leading-none py-0.5" aria-hidden="true">
                  ↓
                </div>
              )}
              <div
                className="border-2 rounded-[16px] bg-surface overflow-hidden transition-colors"
                style={{ borderColor: isOpen ? "var(--accent)" : "var(--border)" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-3.5 flex items-center gap-3"
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {s.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-ink">{s.label}</div>
                    <div className="text-xs text-accentText font-bold">{s.from}</div>
                  </div>
                  <span className="text-muted text-lg">{isOpen ? "▴" : "▾"}</span>
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-3 border-t-2 border-line space-y-2">
                    <p className="text-sm text-ink m-0">{s.what}</p>
                    <p className="text-[13px] text-muted m-0">💡 {s.tip}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="callout"
        style={{
          borderLeftColor: "var(--mint)",
          background: "color-mix(in srgb, var(--mint) 12%, var(--surface))",
        }}
      >
        <b className="text-ink">四段裡有三段你已經做過了。</b>
        真正需要重新判斷的只有中間那段「把資料交給 AI」 —— 第 3 步會專門處理它。
      </div>

      <PromptToAI />

      <button type="button" className="btn btn-primary" onClick={onNext}>
        下一步：先看它跑完長什麼樣 →
      </button>
    </div>
  );
}

/* 把整條線的需求寫成一段可以直接貼給 AI 的規格書。
   複製鈕放在外面、不用展開就按得到 —— 大部分人只想複製，不想先讀四十行。 */
function PromptToAI() {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      data-ai-prompt
      className="rounded-[16px] border-2 overflow-hidden"
      style={{
        borderColor: "color-mix(in srgb, var(--accent) 45%, var(--border))",
        background: "color-mix(in srgb, var(--accent) 8%, var(--surface))",
      }}
    >
      <div className="p-3.5 flex items-start gap-3">
        <span className="text-2xl leading-none" aria-hidden="true">
          ✍️
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-ink">不用自己寫 —— 把這段話交給 AI 就好</div>
          <p className="text-[13px] text-muted mt-1 mb-0">
            複製下面這段，貼進 Claude、Gemini 或 ChatGPT，它就會把這條線需要的程式碼寫給你。
            <b className="text-ink">
              這段文字本身就是一份規格書 —— 這一關真正要學的是「把需求講清楚」，不是把程式碼背起來。
            </b>
          </p>
        </div>
      </div>

      <div className="px-3.5 pb-3 flex gap-2 flex-wrap">
        <button type="button" className="btn btn-accent btn-sm" data-copy-prompt onClick={copy}>
          {copied ? "已複製 ✓" : "複製這段 prompt 📋"}
        </button>
        <button
          type="button"
          className="gh-btn gh-btn-sm"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "收合內容 ▴" : "先看看內容寫了什麼 ▾"}
        </button>
      </div>

      {open && (
        <div className="px-3.5 pb-3">
          <pre
            data-prompt-text
            className="font-mono text-[12px] leading-relaxed bg-surface2 border border-line rounded-[10px] p-3.5 overflow-x-auto whitespace-pre-wrap m-0"
          >
            {AI_PROMPT}
          </pre>
        </div>
      )}

      <div className="px-3.5 pb-3.5">
        <p className="text-[12.5px] text-muted m-0">
          ⚠️ <b className="text-ink">AI 寫出來的東西要自己看過再用。</b>
          尤其確認三件事：金鑰有沒有真的寫成 secrets（而不是直接寫在程式碼裡）、
          cron 時間有沒有換算成 UTC、送進 AI 的內容裡有沒有混進承辦人的聯絡資訊。
          後面三步就是在教你怎麼檢查這三件事。
        </p>
      </div>
    </div>
  );
}

/* ---------- 步驟 2：跑一次給你看 ----------
   聯絡人資訊預設關閉，打開才會出現在 AI 輸入與 Discord 輸出裡 ——
   把「要不要送」做成一個真的開關，比寫一段警語有用。 */
function RunStep({ onNext }) {
  const [pick, setPick] = useState(SAMPLES[0].id);
  const [withContact, setWithContact] = useState(false);
  const [ran, setRan] = useState(false);
  const s = SAMPLES.find((x) => x.id === pick);

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 2 / 4 · 跑一次給你看</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">一則新聞稿，進去出來變成什麼 🔍</h2>
      <p className="text-muted text-sm m-0">
        下面的新聞稿是<b className="text-ink">編的</b>，人名電話都是假的 —— 跟這門課一路上的做法一樣。
      </p>

      <div className="flex flex-wrap gap-2">
        {SAMPLES.map((x) => (
          <button
            key={x.id}
            type="button"
            data-sample={x.id}
            onClick={() => {
              setPick(x.id);
              setRan(false);
            }}
            className={`px-3.5 py-2 rounded-[12px] border-2 text-sm font-bold transition-all ${
              pick === x.id ? "border-primary bg-primarySoft text-ink" : "border-line bg-surface text-ink"
            }`}
          >
            {x.org}：{x.title.slice(1, 9)}…
          </button>
        ))}
      </div>

      {/* 輸入：原始新聞稿 */}
      <div className="border-2 border-line rounded-[16px] bg-surface2 p-3.5">
        <div className="text-xs font-extrabold text-muted mb-2">📰 RSS 抓到的原始新聞稿</div>
        <div className="bg-surface border border-line rounded-[12px] p-3.5">
          <div className="text-xs text-muted">
            {s.org}　{s.date}
          </div>
          <div className="font-bold text-ink mt-1">{s.title}</div>
          <p className="text-sm text-ink mt-1.5 mb-0">{s.body}</p>
          <p className="text-[13px] text-muted mt-2 mb-0" data-contact-line>
            新聞聯絡人：{s.contact}
          </p>
        </div>
      </div>

      <label className="flex items-start gap-2.5 text-sm cursor-pointer border-2 border-line rounded-[14px] bg-surface p-3.5">
        <input
          type="checkbox"
          data-contact-toggle
          checked={withContact}
          onChange={(e) => setWithContact(e.target.checked)}
          className="mt-0.5 shrink-0 cursor-pointer"
          style={{ accentColor: "var(--mint)", width: 20, height: 20 }}
        />
        <span>
          <b className="text-ink">把「新聞聯絡人」也送進 AI、並推到 Discord</b>
          <span className="block text-[13px] text-muted mt-0.5">
            先不要勾，跑一次看看；再勾起來比較差在哪。
          </span>
        </span>
      </label>

      <div className="text-center">
        <button type="button" className="btn btn-accent" data-run onClick={() => setRan(true)}>
          ▶ 跑一次這條線
        </button>
      </div>

      {ran && (
        <div className="space-y-3 animate-pop" data-output>
          {/* AI 輸出 */}
          <div className="border-2 border-line rounded-[16px] bg-surface2 p-3.5">
            <div className="text-xs font-extrabold text-muted mb-2">🤖 Gemini 整理出來的</div>
            <div className="bg-surface border border-line rounded-[12px] p-3.5 space-y-2 text-sm">
              <div>
                <b className="text-ink">摘要：</b>
                {s.ai.summary}
              </div>
              <div>
                <b className="text-ink">相關局處：</b>
                {s.ai.orgs.join("、")}
              </div>
              <div>
                <b className="text-ink">建議列管：</b>
                <ul className="list-disc pl-5 m-0 mt-1 text-ink">
                  {s.ai.track.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              {withContact && (
                <div data-ai-contact>
                  <b className="text-ink">承辦聯絡人：</b>
                  {s.contact}
                </div>
              )}
            </div>
          </div>

          {/* Discord 輸出 */}
          <div className="border-2 border-line rounded-[16px] bg-surface2 p-3.5">
            <div className="text-xs font-extrabold text-muted mb-2">💬 #市府新聞稿-每日彙整 頻道</div>
            <div className="flex items-start gap-2">
              <span className="text-xl" aria-hidden="true">
                🤖
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink">
                  新聞稿彙整機器人 <span className="text-muted font-normal">· 今天 12:00</span>
                </div>
                <div className="text-sm bg-surface border border-line rounded-lg px-3 py-2 mt-0.5 space-y-1">
                  <div className="font-bold text-ink">📰 今日市府新聞稿彙整</div>
                  <div className="text-ink">{s.title}</div>
                  <div className="text-muted text-[13px]">{s.ai.summary}</div>
                  <div className="text-[13px]">
                    <b className="text-ink">相關局處：</b>
                    {s.ai.orgs.join("、")}
                  </div>
                  {withContact && (
                    <div className="text-[13px]" data-discord-contact>
                      <b className="text-ink">聯絡人：</b>
                      {s.contact}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {withContact && (
            <div
              className="callout m-0"
              data-contact-warn
              style={{
                borderLeftColor: "var(--sun)",
                background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
              }}
            >
              <b className="text-ink">你剛剛多送了兩個地方：</b>
              人名和分機進了 AI 公司的伺服器，也進了聊天群組（會被轉傳、被搜尋、留在紀錄裡）。
              它確實印在公開新聞稿上，但「要不要再散布一次」是你的決定 ——
              <b className="text-ink">要列管追蹤的話，推到「局處」通常就夠了</b>
              ，真的要找人時點原始連結進去看。下一步會把這個判斷講完。
            </div>
          )}

          <button type="button" className="btn btn-primary" onClick={onNext}>
            下一步：那什麼東西可以送進 AI？ →
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- 步驟 3：界線與排程 ---------- */
function BoundaryStep({ onNext }) {
  const [picked, setPicked] = useState({});
  const [hour, setHour] = useState(12);
  const answered = Object.keys(picked).length;
  const allDone = answered === AI_CASES.length;

  // 台灣是 UTC+8，所以 UTC 的小時要往回推 8 個鐘頭
  const utcHour = (hour - 8 + 24) % 24;
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 3 / 4 · 界線與排程</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">送進 AI 之前，先過一次界線 🚦</h2>

      <div
        className="callout"
        style={{
          borderLeftColor: "var(--danger)",
          background: "color-mix(in srgb, var(--danger) 8%, var(--surface))",
        }}
      >
        <b className="text-ink">先講最重要的一件事：免費方案通常會拿你送進去的內容去訓練。</b>
        <div className="mt-1.5 text-sm">
          免費的 Gemini API 方案，條款寫的是「你的輸入與輸出可能被用來改善 Google 的產品」；
          付費方案和企業版（Vertex AI）才沒有這一條。
          <b className="text-ink">所以免費方案只適合送「已經公開」的東西</b> ——
          這也正是這條線選「新聞稿」而不是選內部公文的原因。
        </div>
        <div className="mt-1.5 text-[13px] text-muted">
          （各家 AI 服務的條款都會變，真的要用之前去該服務的條款頁再確認一次。）
        </div>
      </div>

      <div className="text-sm font-extrabold text-muted">🧪 這三樣東西，可以送進免費 AI 嗎？</div>

      <div className="grid gap-2.5">
        {AI_CASES.map((c) => {
          const my = picked[c.id];
          const right = my === c.answer;
          return (
            <div key={c.id} data-case={c.id} className="border-2 border-line rounded-[14px] bg-surface p-3.5">
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
                      {FV[v].label}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-[12px] p-3 border-2"
                  style={{ borderColor: "var(--border)", background: FV[c.answer].soft }}
                >
                  <div className="text-sm font-extrabold mb-1" style={{ color: FV[c.answer].color }}>
                    {right ? "判斷正確 —— " : "正解是 —— "}
                    {FV[c.answer].label}
                  </div>
                  <p className="text-sm text-ink m-0">{c.why}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="space-y-4 animate-pop">
          <hr className="border-0 border-t border-line" />

          <h3 className="text-xl font-bold text-ink m-0">再來是排程：12:00 不是你想的那個 12:00 ⏰</h3>
          <div className="callout callout-info">
            GitHub Actions 的排程<b className="text-ink">跑在 UTC</b>
            （世界標準時間），不是台灣時間。台灣比 UTC 快 8 小時，所以你想要的時間要先往回推 8 個鐘頭再寫進去。
          </div>

          <div className="border-2 border-line rounded-[18px] bg-surface2 p-4 space-y-3" data-cron>
            <label className="text-[13px] font-bold block">你想讓它在台灣時間幾點跑？</label>
            <input
              type="range"
              min="0"
              max="23"
              value={hour}
              data-cron-hour
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "var(--primary)" }}
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="border-2 border-line rounded-[14px] bg-surface p-3 text-center">
                <div className="text-xs font-extrabold text-muted">台灣時間</div>
                <div className="text-2xl font-bold text-ink font-mono mt-1">{pad(hour)}:00</div>
              </div>
              <div
                className="border-2 rounded-[14px] p-3 text-center"
                style={{
                  borderColor: "var(--mint)",
                  background: "color-mix(in srgb, var(--mint) 12%, var(--surface))",
                }}
              >
                <div className="text-xs font-extrabold text-muted">要寫進 workflow 的 cron</div>
                <div className="text-2xl font-bold text-ink font-mono mt-1" data-cron-out>
                  0 {utcHour} * * *
                </div>
              </div>
            </div>
            <p className="text-[13px] text-muted m-0">
              想要台灣 <b className="text-ink">{pad(hour)}:00</b> 跑，就要寫 UTC 的{" "}
              <b className="text-ink">{pad(utcHour)}:00</b>。如果你直接把 {pad(hour)} 寫進去，它會變成台灣時間的{" "}
              <b className="text-ink">{pad((hour + 8) % 24)}:00</b> 才跑。
            </p>
          </div>

          <div
            className="callout"
            style={{
              borderLeftColor: "var(--sun)",
              background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
            }}
          >
            <b className="text-ink">排程還有三個要先知道的坑：</b>
            <ul className="list-disc pl-5 mt-1.5 mb-0 text-sm space-y-1">
              <li>
                <b className="text-ink">不保證準時。</b>
                整點是全世界的尖峰，可能延遲幾分鐘到更久。別拿它做分秒必爭的事。
              </li>
              <li>
                <b className="text-ink">repo 太久沒動，排程會被自動停用。</b>
                GitHub 的規則是 60 天沒有新的 commit 就停掉排程（會寄信通知你）。放著長期跑的東西，要記得這件事。
              </li>
              <li>
                <b className="text-ink">重複推播。</b>
                如果同一則新聞被抓到兩次，同仁就會收到兩次通知。要嘛記錄「已經推過哪些」，要嘛接受偶爾重複 ——
                這就是名詞小教室裡「冪等」在講的事。
              </li>
            </ul>
          </div>

          <button type="button" className="btn btn-primary" onClick={onNext}>
            下一步：真的把它接起來 →
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- 步驟 4：真的做一次 ---------- */
function RealStep({ onFinish }) {
  const [checked, setChecked] = useState([false, false, false, false]);
  const [passed, setPassed] = useState(false);
  const allChecked = checked.every(Boolean);

  const STEPS = [
    {
      t: "去 Google AI Studio 申請一把免費的 Gemini API 金鑰",
      d: "申請完先不要貼進任何檔案 —— 下一步才是它該待的地方。",
      href: "https://aistudio.google.com/apikey",
    },
    {
      t: "在 Discord 建立一個 Webhook 網址",
      d: "頻道設定 → 整合 → 建立 Webhook，複製網址。跟第 7 關做的是同一件事。",
    },
    {
      t: "把兩個金鑰放進 repo 的 Actions secrets",
      d: "Settings → Secrets and variables → Actions → New repository secret，開兩個：GEMINI_API_KEY 和 DISCORD_WEBHOOK。存進去之後連你自己都看不到內容，只能覆蓋。",
    },
    {
      t: "把下面兩個檔案放進 repo，然後手動按一次跑跑看",
      d: "workflow 裡有 workflow_dispatch，所以你可以到 Actions 分頁按「Run workflow」立刻試，不用等到中午。",
    },
  ];

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 4 / 4 · 真的做一次</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">把這條線接起來 🔧</h2>

      <div
        className="callout"
        style={{
          borderLeftColor: "var(--danger)",
          background: "color-mix(in srgb, var(--danger) 8%, var(--surface))",
        }}
      >
        <b className="text-ink">先回到第 3 關那條規則：金鑰不能進 repo。</b>
        Gemini 金鑰和 Discord webhook 網址都等同鑰匙 —— 寫進程式碼再推上去，
        就算後來刪掉，git 的版本紀錄裡還在。它們要放的地方是
        <b className="text-ink">Actions secrets</b>，workflow 再從那裡帶進來。
      </div>

      <ul className="list-none p-0 m-0 grid gap-2.5">
        {STEPS.map((it, i) => (
          <li
            key={i}
            className={`flex gap-3 items-start py-3.5 px-4 border-2 rounded-[14px] transition-all ${checked[i] ? "border-mint bg-successSoft" : "border-line bg-surface"}`}
          >
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={(e) => setChecked((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
              className="mt-0.5 shrink-0 cursor-pointer"
              style={{ accentColor: "var(--mint)", width: 22, height: 22 }}
            />
            <div className="flex-1">
              <div className="font-bold">
                {it.href ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer" className="text-accentText">
                    {it.t} ↗
                  </a>
                ) : (
                  it.t
                )}
              </div>
              <div className="text-[13.5px] text-muted mt-0.5">{it.d}</div>
            </div>
          </li>
        ))}
      </ul>

      <div>
        <div className="text-[13px] font-bold mb-1.5">
          <code className="font-mono text-xs">.github/workflows/news-digest.yml</code>
        </div>
        <pre className="font-mono text-[12px] bg-surface2 border border-line rounded-[10px] p-3.5 overflow-x-auto whitespace-pre m-0">
          {WORKFLOW_YML}
        </pre>
      </div>

      <div>
        <div className="text-[13px] font-bold mb-1.5">
          <code className="font-mono text-xs">scripts/news-digest.mjs</code>
        </div>
        <pre className="font-mono text-[12px] bg-surface2 border border-line rounded-[10px] p-3.5 overflow-x-auto whitespace-pre m-0">
          {SCRIPT_JS}
        </pre>
      </div>

      <div className="callout callout-info">
        <b className="text-ink">動手前先做一件事：</b>把 RSS 那個網址貼進瀏覽器打開看一眼。
        上面的程式碼用的是 RSS 2.0 的通用欄位（title / link / pubDate），但每個機關的 feed 實際長相不一定一樣 ——
        <b className="text-ink">先看回傳什麼、再寫程式</b>，這是第 6 關就教過的順序。
      </div>

      <p className="text-xs text-muted m-0">
        ⚠️ 免費額度會變動：Gemini 免費方案是按「每分鐘／每天幾次請求」算的，一天跑一次、一次十來則綽綽有餘，
        但真的要用之前去官方頁面確認一次當下的數字。
      </p>

      {allChecked && (
        <div
          className="callout animate-pop"
          style={{
            borderLeftColor: "var(--mint)",
            background: "color-mix(in srgb, var(--mint) 12%, var(--surface))",
          }}
        >
          <b className="text-ink">接起來之後，你就有一件「每天自己會發生」的事了。</b>
          這也是整門課的終點：你不是學會了十四種工具，而是學會了
          <b className="text-ink">把它們接起來，並且知道每一段該停下來檢查什麼</b>。
        </div>
      )}

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.newsPipeline} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>
        完成這一關 🎉
      </button>
    </div>
  );
}
