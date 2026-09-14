import { useState } from "react";
import Level from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import Browser from "../components/Browser.jsx";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";
import { STARTER_HTML } from "../content/starterCard.js";

const REPO = "my-first-site";

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
        <b className="text-ink">電子名片、可公開的公告、活動頁、開放資料儀表板</b>。
      </div>
      <div
        className="callout"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">⚠️ 公務提醒：</b>放上 Pages 的內容會<b className="text-ink">完全公開</b>
        並被搜尋引擎索引。只放可對外公開的資訊，絕不放市民個資或內部檔案。
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
        <b className="text-ink">下載我們準備好的 index.html</b> 去上傳就好 —— 那是一頁
        <b className="text-ink">電子名片</b>（頭像、聯絡方式、連結按鈕都有，手機也好看）。 做完別把 repo
        刪掉，之後把內容改成你自己或科室的，它就一直是你的名片頁。
      </div>

      <button type="button" className="btn btn-accent" onClick={downloadStarter}>
        ⬇ 下載範本 index.html（電子名片）
      </button>

      <div className="text-[13px] font-extrabold text-muted pt-1">
        ⬇ 下面五段是延伸主題，需要時再展開
      </div>
      <OwnFileChecklist />
      <CdnHowTo />
      <SecretsHowTo />
      <ImageHowTo />
      <ReadmeHowTo />

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

// 要上傳「自己（或 AI 幫你）做的」檔案時，最常踩到的 5 個雷。
// 這些在自己電腦上雙擊都看不出來，一上線才會壞。
const PITFALLS = [
  {
    t: "首頁檔名一定要是 index.html（全部小寫）",
    d: "叫 Index.html、公告.html、首頁.html 都不會被當成首頁，網址打開會是一片空白或檔案清單。",
  },
  {
    t: "大小寫要完全一致",
    d: '你的 Windows 不分大小寫，但伺服器分。程式裡寫 <img src="Photo.jpg"> 而檔案其實叫 photo.jpg，在你電腦上好好的，一上線就破圖。',
  },
  {
    t: "不要留下你電腦裡的絕對路徑",
    d: "AI 有時會寫成 C:\\Users\\你\\Pictures\\logo.png 或 file:///...。那條路徑只有你的電腦有。要改成同資料夾的相對路徑（例如 logo.png），而且圖片要一起上傳。",
  },
  {
    t: "檔名用英文，別用中文和空白",
    d: "中文檔名和空白在網址裡會被轉成一長串亂碼，容易連不到。用英文小寫，空白改成 -。",
  },
  {
    t: "金鑰、密碼、.env 一個都不能傳",
    d: "AI 寫的專案常有一個 .env 檔，裡面是 API 金鑰之類的密碼。傳到 Public repo 等於公開貼出密碼，而且事後刪掉那一行也沒用（git 會留版本紀錄）。下面「🔑 金鑰、.env 與 .gitignore」那一段會講怎麼處理。",
  },
  {
    t: "如果它需要「後端」，這一關放不了",
    d: "程式裡如果出現 python app.py、node server.js、pip install、npm start，或要連資料庫，那就是有後端。GitHub Pages 只會把檔案原封不動送出去、不會幫你跑程式 —— 那種要用後面幾關的方式。",
  },
];

// 想在網頁上放自己的照片／圖片 —— 學生一定會遇到，而且四種寫法只有兩種會活。
// setup 寫「檔案實際在哪」，code 寫「HTML 裡怎麼寫」，兩者要合起來看才知道會不會破圖。
const IMG_CASES = [
  {
    id: "same",
    setup: "avatar.jpg 和 index.html 放在同一層，兩個都上傳了",
    code: '<img src="avatar.jpg" alt="我的大頭照">',
    ok: true,
    why: "最標準的寫法。相對路徑的意思是「從 index.html 出發去找 avatar.jpg」—— 只要兩個檔案一起上傳，別人打開就看得到。",
  },
  {
    id: "abs",
    setup: "圖片還躺在你電腦的「圖片」資料夾裡，沒有上傳",
    code: '<img src="C:\\Users\\你的帳號\\Pictures\\avatar.jpg">',
    ok: false,
    why: "這條路徑只有你的電腦找得到 —— 跟上一關的 file:// 是同一件事。你自己開看得到，別人開就是一個破掉的圖示。圖片一定要先上傳到 repo，再用相對路徑。AI 幫你寫的程式很愛出現這種路徑，要記得改掉。",
  },
  {
    id: "case",
    setup: "上傳的檔案其實叫 avatar.jpg（小寫、副檔名也是小寫）",
    code: '<img src="Avatar.JPG" alt="我的大頭照">',
    ok: false,
    why: "Windows 不分大小寫，伺服器分。在你電腦上測試好好的，一上線就破圖 —— 這是最難自己抓到的雷。檔名怎麼拼，程式裡就要一字不差地怎麼寫。",
  },
  {
    id: "folder",
    setup: "repo 裡開了一個 images 資料夾，圖片放在裡面",
    code: '<img src="images/avatar.jpg" alt="我的大頭照">',
    ok: true,
    why: "圖片多的時候可以開資料夾收好，路徑就寫「資料夾名／檔名」。上傳時把整個資料夾拖進 GitHub，結構會被保留。",
  },
];

