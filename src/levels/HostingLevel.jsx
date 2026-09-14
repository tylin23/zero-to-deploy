import { useState } from "react";
import Level, { Eyebrow } from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

/* 排在界線之後是刻意的：這一關會講「不用後端也能收表單」，
   聽起來很誘人，但資料存在境外平台 —— 正好拿剛學完的界線來判斷。

   ⚠️ 免費額度是各平台當下的公告值，會變。上課前建議對照官網再確認一次。 */
const HOSTS = [
  {
    id: "ghp",
    emoji: "📄",
    name: "GitHub Pages",
    vendor: "GitHub",
    build: "不會（要自己寫 Actions）",
    free: "公開 repo 免費",
    form: "不行",
    when: "純 HTML／CSS／JS 的單頁，你已經做過了",
  },
  {
    id: "netlify",
    emoji: "🟩",
    name: "Netlify",
    vendor: "Netlify",
    build: "會，自動",
    free: "每月 100 GB 流量、300 分鐘建置",
    form: "可以（Netlify Forms）",
    when: "要收表單、或想要 PR 預覽網址",
  },
  {
    id: "cfp",
    emoji: "🟧",
    name: "Cloudflare Pages",
    vendor: "Cloudflare",
    build: "會，自動",
    free: "流量不計量、每月 500 次建置",
    form: "要自己寫 Functions",
    when: "流量可能比較大、或想要最大方的免費額度",
  },
];

const COLS = [
  ["build", "會幫你 build 嗎"],
  ["free", "免費額度"],
  ["form", "能收表單嗎"],
  ["when", "什麼時候選它"],
];

/* 表單能不能用 —— 直接把剛學完的界線拿來套 */
const FORM_CASES = [
  {
    id: "poll",
    text: "科內同仁投票決定尾牙餐廳，只收「選哪一家」，不收姓名。",
    answer: "ok",
    why: "沒有個資、內容也不機敏，用平台內建的表單最快。這種就是它最適合的場合。",
  },
  {
    id: "signup",
    text: "市民活動報名，要收姓名、電話、身分證末四碼。",
    answer: "no",
    why: "有個資。表單資料會存在平台（境外）的伺服器上 —— 這條線在「這個我可以自己做嗎？」那一關已經畫得很清楚了。要收市民個資，走機關既有的、經過核可的管道，或先問資訊單位。",
  },
  {
    id: "feedback",
    text: "課後匿名回饋，只有「滿意度」和「建議」兩欄，明確告知不要填個人資訊。",
    answer: "ask",
    why: "看起來沒有個資，但「建議」是自由填寫 —— 市民或同仁很可能自己把姓名、電話、案號寫進去，你擋不住。這種就屬於「先問資訊單位」的灰色地帶，至少要想好收到個資時怎麼處理。",
  },
];

const FV = {
  ok: { label: "✅ 可以用", color: "var(--diy-green-text)", soft: "var(--success-soft)" },
  ask: {
    label: "⚠️ 先問資訊單位",
    color: "var(--diy-yellow-text)",
    soft: "color-mix(in srgb, var(--sun) 16%, var(--surface))",
  },
  no: { label: "⛔ 不該這樣做", color: "var(--diy-red-text)", soft: "var(--danger-soft)" },
};

const STEPS_REAL = [
  {
    t: "用 GitHub 帳號登入 Netlify 或 Cloudflare Pages",
    d: "兩家都可以直接用 GitHub 帳號登入，不用另外註冊。",
    href: "https://www.netlify.com/",
  },
  {
    t: "選「從 Git 匯入」，挑你在 GitHub Pages 那一關開的那個 repo",
    d: "就是放電子名片的那一個。不用改任何檔案。",
  },
  {
    t: "建置設定留空白，直接按 Deploy",
    d: "那個 repo 只有一個 index.html，沒有東西要 build，所以設定全部留預設就好。",
  },
  {
    t: "等 30 秒左右，拿到第二個網址",
    d: "長得像 https://xxxx.netlify.app 或 https://xxxx.pages.dev —— 跟你的 github.io 網址內容一模一樣。",
  },
];

