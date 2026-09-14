import { useState } from "react";
import Level from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

/* 這一關原本叫「EXE / Queue」，但佇列跟 EXE 其實是兩件事 ——
   佇列已經搬到名詞小教室的「佇列 / 排隊」卡（連模擬器一起）。
   關卡 id 仍是 exe-queue：改 id 會讓已經完成這一關的人進度歸零，不值得。 */

/* 用 Keep a Changelog 的分類。英文一起列是因為學員在別人的 repo 上會看到英文。 */
const CHANGE_KINDS = [
  ["Added", "新增", "多了以前沒有的功能", "var(--diy-green-text)"],
  ["Changed", "變更", "原本就有，但做法或畫面改了", "var(--accent-text)"],
  ["Fixed", "修正", "修掉了錯誤", "var(--frontend-text)"],
  ["Removed", "移除", "拿掉了某個功能", "var(--muted)"],
  ["Deprecated", "即將移除", "還能用，但下一版要拿掉，請先改用別的", "var(--diy-yellow-text)"],
  ["Security", "資安", "修補資安問題 —— 這類要特別標出來，讓人知道該儘快更新", "var(--danger)"],
];

/* 同一件事，寫給程式看 vs 寫給使用者看 */
const REWRITES = [
  {
    id: "null",
    bad: "fix: null check in exportReport()",
    good: "修正：承辦人欄位空白時，整份月報表會匯出失敗",
    why: "同事看不懂 exportReport() 是什麼，但看得懂「欄位空白會失敗」—— 而且他馬上知道自己上週那次匯不出來就是這個原因。",
  },
  {
    id: "limit",
    bad: "update: 調整查詢邏輯",
    good: "修正：資料超過 1000 筆時，最後幾筆會漏掉（請重新匯出 8 月以前的報表）",
    why: "「調整查詢邏輯」等於什麼都沒說。寫清楚影響範圍，看的人才知道要不要回頭補做。",
  },
  {
    id: "refactor",
    bad: "refactor: 重構匯出模組",
    good: "（不用寫進 changelog）",
    why: "純內部整理、使用者完全無感的事，寫進去只會稀釋真正重要的那幾條。changelog 不是工作日誌。",
  },
];

const CHANGELOG = `## v1.2.0 — 2026-09-14

### 新增 Added
- 月報表可以一次匯出多個科室

### 變更 Changed
- 匯出的檔名改成「科室_年月.xlsx」，比較好排序

### 修正 Fixed
- 修正：承辦人欄位空白時，整份月報表會匯出失敗
- 修正：資料超過 1000 筆時，最後幾筆會漏掉（請重新匯出 8 月以前的報表）

### 資安 Security
- 更新了一個有已知漏洞的套件，建議儘快更新

---

## v1.1.0 — 2026-08-02

### 新增 Added
- 匯出時可以選擇年月`;

