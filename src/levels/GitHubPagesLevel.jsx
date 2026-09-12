import { useState } from "react";
import Level from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import Browser from "../components/Browser.jsx";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

const REPO = "my-first-site";

// 範本：一頁「可公開」的里民活動公告（不含任何個資）
const STARTER_HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>里民活動公告</title>
  <style>
    body { font-family: system-ui, sans-serif; display: grid; place-items: center;
           min-height: 100vh; margin: 0; background: linear-gradient(120deg,#26418f,#3b7dd8); color:#fff; text-align:center; }
    h1 { font-size: 2.4rem; }
    p { font-size: 1.1rem; }
  </style>
</head>
<body>
  <div>
    <h1>📢 里民健康講座</h1>
    <p>時間：6/15（六）上午 9:00</p>
    <p>地點：本里活動中心　自由入座</p>
    <!-- 注意：這頁會完全公開，只放可對外的公告資訊，勿放個資 -->
  </div>
</body>
</html>`;

function downloadStarter() {
  const blob = new Blob([STARTER_HTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "index.html";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function GitHubPagesLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.firstDeploy}
      done={(url) => ({
        ...DONE.githubPages,
        secondary: { label: "打開我的網站 ↗", onClick: () => window.open(url, "_blank", "noopener") },
      })}
      steps={[
        ({ next }) => <ConceptStep onNext={next} />,
        ({ next }) => <SimStep onNext={next} />,
        ({ finish }) => <RealStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：概念 ---------- */
function ConceptStep({ onNext }) {
  const [passed, setPassed] = useState(false);
  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 1 / 3 · 這是什麼
      </span>
      <h2 className="text-2xl font-bold text-ink">GitHub Pages 是什麼？</h2>
      <div className="callout callout-info">
        GitHub Pages 是 GitHub 提供的<b className="text-ink">免費網站託管服務</b>
        。你把網頁檔案（HTML/CSS/JS）放進一個
        repository，打開開關，它就給你一個網址、幫你放上網。全程可以在網站上用滑鼠點完。很適合放
        <b className="text-ink">可公開的公告、活動頁、開放資料儀表板</b>。
      </div>
      <div
        className="callout"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">⚠️ 公務提醒：</b>放上 Pages 的內容會<b className="text-ink">完全公開</b>
        並被搜尋引擎索引。只放可對外公開的資訊，絕不放民眾個資或內部檔案。
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ["💸", "免費", "個人專案不用付錢"],
          ["🖱️", "純 GUI", "用網頁點一點就好"],
          ["🔗", "有網址", "username.github.io"],
        ].map(([i, t, d]) => (
          <div key={t} className="card">
            <div className="text-3xl">{i}</div>
            <b className="text-ink">{t}</b>
            <p className="text-muted text-sm m-0">{d}</p>
          </div>
        ))}
      </div>
      <Quiz {...QUIZZES.githubPages} onCorrect={() => setPassed(true)} />
      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onNext}>
        下一步：先在模擬介面練一次 →
      </button>
    </div>
  );
}

/* ---------- 步驟 2：站內模擬 GitHub ---------- */
function SimStep({ onNext }) {
  const [sim, setSim] = useState(0);

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 2 / 3 · 先練一次
      </span>
      <h2 className="text-2xl font-bold text-ink">在「模擬的 GitHub」點一遍</h2>
      <p className="text-muted text-sm">
        下面是模仿真的 GitHub 畫面。跟著發亮的按鈕點 —— 等一下去真的網站就會很眼熟。
      </p>

      {sim === 0 && <SimHome onNext={() => setSim(1)} />}
      {sim === 1 && <SimCreate onNext={() => setSim(2)} />}
      {sim === 2 && <SimUpload onNext={() => setSim(3)} />}
      {sim === 3 && <SimPages onNext={() => setSim(4)} />}
      {sim === 4 && <SimLive />}

      <button type="button" className="btn btn-primary" onClick={onNext}>
        我練會了，換我真的做一次 →
      </button>
    </div>
  );
}

const Tip = ({ children }) => (
  <div className="inline-flex items-center gap-1.5 text-[12.5px] font-extrabold text-accentDark bg-accentSoft py-1 px-3 rounded-full mb-2.5">
    {children}
  </div>
);

function SimHome({ onNext }) {
  return (
    <Browser url="github.com">
      <div className="flex items-center gap-2.5 pb-3.5 border-b border-line mb-4">
        <span className="text-[22px]">🐙</span>
        <span className="font-extrabold">GitHub</span>
        <span className="flex-1" />
        <button type="button" className="gh-btn gh-btn-green animate-pulseRing" onClick={onNext}>
          ＋ New
        </button>
      </div>
      <Tip>👉 點右上角綠色的「New」建立一個 repository</Tip>
      <p className="text-muted text-sm">repository（倉庫）就是放你這個專案所有檔案的地方。</p>
    </Browser>
  );
}

function SimCreate({ onNext }) {
  return (
    <Browser url="github.com/new">
      <h3 className="mt-0 text-ink font-bold">Create a new repository</h3>
      <div className="mb-3.5">
        <label className="text-[13px] font-bold block mb-1.5">Repository name</label>
        <input className="gh-input" value={REPO} readOnly />
        <small className="text-muted">取一個名字就好（這裡先幫你填好）</small>
      </div>
      <label className="flex gap-2.5 items-start py-2.5 px-3 border-2 rounded-xl mb-2 border-primary bg-primarySoft">
        <input type="radio" checked readOnly className="mt-1" />
        <div>
          <b>Public</b>
          <small className="block text-muted font-normal">
            公開 —— 這樣別人才連得到你的網站（要用 Pages 通常選這個）
          </small>
        </div>
      </label>
      <Tip>👉 確認選了 Public，然後按綠色「Create repository」</Tip>
      <div>
        <button type="button" className="gh-btn gh-btn-green animate-pulseRing" onClick={onNext}>
          Create repository
        </button>
      </div>
    </Browser>
  );
}

function SimUpload({ onNext }) {
  const [picked, setPicked] = useState(false);
  const [over, setOver] = useState(false);
  const [filled, setFilled] = useState(false);
  const fill = () => setFilled(true);

  return (
    <Browser url={`github.com/你/${REPO}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🐙</span>
        <b>你的帳號 / {REPO}</b>
        <span className="pill bg-surface2 text-muted">Public</span>
      </div>
      <Tip>👉 把 index.html 拖進來（或點一下），再按 Commit</Tip>

      {!filled && (
        <div className="text-center my-1.5">
          <span
            draggable
            onDragStart={(e) => e.dataTransfer.setData("t", "1")}
            onClick={() => setPicked((p) => !p)}
            className={`inline-flex items-center gap-2 py-3 px-[18px] rounded-[14px] bg-surface border-2 font-bold cursor-grab select-none ${picked ? "border-accent animate-pulseRing" : "border-line"}`}
            style={{ boxShadow: "0 5px 0 var(--border)" }}
          >
            📄 index.html
          </span>
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          fill();
        }}
        onClick={() => {
          if (picked) fill();
        }}
        className={`border-[3px] border-dashed rounded-[22px] p-6 text-center font-semibold mt-2.5
          ${
            filled
              ? "border-solid border-mint bg-successSoft text-success font-extrabold"
              : over
                ? "border-primary bg-primarySoft text-primary"
                : picked
                  ? "border-accent bg-surface text-muted animate-pulseRing"
                  : "border-line bg-surface text-muted"
          }`}
      >
        {filled ? "✅ index.html 已加入" : "拖曳檔案到這裡上傳"}
      </div>

      <button
        type="button"
        disabled={!filled}
        onClick={onNext}
        className={`gh-btn gh-btn-green mt-3 ${filled ? "animate-pulseRing" : "opacity-50 cursor-not-allowed"}`}
      >
        Commit changes
      </button>
    </Browser>
  );
}