export default function HostingLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.hosting}
      done={{ ...DONE.hosting }}
      steps={[
        ({ next }) => <WhyStep onNext={next} />,
        ({ next }) => <CompareStep onNext={next} />,
        ({ finish }) => <RealStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：手動上傳 vs 自動建置 ---------- */
function WhyStep({ onNext }) {
  const [auto, setAuto] = useState(false);

  const flow = auto
    ? ["改檔案", "git push", "平台自動抓", "自動 build", "自動上線"]
    : ["改檔案", "手動上傳", "Commit", "上線"];

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 1 / 3 · 這是什麼</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">同一類，但它會幫你做更多事 🚀</h2>

      <div className="callout callout-info">
        Netlify 和 Cloudflare Pages 跟你做過的 GitHub Pages
        <b className="text-ink">是同一類</b>：把靜態檔案放上去，給你一個網址。 差別在
        <b className="text-ink">中間那段誰做</b>。
      </div>

      <div className="border-2 border-line rounded-[18px] bg-surface2 p-4 space-y-3">
        <label className="flex items-center gap-2.5 text-sm font-bold cursor-pointer">
          <input
            type="checkbox"
            checked={auto}
            onChange={(e) => setAuto(e.target.checked)}
            style={{ width: 20, height: 20, accentColor: "var(--mint)" }}
          />
          改用 Netlify / Cloudflare Pages
        </label>

        <div className="flex items-center gap-1.5 flex-wrap" data-flow>
          {flow.map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-muted" aria-hidden="true">
                  →
                </span>
              )}
              <span
                className="text-[13px] font-bold px-2.5 py-1.5 rounded-lg border-2"
                style={{
                  borderColor: auto && i >= 2 ? "var(--mint)" : "var(--border)",
                  background:
                    auto && i >= 2 ? "color-mix(in srgb, var(--mint) 14%, var(--surface))" : "var(--surface)",
                  color: "var(--ink)",
                }}
              >
                {s}
              </span>
            </span>
          ))}
        </div>

        <p className="text-sm text-muted m-0">
          {auto ? (
            <>
              綠色那三格是<b className="text-ink">平台自己做的</b>
              ：它盯著你的 repo，只要有新的 commit 就自動抓下來、建置、上線。你從頭到尾只做了「改檔案」和「存檔」。
            </>
          ) : (
            <>這是你在 GitHub Pages 那一關做的：每改一次，就要自己再上傳一次。</>
          )}
        </p>
      </div>

      <div className="callout">
        <b className="text-ink">「build（建置）」又是什麼？</b>
        <div className="mt-1.5">
          如果你的網頁只有一個 <code className="font-mono text-xs">index.html</code>
          ，那不用 build，直接放就能看。但如果是 AI
          幫你用比較新的寫法（React、Vue…）做的，那些原始檔<b className="text-ink">瀏覽器看不懂</b>
          ，要先「翻譯」成純 HTML／CSS／JS —— 這道手續就叫 build。
        </div>
        <div className="mt-1.5">
          GitHub Pages <b className="text-ink">不會</b>幫你 build（要自己寫設定檔）；Netlify 和 Cloudflare
          Pages <b className="text-ink">會自動判斷並幫你做</b>。
          <b className="text-ink">
            　你現在看的這個教學網站，就是這樣 build 出來的 —— 原始碼在 GitHub 上，但你打開的是 build 完的成品。
          </b>
        </div>
      </div>

      <button type="button" className="btn btn-primary" disabled={!auto} onClick={onNext}>
        {auto ? "下一步：三家比一比 →" : "先把上面的勾勾打開看看差別"}
      </button>
    </div>
  );
}

