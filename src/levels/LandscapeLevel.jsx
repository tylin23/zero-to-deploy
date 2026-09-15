import { useState } from "react";
import Level, { Eyebrow } from "../components/Level.jsx";
import BrandLogo from "../components/BrandLogo.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES, mapOrder } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

/* AI 服務內建的「做完就給你網址」功能。
   這三家的功能名稱與細節變動很快，教學時請以各平台當下的說明為準。 */
const AI_TOOLS = [
  {
    id: "claude",
    brand: "anthropic",
    name: "Claude Artifacts",
    vendor: "Anthropic",
    what: "在對話旁邊直接生出一個可以點、可以互動的網頁。",
    where: ["左側選單", "Artifacts"],
    shotAlt: "Claude 左側選單，「Artifacts」那一項",
    share:
      "按「發布」就拿到一個公開網址，對方沒有 Claude 帳號也打得開。每按一次發布就是一個新版本，可以選要給人看哪一版。",
    watch:
      "發布後預設是「拿到連結的人都能開」。它不會被放進任何公開目錄讓人瀏覽，但只要連結被轉傳一次就收不回來。團隊／企業方案可以改成只給組織內部、而且要登入才看得到 —— 權限是可以設的，分享前先看一眼。",
  },
  {
    id: "gemini",
    brand: "gemini",
    name: "Gemini Canvas",
    vendor: "Google",
    what: "在 Gemini 的 Canvas 面板裡寫文件或做小網頁，右邊即時預覽改的結果。",
    where: ["輸入框左邊的 ＋", "Canvas"],
    shotAlt: "Gemini 輸入框的加號選單，Canvas 那一項被反白",
    share: "面板右上「Share & export」→ 複製 g.co/gemini/share/… 連結，貼到哪裡都能開。",
    watch:
      "分享出去的是公開連結，拿到的人不只看得到畫面 —— 互動型的小工具，對方連裡面的資料都可能動得到。要給誰看，自己先想清楚。",
  },
  {
    id: "chatgpt",
    brand: "openai",
    name: "ChatGPT Sites",
    vendor: "OpenAI",
    what: "直接請 ChatGPT 幫你做一個網站或小工具，做完可以預覽、發布、分享。",
    where: ["左側選單", "網站（Sites）"],
    shotAlt: "ChatGPT／Codex 左側選單，「網站」那一項",
    share: "發布後拿到網址；也可以設成私人、只分享給指定的人，並支援接上自己的網域。",
    watch:
      "2026 年 7 月才推出、目前仍是公開測試，而且要 Plus／Pro 或工作區方案才有，免費帳號用不到；各地區開放的時間也不一樣（台灣已經可以用，但一開始有些地區是不能發布的）。這提醒了一件事：能不能用、用多久、怎麼收費，是平台說了算，不是你說了算 —— 三家都一樣。",
  },
];

/* 三件事：任何一種「上線」都在做這三件事，差別只在誰幫你做。 */
const THREE = [
  ["📁", "把檔案放在別的地方", "不是只存在你的電腦裡"],
  ["🔌", "那台機器一直開著", "別人半夜點也打得開"],
  ["🔗", "給你一個網址", "把網址給誰，誰就能看"],
];

const CASES = [
  {
    id: "meeting",
    text: "下週科內會議，你把自己整理的一份統計做成一頁互動圖表，開會時投影，順便把連結貼在會議通知裡給科內 8 位同仁看。",
    answer: "ok",
    why: "對象明確、時效很短、內容是可以公開的統計。這種「一次性、給少數人看」的東西，用 AI 工具的分享連結最快 —— 不必為它開一個 repo，也不必麻煩資訊單位。",
  },
  {
    id: "official",
    text: "局處官網要放一個「常見問答查詢」頁給市民長期使用，網址還要寫進新聞稿。",
    answer: "no",
    why: "這是對市民的正式服務。網址要自己控制得住、內容要長期存在，不能哪天平台改版或收掉就消失。而且對外正式服務本來就該走機關的流程 ——「這個我可以自己做嗎？」那一關會專門練這個判斷。",
  },
  {
    id: "prototype",
    text: "你有個點子，想先做出雛形看看畫面長什麼樣、值不值得投入，再決定要不要正式開發。",
    answer: "ok",
    why: "原型（prototype）正是 AI 工具最強的地方：五分鐘看到一個能點的成品，比寫十頁企劃書更容易讓長官和同仁理解你在講什麼。做出來覺得可行，再考慮用後面幾關的方式好好做一次。",
  },
  {
    id: "pii",
    text: "想做一個線上表單，收市民的姓名和電話來報名活動。",
    answer: "no",
    why: "這題的關鍵不是平台快不快，是「個資」。真實的市民個資不能往外部平台丟 —— 不管那個平台多好用。這種需求要先問資訊單位，用機關既有的、經過核可的管道。",
  },
];