function SimPages({ onNext }) {
  return (
    <Browser url={`github.com/你/${REPO}/settings/pages`}>
      <div className="flex gap-2 items-center mb-3">
        <span className="font-extrabold">⚙️ Settings</span>
        <span className="text-muted text-sm">› Pages</span>
      </div>
      <p className="text-muted text-sm">這裡是打開網站的開關。選好「哪個分支」當網站來源，按 Save。</p>
      <div className="mb-3.5">
        <label className="text-[13px] font-bold block mb-1.5">Branch</label>
        <select className="gh-input">
          <option>main</option>
          <option>None</option>
        </select>
      </div>
      <Tip>👉 分支選 main，按 Save</Tip>
      <button type="button" className="gh-btn gh-btn-green animate-pulseRing" onClick={onNext}>
        Save
      </button>
    </Browser>
  );
}

function SimLive() {
  return (
    <Browser url={`github.com/你/${REPO}/settings/pages`}>
      <div
        className="callout"
        style={{ borderLeftColor: "#2da44e", background: "var(--success-soft)", color: "var(--success)" }}
      >
        <b>✅ Your site is live! </b>網站已上線：
        <br />
        <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">
          https://你的帳號.github.io/my-first-site/
        </code>
      </div>
      <p className="text-muted text-sm mt-2">（真的操作時，第一次可能要等 1～2 分鐘才會出現。）</p>
    </Browser>
  );
}