/* 金鑰。學生在這一關第一次把東西「公開」出去，是講這件事最好的時機。
   四個檔案的判斷刻意包含「截圖」—— 截圖外洩是最常被忽略的一種。 */
const SECRET_FILES = [
  {
    id: "html",
    name: "index.html",
    note: "你的網頁",
    ok: true,
    why: "這就是要給大家看的東西，當然可以上傳。",
  },
  {
    id: "env",
    name: ".env",
    note: "裡面寫著 API_KEY=sk-a1b2c3...",
    ok: false,
    why: "這是密碼檔。傳上 Public repo 等於把密碼貼在公佈欄 —— 而且網路上有程式專門在掃 GitHub 上的金鑰，幾分鐘內就會被撿走。",
  },
  {
    id: "example",
    name: ".env.example",
    note: "只有 API_KEY= 這個欄位名，沒有值",
    ok: true,
    why: "這是給同事看的「需要填哪些設定」清單，本身沒有秘密。實務上很常見：真的值放 .env（不上傳），欄位名放 .env.example（上傳）。",
  },
  {
    id: "shot",
    name: "screenshot.png",
    note: "操作畫面截圖，網址列剛好照到 Webhook 網址",
    ok: false,
    why: "最容易被忽略的一種。金鑰不是只有寫在程式碼裡才會外洩 —— 截圖、投影片、貼到群組裡問問題，都算。上傳前先把畫面上的網址和權杖塗掉。",
  },
];

const GITIGNORE = `# .gitignore：告訴 git「這些檔案不用管，也不要上傳」
.env
.env.local
node_modules/
*.log`;