const VERDICT = {
  ok: { label: "✅ 分享連結就夠用", color: "var(--diy-green-text)", soft: "var(--success-soft)" },
  no: {
    label: "⚠️ 不夠，要更正式的做法",
    color: "var(--diy-yellow-text)",
    soft: "color-mix(in srgb, var(--sun) 16%, var(--surface))",
  },
};

/* 全景：依「要自己顧多少」由少到多排，所以順序和地圖不完全一樣。
   care 1~5 = 幾乎不用顧 → 全部你顧。levelId 對應到地圖上的關卡。 */
const LANDSCAPE = [
  {
    key: "ai",
    emoji: "🤖",
    name: "AI 工具的分享連結",
    sub: "Claude Artifacts · Gemini Canvas · ChatGPT Sites",
    care: 1,
    one: "平台全包：你只要用講的，它做好、順便給你網址。最快，但東西放在平台手上，想換地方、想綁自己的網址就難了。",
  },
  {
    key: "github-pages",
    care: 2,
    one: "檔案是你自己的，放在 GitHub 上，免費而且幾乎不用顧。適合「可以公開」的靜態頁面。",
  },
  {
    key: "hosting",
    care: 2,
    one: "跟 GitHub Pages 同一類，但它盯著你的 repo：有新版就自動建置、自動上線，也能綁自己的網域。",
  },
  {
    key: "api",
    care: 2,
    one: "一樣是靜態網頁，只是資料改成每次打開才去跟別人要。開放資料看板都是這樣做的。",
  },
  {
    key: "gas",
    care: 3,
    one: "讓 Google 幫你跑一小段程式：定時，或有人填了表單，就自動做事、自動通知承辦人。",
  },
  {
    key: "huggingface",
    care: 3,
    one: "平台幫你把 AI 模型跑起來，給你一個可以互動的網址。是境外平台，資料一定要先去識別化。",
  },
  {
    key: "firebase",
    care: 3,
    one: "不用自己寫後端就有資料庫和登入。代價是「誰能讀、誰能寫」變成一份你要自己設對的安全規則。",
  },
  {
    key: "flask",
    care: 4,
    one: "換你自己寫後端：你已經會的 Python，掛在一個網址後面給別人用。自由度最高，但機器、安全、更新也一起變成你的事。",
  },
  {
    key: "docker",
    care: 4,
    one: "把程式和它需要的整套環境一起打包，交給誰、搬到哪台機器，跑出來都一樣。",
  },
  {
    key: "exe-queue",
    care: 4,
    one: "不上網的那一種：包成一個檔案發給特定同仁，雙擊就能跑。代價是更新要自己想辦法，還會被防毒盯上。",
  },
  {
    key: "selfhost",
    care: 5,
    one: "機器是機關的，什麼都你決定 —— 也什麼都你負責：更新、修補、監控、出事要有人接。",
  },
];

const levelOf = (id) => {
  const i = mapOrder.findIndex((l) => l.id === id);
  return i < 0 ? null : { no: i + 1, ...mapOrder[i] };
};