/* ---------- 步驟 2：三家比一比 ---------- */
function CompareStep({ onNext }) {
  const [seen, setSeen] = useState(() => new Set());
  const [open, setOpen] = useState(null);
  const all = seen.size === HOSTS.length;

  const pick = (id) => {
    setOpen((c) => (c === id ? null : id));
    setSeen((s) => new Set(s).add(id));
  };

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 2 / 3 · 怎麼選</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">三家比一比 🔍</h2>
      <p className="text-muted text-sm">三張都點開看看 —— 重點不是記住規格，是知道「什麼情況該選誰」。</p>

      <div className="grid gap-2.5">
        {HOSTS.map((h) => {
          const isOpen = open === h.id;
          return (
            <div
              key={h.id}
              data-host={h.id}
              className="border-2 rounded-[16px] bg-surface overflow-hidden transition-colors"
              style={{ borderColor: isOpen ? "var(--accent)" : "var(--border)" }}
            >
              <button
                type="button"
                onClick={() => pick(h.id)}
                className="w-full text-left p-3.5 flex items-center gap-3"
                aria-expanded={isOpen}
              >
                <span className="text-2xl leading-none">{h.emoji}</span>
                <div className="flex-1">
                  <div className="font-extrabold text-ink">{h.name}</div>
                  <div className="text-xs text-muted">{h.vendor}</div>
                </div>
                {seen.has(h.id) && !isOpen && <span className="text-success font-extrabold">✓</span>}
                <span className="text-muted text-lg">{isOpen ? "▴" : "▾"}</span>
              </button>
              {isOpen && (
                <div className="px-3.5 pb-3.5 pt-3 border-t-2 border-line grid gap-2">
                  {COLS.map(([k, label]) => (
                    <div key={k} className="flex gap-2.5 items-baseline flex-wrap text-sm">
                      <span className="text-xs font-extrabold text-muted w-[86px] shrink-0">{label}</span>
                      <span className="text-ink flex-1">{h[k]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {all && (
        <div
          className="callout"
          style={{
            borderLeftColor: "var(--mint)",
            background: "color-mix(in srgb, var(--mint) 12%, var(--surface))",
          }}
        >
          <b className="text-ink">三家的共同點比差別更重要：</b>
          檔案都放在<b className="text-ink">你自己的 GitHub repo</b> 裡。所以換平台的成本很低 ——
          同一個 repo 可以同時接兩家，拿到兩個網址。
          <b className="text-ink">被綁住的不是你的檔案，只是那個網址。</b>
        </div>
      )}

      <p className="text-xs text-muted m-0">
        ⚠️ 免費額度是各平台當下的公告值，會變動。真的要用之前，去官網再確認一次。
      </p>

      <button type="button" className="btn btn-primary" disabled={!all} onClick={onNext}>
        {all ? "下一步：真的接一次 →" : `三張都點開看看（${seen.size} / 3）`}
      </button>
    </div>
  );
}

/* ---------- 步驟 3：真的接一次 + 表單的界線 ---------- */
function RealStep({ onFinish }) {
  const [checked, setChecked] = useState(() => STEPS_REAL.map(() => false));
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState(null);
  const [passed, setPassed] = useState(false);
  const allChecked = checked.every(Boolean);

  const validate = () => {
    const val = url.trim();
    const ok = /^https:\/\/[a-z0-9][a-z0-9-]*\.(netlify\.app|pages\.dev)(\/\S*)?$/i.test(val);
    if (ok) setMsg({ ok: true, text: "網址格式正確 —— 同一份檔案，你現在有兩個網址了 🎉" });
    else if (!val) setMsg({ ok: false, text: "先把你的新網址貼上來吧。" });
    else setMsg({ ok: false, text: "格式不太對喔～應該長得像 https://xxxx.netlify.app 或 https://xxxx.pages.dev" });
  };

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 3 / 3 · 真的動手</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">把同一個 repo 再接上一家 🔗</h2>
      <div className="callout">
        不用重做任何東西 —— 就用你在 <b className="text-ink">GitHub Pages 那一關</b>
        開的那個 repo（放電子名片的那個）。接上去之後，同一份檔案會有第二個網址。
      </div>

      <ul className="list-none p-0 m-0 grid gap-2.5">
        {STEPS_REAL.map((it, i) => (
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

      {allChecked && (
        <div>
          <h3 className="text-ink font-bold">貼上你的新網址</h3>
          <div className="flex gap-2.5 flex-wrap mt-2">
            <input
              className="gh-input flex-1 min-w-[200px]"
              type="url"
              placeholder="https://xxxx.netlify.app"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") validate();
              }}
            />
            <button type="button" className="btn btn-accent" onClick={validate}>
              驗證 ✅
            </button>
          </div>
          {msg && (
            <div className={`mt-2.5 text-sm font-bold ${msg.ok ? "text-success" : "text-danger"}`}>
              {msg.text}
            </div>
          )}
          <p className="text-muted text-sm mt-2.5">（還沒真的做完也沒關係，下面的測驗答對就能過關。）</p>
        </div>
      )}

      <FormsHowTo />

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.hosting} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>
        完成這一關 🎉
      </button>
    </div>
  );
}

/* 表單。這是這一關最誘人、也最需要界線判斷的功能，所以獨立一塊。 */
function FormsHowTo() {
  const [picked, setPicked] = useState({});
  const answered = Object.keys(picked).length;

  return (
    <details
      className="rounded-[14px] border-2 overflow-hidden"
      style={{
        borderColor: "color-mix(in srgb, var(--sun) 55%, var(--border))",
        background: "color-mix(in srgb, var(--sun) 10%, var(--surface))",
      }}
    >
      <summary className="cursor-pointer select-none list-none px-4 py-3 font-extrabold text-ink flex items-center gap-2 flex-wrap">
        <span className="text-lg" aria-hidden="true">
          📮
        </span>
        <span>不用後端也能收表單？（可以，但先等一下）</span>
        <span className="ml-auto text-muted text-xs font-normal hidden sm:inline">點此展開／收合</span>
      </summary>

      <div className="px-4 pb-4 space-y-3.5">
        <p className="text-sm text-ink mt-0 mb-0">
          前面一直說「靜態網站不能收資料，要收就得有後端」。Netlify 給了一個例外：在
          <code className="font-mono text-xs bg-surface2 px-1.5 py-0.5 rounded border border-line mx-1">
            &lt;form&gt;
          </code>
          上加一個標記，送出的內容就會被平台收走，你在後台看得到、也能設定寄 email 通知 ——
          <b className="text-ink">你一行後端程式都沒寫</b>。
        </p>
        <pre className="font-mono text-[12.5px] bg-surface2 border border-line rounded-[10px] p-3 overflow-x-auto whitespace-pre m-0">
          {'<form name="vote" netlify>\n  <input name="choice">\n  <button>送出</button>\n</form>'}
        </pre>

        <div
          className="callout m-0"
          style={{
            borderLeftColor: "var(--danger)",
            background: "color-mix(in srgb, var(--danger) 8%, var(--surface))",
          }}
        >
          <b className="text-ink">但「能收」不等於「該收」。</b>
          送出的資料會存在<b className="text-ink">平台（境外）的伺服器</b>上 ——
          這正是你上一關剛畫過的那條線。
        </div>

        <div className="text-sm font-extrabold text-muted">🧪 練習：這三種表單，能不能用？</div>

        <div className="grid gap-2.5">
          {FORM_CASES.map((c) => {
            const my = picked[c.id];
            const right = my === c.answer;
            return (
              <div key={c.id} data-form={c.id} className="border-2 border-line rounded-[14px] bg-surface p-3.5">
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

        {answered === FORM_CASES.length && (
          <p className="text-sm text-muted m-0">
            記住第三題那個型態：<b className="text-ink">自由填寫的欄位，你擋不住別人填個資進去</b>
            。設計表單時少開一個自由欄位，之後就少一個麻煩。
          </p>
        )}
      </div>
    </details>
  );
}