function SecretsHowTo() {
  const [picked, setPicked] = useState({});
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(GITIGNORE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 忽略 */
    }
  };

  return (
    <details
      className="rounded-[14px] border-2 overflow-hidden"
      style={{
        borderColor: "color-mix(in srgb, var(--danger) 45%, var(--border))",
        background: "color-mix(in srgb, var(--danger) 7%, var(--surface))",
      }}
    >
      <summary className="cursor-pointer select-none list-none px-4 py-3 font-extrabold text-ink flex items-center gap-2 flex-wrap">
        <span className="text-lg" aria-hidden="true">
          🔑
        </span>
        <span>金鑰、.env 與 .gitignore</span>
        <span className="ml-auto text-muted text-xs font-normal hidden sm:inline">點此展開／收合</span>
      </summary>

      <div className="px-4 pb-4 space-y-3.5">
        <p className="text-sm text-ink mt-0 mb-0">
          <b className="text-ink">API 金鑰、Webhook 網址、存取權杖（token）</b>—— 名字很多，但都是同一件事：
          <b className="text-ink">一串等同帳號密碼的文字</b>
          。誰拿到它，就能用你的身分去做事、花你的額度。它不是設定，是密碼。
        </p>

        <div className="grid gap-2.5">
          {[
            [
              "1",
              "網頁前端藏不住金鑰",
              "你寫在 HTML／JS 裡的東西，會原封不動送到每一位訪客的瀏覽器 —— 按 F12 就看得到，「藏在程式碼深處」完全沒有用。所以需要金鑰的服務，不能從靜態網頁直接呼叫。（這也是為什麼 API 那一關特地挑一份不用金鑰的開放資料。）",
            ],
            [
              "2",
              "傳上去之後，刪掉那一行沒有用",
              "Public repo 是公開的，而且 git 會留下每一次的版本紀錄 —— 你把那行刪掉，舊版本裡還在。正確動作是：立刻回到那個平台把金鑰「撤銷／重新產生」，讓外洩的那一把失效。刪 commit 是其次。",
            ],
            [
              "3",
              "所以金鑰要放在「程式碼以外」的地方",
              "在自己電腦上開發 → 放進 .env 檔，程式從那裡讀；要在平台上跑 → 用平台自己的保險箱：GitHub Actions 的 Secrets、Google Apps Script 的「指令碼屬性」、Hugging Face Spaces 的 Secrets。",
            ],
          ].map(([n, t, d]) => (
            <div key={n} className="flex gap-2.5">
              <span
                className="shrink-0 w-[22px] h-[22px] rounded-full grid place-items-center text-xs font-extrabold mt-0.5"
                style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
              >
                {n}
              </span>
              <div>
                <div className="text-sm font-extrabold text-ink">{t}</div>
                <p className="text-sm text-muted m-0">{d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm font-extrabold text-muted pt-1">
          🧪 練習：這四個檔案，哪些可以傳到 Public repo？
        </div>

        <div className="grid gap-2.5">
          {SECRET_FILES.map((f) => {
            const my = picked[f.id];
            const right = my === (f.ok ? "ok" : "no");
            return (
              <div key={f.id} data-sec={f.id} className="border-2 border-line rounded-[14px] bg-surface p-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <code className="font-mono text-[13px] bg-surface2 px-2 py-0.5 rounded border border-line">
                    {f.name}
                  </code>
                  <span className="text-xs text-muted">{f.note}</span>
                </div>
                {!my ? (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    <button
                      type="button"
                      className="gh-btn gh-btn-sm"
                      onClick={() => setPicked((s2) => ({ ...s2, [f.id]: "ok" }))}
                    >
                      ✅ 可以上傳
                    </button>
                    <button
                      type="button"
                      className="gh-btn gh-btn-sm"
                      onClick={() => setPicked((s2) => ({ ...s2, [f.id]: "no" }))}
                    >
                      🚫 不能上傳
                    </button>
                  </div>
                ) : (
                  <div
                    className="mt-2.5 rounded-[10px] p-2.5 border-2"
                    style={{
                      borderColor: "var(--border)",
                      background: f.ok ? "var(--success-soft)" : "var(--danger-soft)",
                    }}
                  >
                    <div
                      className="text-sm font-extrabold mb-1"
                      style={{ color: f.ok ? "var(--diy-green-text)" : "var(--danger)" }}
                    >
                      {right ? "答對了 —— " : "正解是 —— "}
                      {f.ok ? "✅ 可以上傳" : "🚫 不能上傳"}
                    </div>
                    <p className="text-sm text-ink m-0">{f.why}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t-2 border-line pt-3">
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <span className="text-[13px] font-bold text-ink">
              在本機開發時：放一個 <code className="font-mono text-xs">.gitignore</code> 在專案根目錄
            </span>
            <button type="button" className="gh-btn gh-btn-sm" onClick={copy}>
              {copied ? "✓ 已複製" : "📋 複製"}
            </button>
          </div>
          <pre className="font-mono text-[12.5px] bg-surface2 border border-line rounded-[10px] p-3 overflow-x-auto whitespace-pre m-0">
            {GITIGNORE}
          </pre>
          <p className="text-sm text-muted mt-2 mb-0">
            寫進 <code className="font-mono text-xs">.gitignore</code> 的檔案，git
            就會當作沒看到，上傳的時候也不會把它們送上去。
            <b className="text-ink">
              　純用網頁上傳的話用不到這個檔案 —— 但你回去用 AI 在自己電腦上寫程式時一定會遇到。
            </b>
          </p>
        </div>
      </div>
    </details>
  );
}

/* README：對公務機關來說，這其實就是交接文件。 */
const README_TPL = `# 熊讚電子名片

臺北市吉祥物熊讚的一頁式電子名片，Zero to Deploy 課程練習用。

## 線上網址

https://你的帳號.github.io/你的repo名稱/

## 這個 repo 有什麼

- \`index.html\`：整個網頁，只有這一個檔案
- \`avatar.jpg\`：頭像圖片

## 想改什麼

- 名字、頭銜、簡介 → 打開 \`index.html\`，搜尋「改這裡」
- 連結按鈕 → 同上，改 \`<a href="...">\` 裡的網址
- 換頭像 → 換掉 \`avatar.jpg\`，檔名維持一樣就好

## 改完怎麼重新上線

在 GitHub 網頁上直接編輯或重新上傳檔案，按 Commit changes，
等 1～2 分鐘網站就會更新。

## 維護

臺北市政府○○局○○科 ・ 2026-09`;

function ReadmeHowTo() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(README_TPL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 忽略 */
    }
  };

  return (
    <details
      className="rounded-[14px] border-2 overflow-hidden"
      style={{
        borderColor: "color-mix(in srgb, var(--mint) 50%, var(--border))",
        background: "color-mix(in srgb, var(--mint) 8%, var(--surface))",
      }}
    >
      <summary className="cursor-pointer select-none list-none px-4 py-3 font-extrabold text-ink flex items-center gap-2 flex-wrap">
        <span className="text-lg" aria-hidden="true">
          📄
        </span>
        <span>幫你的 repo 寫一份 README</span>
        <span className="ml-auto text-muted text-xs font-normal hidden sm:inline">點此展開／收合</span>
      </summary>

      <div className="px-4 pb-4 space-y-3.5">
        <p className="text-sm text-ink mt-0 mb-0">
          上傳完之後，repo 首頁就是一排檔名。三個月後的你、或接手的同仁點進來，不知道這是什麼、網址在哪、該改哪裡。
          在 repo 根目錄放一個叫{" "}
          <code className="font-mono text-xs bg-surface2 px-1.5 py-0.5 rounded border border-line">
            README.md
          </code>{" "}
          的檔案，<b className="text-ink">GitHub 會自動把它顯示在檔案列表下面</b> —— 等於這個專案的封面。
        </p>

        <div
          className="callout"
          style={{
            borderLeftColor: "var(--mint)",
            background: "color-mix(in srgb, var(--mint) 12%, var(--surface))",
          }}
        >
          <b className="text-ink">對公務來說，README 就是交接文件。</b>
          承辦換人的時候，它決定了接手的人是「能接著改」，還是「只能整個重做」。這也是後面「交給資訊單位納管」會一直提到的事
          —— 交接不是交檔案，是交「別人看得懂的檔案」。
        </div>

        <div>
          <div className="text-[13px] font-extrabold text-muted mb-1.5">五件一定要寫的事</div>
          <ol className="list-decimal pl-5 m-0 grid gap-1 text-sm text-ink">
            <li>這是什麼、給誰用</li>
            <li>線上網址在哪</li>
            <li>要改內容的話，改哪一個檔案</li>
            <li>改完怎麼重新上線</li>
            <li>誰維護、什麼時候做的</li>
          </ol>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
            <span className="text-[13px] font-bold text-ink">可以直接拿去改的範本</span>
            <button type="button" className="gh-btn gh-btn-sm" onClick={copy}>
              {copied ? "✓ 已複製" : "📋 複製"}
            </button>
          </div>
          <pre className="font-mono text-[12.5px] bg-surface2 border border-line rounded-[10px] p-3 overflow-x-auto whitespace-pre m-0 max-h-[280px]">
            {README_TPL}
          </pre>
          <p className="text-sm text-muted mt-2 mb-0">
            <code className="font-mono text-xs">#</code> 是大標題、
            <code className="font-mono text-xs">##</code> 是小標題、
            <code className="font-mono text-xs">-</code> 是項目符號 —— 這種寫法叫{" "}
            <b className="text-ink">Markdown</b>，GitHub 會自動幫你排版好。
          </p>
        </div>

        <div
          className="callout"
          style={{
            borderLeftColor: "var(--sun)",
            background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
          }}
        >
          <b className="text-ink">⚠️ README 也是公開的。</b>
          不要在裡面寫內部系統網址、帳號密碼、金鑰，或個人手機 —— 它跟網頁一樣，全世界都看得到。
        </div>
      </div>
    </details>
  );
}

/* AI 生的網頁常常掛著 CDN，而 CDN 連不到的時候不是「醜一點」，是整頁垮掉。
   這一段把同一份 DOM 渲染兩次做對照，差別只在 .cdn-off 這個 class 套不套。
   （不放實際截圖是刻意的：截圖來自別人的檔案，畫面上有真實 email。
     也試過用 iframe srcdoc 真的渲染，但那會讓頁面永遠達不到 network idle。） */
function DemoCard({ off }) {
  return (
    <div className={"cdn-demo" + (off ? " cdn-off" : "")} data-demo={off ? "off" : "on"}>
      <h4>熊讚 Bravo</h4>
      <p className="role">臺北市吉祥物 ・ 城市代言人</p>
      <a className="btn2 primary" href="#" onClick={(e) => e.preventDefault()}>
        Facebook 粉絲團
      </a>
      <a className="btn2" href="#" onClick={(e) => e.preventDefault()}>
        臺北市政府網站
      </a>
      <a className="btn2" href="#" onClick={(e) => e.preventDefault()}>
        1999 市民熱線
      </a>
    </div>
  );
}

function CdnHowTo() {
  return (
    <details
      className="rounded-[14px] border-2 overflow-hidden"
      style={{
        borderColor: "color-mix(in srgb, var(--danger) 40%, var(--border))",
        background: "color-mix(in srgb, var(--danger) 6%, var(--surface))",
      }}
    >
      <summary className="cursor-pointer select-none list-none px-4 py-3 font-extrabold text-ink flex items-center gap-2 flex-wrap">
        <span className="text-lg" aria-hidden="true">
          🌐
        </span>
        <span>AI 幫你做的網頁，常常掛著「別人家的網址」</span>
        <span className="ml-auto text-muted text-xs font-normal hidden sm:inline">點此展開／收合</span>
      </summary>

      <div className="px-4 pb-4 space-y-3.5">
        <p className="text-sm text-ink mt-0 mb-0">
          你請 AI 做一個好看的網頁，它給你的檔案，開頭很可能長這樣：
        </p>

        <pre className="font-mono text-[11.5px] leading-relaxed bg-surface2 border-2 border-line rounded-[12px] p-3 overflow-x-auto m-0 text-ink">
          {`<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdnjs.cloudflare.com/.../font-awesome.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC" rel="stylesheet">`}
        </pre>

        <p className="text-sm text-ink m-0">
          這三行的意思都是「
          <b>這個網頁要用的東西不在檔案裡，打開的時候去別人家抓</b>
          」。網路通的時候完全沒問題 —— 問題是<b>連不到的時候</b>：
        </p>

        {/* 對照 */}
        <div className="grid gap-3 sm:grid-cols-2" data-cdn-compare>
          <figure className="m-0">
            <figcaption className="text-xs font-extrabold text-ink mb-1.5 flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--success)" }}
                aria-hidden="true"
              />
              抓得到（你自己家的網路）
            </figcaption>
            <DemoCard />
          </figure>

          <figure className="m-0">
            <figcaption className="text-xs font-extrabold text-ink mb-1.5 flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: "var(--danger)" }}
                aria-hidden="true"
              />
              抓不到（機關內網擋外連、或離線）
            </figcaption>
            <DemoCard off />
          </figure>
        </div>

        <p className="text-sm text-ink m-0">
          右邊不是「醜一點」，是<b>整頁的樣式一行都沒有</b>。
        </p>

        <div className="callout m-0">
          <b className="text-ink">為什麼差這麼多？三行的後果其實不一樣：</b>
          <div className="mt-1.5 text-sm">
            <b className="text-ink">字型</b>連不到 → 換成系統字，看起來有點不一樣而已。
            <br />
            <b className="text-ink">icon 字型</b>連不到 → icon 變空白或小方框，其他還在。
            <br />
            <b className="text-ink">Tailwind 的 CDN</b> 連不到 →{" "}
            <b className="text-ink">整頁垮掉</b>。因為它不是一份 CSS 檔，是一支「
            <b className="text-ink">在瀏覽器裡即時產生 CSS</b>
            」的程式；它沒跑起來，就等於一行 CSS 都沒有，而 AI 生的版面通常每一個樣式都靠它。
          </div>
        </div>

        <div className="text-sm font-extrabold text-ink">什麼時候會連不到？</div>
        <ul className="list-disc pl-5 m-0 grid gap-1 text-sm text-ink">
          <li>
            <b>機關內網擋外連</b> —— 對公務環境來說這是最常見的一種，而且你在家測都是好的。
          </li>
          <li>離線展示：帶著筆電去會議室、現場沒網路。</li>
          <li>對方網路不穩，或那個 CDN 自己出問題、改版、停止服務。</li>
        </ul>

        <div className="text-sm font-extrabold text-ink">那該怎麼辦？</div>
        <ol className="list-decimal pl-5 m-0 grid gap-1.5 text-sm text-ink">
          <li>
            <b>最省事：請 AI 重做一次。</b>直接說「
            <span className="text-muted">不要用任何 CDN，把 CSS 直接寫在同一個檔案裡，icon 用 inline SVG</span>
            」。這句話值得存起來。
          </li>
          <li>
            <b>已經做好了：把樣式搬進檔案裡。</b>把用到的 CSS 貼進{" "}
            <code className="font-mono text-xs">&lt;style&gt;</code>，圖片下載下來一起上傳。
          </li>
          <li>
            <b>真的需要框架：那就走建置。</b>React、Vue 這類東西本來就該先 build 成純 HTML／CSS／JS
            再上線 —— 那是<b>第 5 關</b>的事，平台會自動幫你做，產出的檔案就不再依賴 CDN。
          </li>
        </ol>

        <div
          className="callout m-0"
          style={{
            borderLeftColor: "var(--mint)",
            background: "color-mix(in srgb, var(--mint) 12%, var(--surface))",
          }}
        >
          <b className="text-ink">你剛下載的那個名片範本，就是零外部依賴的。</b>
          <div className="mt-1 text-sm">
            icon 全是寫在檔案裡的 SVG、字型用系統內建的，所以它<b className="text-ink">離線也打得開</b>。
            不信可以自己試：把 Wi-Fi 關掉，再用瀏覽器打開你電腦裡那個 index.html。
          </div>
        </div>
      </div>
    </details>
  );
}

function ImageHowTo() {
  const [picked, setPicked] = useState({});

  return (
    <details
      className="rounded-[14px] border-2 overflow-hidden"
      style={{
        borderColor: "color-mix(in srgb, var(--accent) 45%, var(--border))",
        background: "color-mix(in srgb, var(--accent) 8%, var(--surface))",
      }}
    >
      <summary className="cursor-pointer select-none list-none px-4 py-3 font-extrabold text-ink flex items-center gap-2 flex-wrap">
        <span className="text-lg" aria-hidden="true">
          🖼️
        </span>
        <span>想放自己的照片或圖片？</span>
        <span className="ml-auto text-muted text-xs font-normal hidden sm:inline">點此展開／收合</span>
      </summary>

      <div className="px-4 pb-4 space-y-3.5">
        <p className="text-sm text-ink mt-0 mb-0">
          網頁<b>不會</b>把圖片存在自己裡面，它只是記著「去哪裡拿那張圖」。所以圖片一定要
          <b className="text-ink">跟網頁一起上傳</b>，而且路徑要寫對 —— 三個步驟：
        </p>

        <ol className="list-decimal pl-5 m-0 grid gap-2 text-sm">
          <li>
            <b className="text-ink">先把檔名改乾淨</b>
            <div className="text-muted mt-0.5">
              <code className="font-mono text-xs bg-surface2 px-1.5 py-0.5 rounded border border-line">
                頭貼 1.JPG
              </code>{" "}
              →{" "}
              <code className="font-mono text-xs bg-surface2 px-1.5 py-0.5 rounded border border-line">
                avatar.jpg
              </code>
              　英文小寫、不要空白、不要中文。
            </div>
          </li>
          <li>
            <b className="text-ink">跟 index.html 一起上傳到 repo</b>
            <div className="text-muted mt-0.5">
              Add file → Upload files，可以一次把好幾個檔案（或整個資料夾）拖進去。
            </div>
          </li>
          <li>
            <b className="text-ink">在 HTML 裡用相對路徑引用它</b>
            <div className="text-muted mt-0.5">
              <code className="font-mono text-xs bg-surface2 px-1.5 py-0.5 rounded border border-line">
                {'<img src="avatar.jpg" alt="我的大頭照">'}
              </code>
              　<b className="text-ink">alt</b> 一定要寫：圖沒載出來、或用螢幕報讀軟體的人，靠它知道這是什麼。
            </div>
          </li>
        </ol>

        <div className="text-sm font-extrabold text-muted pt-1">
          🧪 練習：下面四個會顯示，還是會破圖？
        </div>

        <div className="grid gap-2.5">
          {IMG_CASES.map((c) => {
            const my = picked[c.id];
            const right = my === (c.ok ? "ok" : "no");
            return (
              <div key={c.id} data-img={c.id} className="border-2 border-line rounded-[14px] bg-surface p-3">
                <div className="text-xs text-muted mb-1.5">📁 {c.setup}</div>
                <pre className="font-mono text-[12px] bg-surface2 border border-line rounded-[8px] px-2.5 py-2 overflow-x-auto whitespace-pre m-0">
                  {c.code}
                </pre>
                {!my ? (
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    <button
                      type="button"
                      className="gh-btn gh-btn-sm"
                      onClick={() => setPicked((s) => ({ ...s, [c.id]: "ok" }))}
                    >
                      🖼️ 會顯示
                    </button>
                    <button
                      type="button"
                      className="gh-btn gh-btn-sm"
                      onClick={() => setPicked((s) => ({ ...s, [c.id]: "no" }))}
                    >
                      💔 會破圖
                    </button>
                  </div>
                ) : (
                  <div
                    className="mt-2.5 rounded-[10px] p-2.5 border-2"
                    style={{
                      borderColor: "var(--border)",
                      background: c.ok
                        ? "var(--success-soft)"
                        : "color-mix(in srgb, var(--sun) 16%, var(--surface))",
                    }}
                  >
                    <div
                      className="text-sm font-extrabold mb-1"
                      style={{ color: c.ok ? "var(--diy-green-text)" : "var(--diy-yellow-text)" }}
                    >
                      {right ? "答對了 —— " : "正解是 —— "}
                      {c.ok ? "🖼️ 會顯示" : "💔 會破圖"}
                    </div>
                    <p className="text-sm text-ink m-0">{c.why}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t-2 border-line pt-3 grid gap-2 text-sm">
          <div>
            <b className="text-ink">📉 圖片先縮小再上傳。</b>
            <span className="text-muted">
              　手機拍的照片動輒 3～5 MB，網頁會慢到市民不想等。頭貼 400×400、橫幅寬 1200
              就很夠了，用小畫家或線上工具縮一下即可。
            </span>
          </div>
          <div>
            <b className="text-ink">🔗 不要直接貼別人網站的圖片網址。</b>
            <span className="text-muted">
              　那叫「熱連結」：對方改個檔名、或擋掉外部連結，你的頁面就破圖，而且等於用了別人的頻寬，也有版權問題。要用就把圖存下來、確認可以用，再上傳到自己的
              repo。
            </span>
          </div>
          <div>
            <b className="text-ink">⚠️ 圖片一上傳就是全世界看得到。</b>
            <span className="text-muted">
              　不要放有市民臉孔的活動照、含姓名電話的截圖、未公開的公文影像。用別人的圖也要確認授權（機關素材、CC
              授權或自己拍的最安全）。
            </span>
          </div>
        </div>
      </div>
    </details>
  );
}

function OwnFileChecklist() {
  return (
    <details
      className="rounded-[14px] border-2 overflow-hidden"
      style={{
        borderColor: "color-mix(in srgb, var(--sun) 55%, var(--border))",
        background: "color-mix(in srgb, var(--sun) 12%, var(--surface))",
      }}
    >
      <summary className="cursor-pointer select-none list-none px-4 py-3 font-extrabold text-ink flex items-center gap-2 flex-wrap">
        <span className="text-lg" aria-hidden="true">
          🩹
        </span>
        <span>要傳自己做的檔案？先看這 6 個雷</span>
        <span className="ml-auto text-muted text-xs font-normal hidden sm:inline">點此展開／收合</span>
      </summary>
      <div className="px-4 pb-4">
        <p className="text-sm text-ink mt-0 mb-3">
          如果你要上傳的不是上面的範本，而是<b>自己（或 AI 幫你）在電腦上做好的檔案</b>
          ，下面這些在你電腦雙擊時完全看不出來，一上線才會壞：
        </p>
        <ol className="list-decimal pl-5 m-0 grid gap-2.5 text-sm">
          {PITFALLS.map((p) => (
            <li key={p.t}>
              <b className="text-ink">{p.t}</b>
              <div className="text-muted mt-0.5">{p.d}</div>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