export default function LandscapeLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.landscape}
      done={{ ...DONE.landscape }}
      steps={[
        ({ next }) => <ToolsStep onNext={next} />,
        ({ next }) => <EnoughStep onNext={next} />,
        ({ finish }) => <MapStep onFinish={finish} navigate={ctx.navigate} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：你可能已經部署過了 ---------- */
function ToolsStep({ onNext }) {
  const [open, setOpen] = useState(null);
  const [seen, setSeen] = useState(() => new Set());

  const pick = (id) => {
    setOpen((cur) => (cur === id ? null : id));
    setSeen((s) => new Set(s).add(id));
  };
  const all = seen.size === AI_TOOLS.length;

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 1 / 3 · 你可能已經部署過了</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">在 AI 工具裡按下「分享」，其實就是一次部署 🤖</h2>
      <div className="callout callout-info">
        很多同仁的第一次「上線」，其實發生在 AI 對話框裡：你說一句「幫我做一頁報名統計」，右邊就出現一個能點的頁面，再按一下分享，同事就打得開了。
        <b className="text-ink">這中間到底發生了什麼事？</b>三張卡片都點開看看。
      </div>

      <div className="grid gap-3">
        {AI_TOOLS.map((t) => {
          const isOpen = open === t.id;
          return (
            <div
              key={t.id}
              data-tool={t.id}
              className="border-2 rounded-[18px] bg-surface overflow-hidden transition-colors"
              style={{ borderColor: isOpen ? "var(--accent)" : "var(--border)" }}
            >
              <button
                type="button"
                onClick={() => pick(t.id)}
                className="w-full text-left p-4 flex items-center gap-3"
                aria-expanded={isOpen}
              >
                <BrandLogo brand={t.brand} size={32} />
                <div className="flex-1">
                  <div className="font-extrabold text-ink">{t.name}</div>
                  <div className="text-xs text-muted font-bold">{t.vendor}</div>
                </div>
                {seen.has(t.id) && !isOpen && <span className="text-success font-extrabold">✓</span>}
                <span className="text-muted text-lg">{isOpen ? "▴" : "▾"}</span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-2.5 border-t-2 border-line pt-3">
                  <p className="text-sm text-ink m-0">{t.what}</p>
                  <div>
                    <div className="text-xs font-extrabold text-muted mb-1">📍 入口在哪</div>
                    <WherePath steps={t.where} />
                    <ToolShot id={t.id} alt={t.shotAlt} />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-muted mb-1">🔗 分享出去長這樣</div>
                    <p className="text-sm text-ink m-0">{t.share}</p>
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-muted mb-1">👀 要注意的地方</div>
                    <p className="text-sm text-ink m-0">{t.watch}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {all && (
        <>
          <div
            className="callout"
            style={{
              borderLeftColor: "var(--mint)",
              background: "color-mix(in srgb, var(--mint) 12%, var(--surface))",
            }}
          >
            <b className="text-ink">看出共同點了嗎？</b>
            三家做的其實是同樣三件事 —— 這三件事合起來就叫「部署」：
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THREE.map(([i, t, d]) => (
              <div key={t} className="card card-sm text-center">
                <div className="text-3xl">{i}</div>
                <b className="text-ink text-sm">{t}</b>
                <p className="text-muted text-xs m-0">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted m-0">
            這門課剩下的每一關，做的都是同樣這三件事。
            <b className="text-ink">差別只在：誰幫你做、以及你能控制多少。</b>
          </p>
        </>
      )}

      <button type="button" className="btn btn-primary" disabled={!all} onClick={onNext}>
        {all ? "下一步：那為什麼還要學別的？ →" : `先把三張卡都點開看看（${seen.size} / 3）`}
      </button>
    </div>
  );
}

/* 入口路徑：一排麵包屑，例如「左側選單 › Artifacts」。
   沒有截圖也看得懂要點哪裡，所以這是主要資訊、圖只是輔助。 */
function WherePath({ steps }) {
  if (!steps || !steps.length) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {steps.map((sp, i) => (
        <span key={sp} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="text-muted text-sm" aria-hidden="true">
              ›
            </span>
          )}
          <span
            className="text-[13px] font-bold px-2.5 py-1 rounded-lg border-2"
            style={{
              borderColor: i === steps.length - 1 ? "var(--accent)" : "var(--border)",
              background: i === steps.length - 1 ? "var(--accent-soft)" : "var(--surface-2)",
              color: "var(--ink)",
            }}
          >
            {sp}
          </span>
        </span>
      ))}
    </div>
  );
}

/* 介面截圖（老師自己放進 public/images/）。
   沒放就整塊不顯示 —— 上面的路徑麵包屑本來就講得完整，不會開天窗也不會破圖。 */
function ToolShot({ id, alt }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <figure className="m-0 mt-2">
      {/* 固定高度（不是上限）：三張截圖的原始尺寸差很多（Claude 只有 239×161，
          Gemini/ChatGPT 是它的 2~3 倍），用 max-h 的話小圖就撐不大。
          改成固定 height，三張圖統一撐到同樣高，寬度依各自比例自動算 ——
          外層用 overflow-x-auto 而不是 max-w-full，避免手機上寬度不夠時
          瀏覽器把圖「壓扁」（max-width 會強制縮寬但不會跟著縮高，圖就變形了）。
          外層寬度用 w-fit：框線和底色要貼著圖片邊緣，不是撐滿整張卡片
          （之前是 block，寬圖窄圖都占滿卡片寬，窄的那張右邊就多一大塊空白背景）。 */}
      <div className="w-fit max-w-full overflow-x-auto rounded-[12px] border-2 border-line bg-surface2">
        <img
          src={import.meta.env.BASE_URL + "images/ai-" + id + ".png"}
          alt={alt}
          loading="lazy"
          onError={() => setBroken(true)}
          /* max-w-none 是必要的：Tailwind 的 preflight 幫所有 <img> 預設加了
             max-width:100%，不特別取消掉的話，圖還是會被壓回容器寬度、
             變成寬高比走樣（外層 overflow-x-auto 才是負責「太寬就捲動」的那層）。 */
          className="block h-[220px] sm:h-[400px] w-auto max-w-none"
        />
      </div>
      <figcaption className="text-xs text-muted mt-1">▲ {alt}</figcaption>
    </figure>
  );
}

/* ---------- 步驟 2：分享連結什麼時候夠、什麼時候不夠 ---------- */
function EnoughStep({ onNext }) {
  const [picked, setPicked] = useState({});
  const answered = Object.keys(picked).length;
  const all = answered === CASES.length;

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 2 / 3 · 那為什麼還要學別的？</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">分享連結什麼時候夠用，什麼時候不夠？</h2>
      <div className="callout callout-info">
        AI 工具的分享連結不是「偷懶的做法」—— 很多時候它就是最對的選擇。重點是分得出
        <b className="text-ink">哪些場合它剛好夠用、哪些場合會出事</b>。四個情境，各選一個看看。
      </div>

      <div className="grid gap-3">
        {CASES.map((c, i) => {
          const my = picked[c.id];
          const right = my === c.answer;
          return (
            <div key={c.id} data-case={c.id} className="border-2 border-line rounded-[18px] bg-surface p-4">
              <div className="text-xs font-extrabold text-muted mb-1.5">情境 {i + 1}</div>
              <p className="text-[15px] text-ink m-0 mb-3">{c.text}</p>

              {!my ? (
                <div className="flex flex-wrap gap-2">
                  {["ok", "no"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className="gh-btn"
                      onClick={() => setPicked((s) => ({ ...s, [c.id]: v }))}
                    >
                      {VERDICT[v].label}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-[14px] p-3.5 border-2"
                  style={{ background: VERDICT[c.answer].soft, borderColor: "var(--border)" }}
                >
                  <div className="text-sm font-extrabold mb-1" style={{ color: VERDICT[c.answer].color }}>
                    {right ? "判斷正確 —— " : "正解是 —— "}
                    {VERDICT[c.answer].label}
                  </div>
                  <p className="text-sm text-ink m-0">{c.why}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="btn btn-primary" disabled={!all} onClick={onNext}>
        {all ? "下一步：看看全部的選項 →" : `四個情境都選看看（${answered} / 4）`}
      </button>
    </div>
  );
}

/* ---------- 步驟 3：全景 ---------- */
function MapStep({ onFinish, navigate }) {
  const [open, setOpen] = useState(null);
  const [passed, setPassed] = useState(false);

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 3 / 3 · 全景</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">上線的方法，從「全包」到「全部自己來」🔭</h2>
      <div className="callout callout-info">
        下面依<b className="text-ink">「要自己顧多少」</b>由少排到多（所以順序和地圖不完全一樣）。
        <b className="text-ink">現在不用看懂</b>—— 這只是一張地圖，讓你知道等一下會走過哪些地方。點開看一句話說明。
      </div>

      <div className="flex items-center gap-2 text-xs font-extrabold text-muted">
        <span>平台幫你顧</span>
        <span className="flex-1 h-[3px] rounded-full" style={{ background: "var(--track)" }} />
        <span>全部自己顧</span>
      </div>

      <div className="grid gap-2.5">
        {LANDSCAPE.map((item) => {
          const lv = item.key === "ai" ? null : levelOf(item.key);
          const emoji = item.emoji || lv?.emoji;
          const name = item.name || lv?.title;
          const isOpen = open === item.key;
          return (
            <div
              key={item.key}
              data-scope={item.key}
              className="border-2 rounded-[16px] bg-surface overflow-hidden transition-colors"
              style={{ borderColor: isOpen ? "var(--accent)" : "var(--border)" }}
            >
              <button
                type="button"
                onClick={() => setOpen((c) => (c === item.key ? null : item.key))}
                className="w-full text-left px-3.5 py-3 flex items-center gap-3"
                aria-expanded={isOpen}
              >
                <span className="text-2xl leading-none shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-ink text-[15px]">{name}</div>
                  <div className="text-xs text-muted truncate">{item.sub || (lv ? `第 ${lv.no} 關` : "")}</div>
                </div>
                <CareMeter n={item.care} />
                <span className="text-muted">{isOpen ? "▴" : "▾"}</span>
              </button>
              {isOpen && (
                <div className="px-3.5 pb-3.5 pt-3 border-t-2 border-line space-y-2.5">
                  <p className="text-sm text-ink m-0">{item.one}</p>
                  {lv && (
                    <button
                      type="button"
                      className="gh-btn gh-btn-sm"
                      onClick={() => navigate("#/level/" + lv.id)}
                    >
                      🎮 第 {lv.no} 關會教這個 →
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.landscape} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>
        完成這一關 🎉
      </button>
    </div>
  );
}

/* 「要自己顧多少」的五格量表。顏色只是輔助，格數本身就看得出來。 */
function CareMeter({ n }) {
  return (
    <span className="flex gap-[3px] shrink-0" aria-label={`要自己顧的程度 ${n} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="w-[7px] h-[16px] rounded-[2px]"
          style={{ background: i <= n ? "var(--accent)" : "var(--track)" }}
        />
      ))}
    </span>
  );
}