export default function ExeQueueLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.exeQueue}
      done={{ ...DONE.exeQueue }}
      steps={[
        ({ next }) => <ConceptStep onNext={next} />,
        ({ next }) => <PackStep onNext={next} />,
        ({ finish }) => <ReleaseStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：EXE 是什麼、什麼時候該用 ---------- */
const WHICH = [
  {
    id: "form",
    text: "想做一個查詢頁，讓全局處同仁都能查最新的活動報名狀況。",
    answer: "web",
    why: "人多、又要看「最新的」—— 做成網頁最好：改一次所有人下次打開就是新的，也不用每台電腦裝東西。",
  },
  {
    id: "localfile",
    text: "要批次把 300 個公文檔案改檔名，檔案都在同仁自己電腦的資料夾裡。",
    answer: "exe",
    why: "要動的是「使用者自己電腦上的檔案」—— 網頁基於安全考量碰不到，這種就適合做成在本機執行的小工具。",
  },
  {
    id: "offline",
    text: "承辦要帶著筆電到沒有網路的場地，現場整理報到資料。",
    answer: "exe",
    why: "沒有網路，網頁就打不開。要離線也能用，就得是裝在那台電腦上的程式。",
  },
  {
    id: "share",
    text: "想把一份統計做成圖表，貼連結給長官看。",
    answer: "web",
    why: "給別人看的東西，一個網址最省事。要人家先下載一個 .exe 再雙擊，多數人會直接放棄（而且很多機關電腦也不准裝）。",
  },
];

const PICK = {
  web: { label: "🌐 做成網頁", color: "var(--frontend-text)", soft: "var(--accent-soft)" },
  exe: { label: "📦 做成 EXE", color: "var(--backend-text)", soft: "color-mix(in srgb, var(--sun) 16%, var(--surface))" },
};

function ConceptStep({ onNext }) {
  const [picked, setPicked] = useState({});
  const answered = Object.keys(picked).length;
  const all = answered === WHICH.length;

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 1 / 3 · 這是什麼
      </span>
      <h2 className="text-2xl font-bold text-ink">EXE：不上網的那一種「給別人用」📦</h2>

      <div className="callout callout-info">
        前面九關都在講「<b className="text-ink">放到網路上，給你一個網址</b>」。但有些東西不適合上網 ——
        它要動使用者自己電腦裡的檔案、或要在沒網路的地方用。這時候就把程式和它需要的環境
        <b className="text-ink">打包成一個檔案</b>，同事雙擊就能跑，不必安裝任何東西。這就是 EXE（執行檔）。
      </div>

      <div className="text-sm font-extrabold text-muted pt-1">
        🧪 練習：這四件事，做成網頁還是做成 EXE？
      </div>

      <div className="grid gap-2.5">
        {WHICH.map((c) => {
          const my = picked[c.id];
          const right = my === c.answer;
          return (
            <div key={c.id} data-which={c.id} className="border-2 border-line rounded-[14px] bg-surface p-3.5">
              <p className="text-[15px] text-ink m-0 mb-2.5">{c.text}</p>
              {!my ? (
                <div className="flex flex-wrap gap-2">
                  {["web", "exe"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      className="gh-btn gh-btn-sm"
                      onClick={() => setPicked((s) => ({ ...s, [c.id]: v }))}
                    >
                      {PICK[v].label}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-[12px] p-3 border-2"
                  style={{ borderColor: "var(--border)", background: PICK[c.answer].soft }}
                >
                  <div className="text-sm font-extrabold mb-1" style={{ color: PICK[c.answer].color }}>
                    {right ? "判斷正確 —— " : "正解是 —— "}
                    {PICK[c.answer].label}
                  </div>
                  <p className="text-sm text-ink m-0">{c.why}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button type="button" className="btn btn-primary" disabled={!all} onClick={onNext}>
        {all ? "下一步：打包成 EXE →" : `四題都選看看（${answered} / 4）`}
      </button>
    </div>
  );
}

/* ---------- 步驟 2：打包 + 防毒誤判 ---------- */
function PackStep({ onNext }) {
  const [packed, setPacked] = useState(false);

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 2 / 3 · 動手打包
      </span>
      <h2 className="text-2xl font-bold text-ink">把工具打包成一個 EXE 📦</h2>
      <p className="text-muted text-sm">
        把「你的程式」和「執行環境」包成一個檔案，別人雙擊就能用，不必先裝 Python 或 Node。
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="card card-sm text-center">
          <div className="text-3xl">📄</div>
          <div className="text-sm font-bold text-ink mt-1">你的程式</div>
          <div className="text-xs text-muted">＋ 執行環境</div>
        </div>
        <div className="text-2xl text-muted">→</div>
        <div
          className="card card-sm text-center"
          style={{ borderColor: packed ? "var(--mint)" : "var(--border)" }}
        >
          <div className="text-3xl">{packed ? "📦" : "❔"}</div>
          <div className="text-sm font-bold text-ink mt-1">{packed ? "my-tool.exe" : "還沒打包"}</div>
          <div className="text-xs text-muted">{packed ? "雙擊就能執行" : ""}</div>
        </div>
      </div>

      {!packed ? (
        <div className="text-center">
          <button type="button" className="btn btn-accent" onClick={() => setPacked(true)}>
            🔨 打包成 EXE
          </button>
        </div>
      ) : (
        <>
          <div
            className="callout"
            style={{
              borderLeftColor: "var(--success)",
              background: "var(--success-soft)",
              color: "var(--success)",
            }}
          >
            <b>✅ 打包完成！</b> 你可以把{" "}
            <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">
              my-tool.exe
            </code>{" "}
            傳給別人，他雙擊就能用。
            <div className="text-muted text-xs mt-1 font-normal">
              （實務上常用 PyInstaller、pkg、Electron Builder、Tauri 等工具來做。）
            </div>
          </div>

          <div
            className="callout"
            style={{
              borderLeftColor: "var(--danger)",
              background: "color-mix(in srgb, var(--danger) 8%, var(--surface))",
            }}
          >
            <b className="text-ink">🛡️ 然後你會遇到第一道牆：防毒軟體。</b>
            <div className="mt-1.5">
              自己打包出來的 EXE <b className="text-ink">很常被防毒誤判</b>
              ，尤其是 PyInstaller 打出來的 —— 因為它的長相跟某些惡意程式的打包方式很像。同事那邊可能是跳警告，也可能是
              <b className="text-ink">檔案直接被刪掉</b>，而他根本不會告訴你，只會覺得「你給的東西怪怪的」。
            </div>
            <ul className="list-disc pl-5 mt-2 mb-0 grid gap-1 text-sm">
              <li>
                正式要發給比較多人時，要申請<b className="text-ink">程式碼簽章憑證（code signing）</b>
                替檔案簽名，讓系統認得出「這是誰做的」。這通常要走機關的採購或資訊單位。
              </li>
              <li>
                機關電腦多半有統一的防毒政策和軟體白名單，<b className="text-ink">先問資訊單位</b>
                再發，不要直接丟到群組裡叫大家「忽略警告點執行」—— 那正好是在訓練同仁對資安警告無感。
              </li>
              <li>反過來說：你自己也不要隨便執行來路不明的 EXE。</li>
            </ul>
          </div>
        </>
      )}

      <button type="button" className="btn btn-primary" disabled={!packed} onClick={onNext}>
        {packed ? "下一步：那要怎麼發新版本？ →" : "先打包看看"}
      </button>
    </div>
  );
}

/* ---------- 步驟 3：發版本、寫 changelog、更新的成本 + 最終測驗 ---------- */
function ReleaseStep({ onFinish }) {
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(false);
  const [passed, setPassed] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CHANGELOG);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* 忽略 */
    }
  };

  return (
    <div className="space-y-4">
      <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">
        步驟 3 / 3 · 發版本
      </span>
      <h2 className="text-2xl font-bold text-ink">改好了，怎麼讓大家拿到新版？🏷️</h2>

      {/* 版本號 */}
      <div className="border-2 border-line rounded-[16px] bg-surface2 p-4 space-y-3">
        <div className="text-[13px] font-extrabold text-muted">🔢 先看懂版本號</div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <code className="font-mono text-xl font-extrabold text-ink bg-surface px-3 py-1 rounded-lg border-2 border-line">
            v1.4.2
          </code>
        </div>
        <div className="grid gap-1.5 text-sm">
          {[
            ["1", "主版本", "大改，用法變了、舊的做法可能不能用了"],
            ["4", "次版本", "加了新功能，但原本的用法照舊"],
            ["2", "修訂", "只修錯誤，沒有新東西"],
          ].map(([n, t, d]) => (
            <div key={t} className="flex gap-2.5 items-baseline">
              <code className="font-mono text-sm font-extrabold text-accentText w-4 shrink-0">{n}</code>
              <b className="text-ink shrink-0">{t}</b>
              <span className="text-muted">{d}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted m-0">
          像公文的修正版次。看到只有最後一碼變，同事就知道「只是修錯誤」，可以放心更新。
        </p>
      </div>

      {/* changelog 分類 */}
      <div className="border-2 border-line rounded-[16px] bg-surface2 p-4 space-y-3">
        <div className="text-[13px] font-extrabold text-muted">📝 每一版附一份 changelog（更新說明）</div>
        <p className="text-sm text-ink m-0">
          在 GitHub 上發一個 <b className="text-ink">Release</b>：選一個版本號、附上打包好的檔案、
          再寫一段「這一版改了什麼」。常見的分類就這六種：
        </p>
        <div className="grid gap-1.5" data-changekinds>
          {CHANGE_KINDS.map(([en, zh, d, color]) => (
            <div key={en} className="flex gap-2.5 items-baseline flex-wrap text-sm">
              <span className="font-extrabold shrink-0" style={{ color }}>
                {zh}
              </span>
              <code className="font-mono text-xs text-muted shrink-0">{en}</code>
              <span className="text-muted">{d}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted m-0">
          （你可能也看過 <code className="font-mono text-xs">feat:</code>{" "}
          <code className="font-mono text-xs">fix:</code> 這種寫法 —— 那是寫在
          <b className="text-ink">每一次存檔（commit）的訊息</b>上的，跟這裡的更新說明是兩件事，只是常一起用。）
        </p>
      </div>

      {/* 寫給誰看 */}
      <div className="border-2 border-line rounded-[16px] bg-surface2 p-4 space-y-3">
        <div className="text-[13px] font-extrabold text-muted">
          ✍️ 最重要的一件事：changelog 是寫給「使用的人」看的
        </div>
        <p className="text-sm text-ink m-0">
          分類很好記，難的是內容。每一條都要讓看的人回答得出
          <b className="text-ink">「這關我什麼事？我要不要更新？」</b>。點開看三組對照：
        </p>
        <div className="grid gap-2">
          {REWRITES.map((r) => {
            const isOpen = open === r.id;
            return (
              <div
                key={r.id}
                data-rewrite={r.id}
                className="border-2 rounded-[12px] bg-surface overflow-hidden"
                style={{ borderColor: isOpen ? "var(--accent)" : "var(--border)" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen((c) => (c === r.id ? null : r.id))}
                  className="w-full text-left px-3 py-2.5 flex items-center gap-2"
                  aria-expanded={isOpen}
                >
                  <span className="shrink-0" style={{ color: "var(--danger)" }}>
                    ✗
                  </span>
                  <code className="font-mono text-[12.5px] text-ink flex-1 min-w-0 truncate">{r.bad}</code>
                  <span className="text-muted">{isOpen ? "▴" : "▾"}</span>
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 pt-2.5 border-t-2 border-line space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0" style={{ color: "var(--diy-green-text)" }}>
                        ✓
                      </span>
                      <b className="text-ink text-sm">{r.good}</b>
                    </div>
                    <p className="text-sm text-muted m-0">{r.why}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 範本 */}
      <div>
        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
          <span className="text-[13px] font-bold text-ink">可以直接套的 changelog 範本</span>
          <button type="button" className="gh-btn gh-btn-sm" onClick={copy}>
            {copied ? "✓ 已複製" : "📋 複製"}
          </button>
        </div>
        <pre className="font-mono text-[12.5px] bg-surface2 border border-line rounded-[10px] p-3 overflow-x-auto whitespace-pre m-0 max-h-[300px]">
          {CHANGELOG}
        </pre>
      </div>

      {/* 更新的成本：網頁 vs EXE */}
      <div
        className="callout"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">⏱️ 最後一件事：更新這件事，網頁是免費的，EXE 要花力氣。</b>
        <div className="mt-1.5">
          <b className="text-ink">網頁</b>：你改一次，下一個人打開就是新的 —— 沒有人會留在舊版。
          <br />
          <b className="text-ink">EXE</b>：預設不會更新。做得到，但那是要
          <b className="text-ink">另外做的功能</b>：程式每次啟動時去問「最新版是哪一版」，有新版就下載、提示使用者重開。
        </div>
        <ul className="list-disc pl-5 mt-2 mb-0 grid gap-1 text-sm">
          <li>
            Electron、Tauri 有現成的自動更新機制，很常直接拿 GitHub Releases 當更新來源；
            <b className="text-ink">PyInstaller 沒有內建</b>，要另外接工具或自己寫。
          </li>
          <li>
            GitHub Releases 只是「放版本化檔案的地方」，
            <b className="text-ink">它不會主動通知使用者</b> —— 是你的程式自己去問的。
          </li>
          <li>
            在機關裡還要再過幾關：程式連不連得到外網、
            <b className="text-ink">自動下載並取代執行檔會不會被防毒擋</b>
            、使用者有沒有寫入權限、檔案有沒有簽章。
          </li>
        </ul>
        <div className="mt-2">
          所以：<b className="text-ink">能做成網頁的，就別做成 EXE</b>
          。真的需要 EXE，就從一開始把版本號和更新說明寫好 —— 至少讓同事看得出自己手上是哪一版。
        </div>
      </div>

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.exeQueue} onCorrect={() => setPassed(true)} />

      <button type="button" className="btn btn-primary" disabled={!passed} onClick={onFinish}>
        完成整張地圖 🏆
      </button>
    </div>
  );
}