/* ---------- 步驟 3：真的做一次 + 驗證 ---------- */
const ITEMS = [
  { t: "登入 / 註冊 GitHub 帳號", d: "還沒有帳號？免費註冊。", href: "https://github.com/signup" },
  {
    t: "建立一個新的 Public repository",
    d: "打開建立頁面，取名字、選 Public、Create。",
    href: "https://github.com/new",
  },
  { t: "上傳 index.html 並 Commit", d: "在 repo 裡：Add file → Upload files → 拖檔案 → Commit changes。" },
  { t: "打開 Pages 開關", d: "Settings → Pages → Branch 選 main → Save。" },
  { t: "等 1～2 分鐘，打開你的網址看看", d: "網址長得像 https://你的帳號.github.io/repo名稱/" },
];

function RealStep({ onFinish }) {
  const [checked, setChecked] = useState(() => ITEMS.map(() => false));
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState(null);
  const allChecked = checked.every(Boolean);

  const validate = () => {
    const val = url.trim();
    const ok = /^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.github\.io(\/\S*)?$/i.test(val);
    if (ok) {
      setMsg({ ok: true, text: "網址格式正確，看起來就是 GitHub Pages！🎉" });
      setTimeout(() => onFinish(val), 700);
    } else if (!val) setMsg({ ok: false, text: "先把你的網址貼上來吧。" });
    else setMsg({ ok: false, text: "格式不太對喔～應該長得像 https://你的帳號.github.io/repo名稱/" });
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 3 / 3 · 真的動手
      </span>
      <h2 className="text-2xl font-bold text-ink">換你在真的 GitHub 上部署 🚀</h2>
      <div className="callout">
        跟著清單一步步做。每做完一項就打勾。需要一個檔案的話，先
        <b className="text-ink">下載我們準備好的 index.html</b> 去上傳就好。
      </div>

      <button type="button" className="btn btn-accent" onClick={downloadStarter}>
        ⬇ 下載範本 index.html
      </button>

      <ul className="list-none p-0 m-0 grid gap-2.5">
        {ITEMS.map((it, i) => (
          <li
            key={i}
            className={`flex gap-3 items-start py-3.5 px-4 border-2 rounded-[14px] transition-all ${checked[i] ? "border-mint bg-successSoft" : "border-line bg-surface"}`}
          >
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={(e) => setChecked((c) => c.map((v, j) => (j === i ? e.target.checked : v)))}
              className="w-5.5 h-5.5 mt-0.5 shrink-0 cursor-pointer"
              style={{ accentColor: "var(--mint)", width: 22, height: 22 }}
            />
            <div className="flex-1">
              <div className="font-bold">
                {it.href ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer" className="text-primary">
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
          <hr className="border-0 border-t border-line my-4" />
          <h3 className="text-ink font-bold">全部打勾了！貼上你的網址驗證過關</h3>
          <div className="flex gap-2.5 flex-wrap mt-2">
            <input
              className="gh-input flex-1 min-w-[200px]"
              type="url"
              placeholder="https://你的帳號.github.io/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") validate();
              }}
            />
            <button type="button" className="btn btn-primary" onClick={validate}>
              驗證我的網站 ✅
            </button>
          </div>
          {msg && (
            <div className={`mt-2.5 text-sm font-bold ${msg.ok ? "text-success" : "text-danger"}`}>
              {msg.text}
            </div>
          )}
          <p className="text-muted text-sm mt-2.5">
            （還沒真的做完也沒關係 —— 之後回來貼上網址就能拿到徽章。）
          </p>
        </div>
      )}
    </div>
  );
}
