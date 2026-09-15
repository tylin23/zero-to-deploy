import { useRef, useState } from "react";
import Level, { Eyebrow } from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";
import SceneMap from "../components/SceneMap.jsx";
import ZoomFigure from "../components/ZoomFigure.jsx";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function IntroLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.concept}
      done={DONE.intro}
      steps={[
        ({ next }) => <LocalVsDeployStep onNext={next} />,
        ({ next }) => <ConceptStep onNext={next} />,
        ({ next }) => <FrontBackStep onNext={next} navigate={ctx.navigate} />,
        ({ next }) => (
          <div className="space-y-4">
            <Eyebrow>第四步 · 檢查一下</Eyebrow>
            <Quiz {...QUIZZES.intro} onCorrect={() => setTimeout(next, 1200)} />
          </div>
        ),
        ({ finish }) => <DeployStep onDone={finish} />,
      ]}
    />
  );
}

/* =========================================================
   第一步：本機的 HTML vs 部署後的網址
   （很多同仁已經會用 AI 在自己電腦做出 HTML，卡住的是「怎麼給別人用」，
     這一步就從那個痛點開始講。）
   ========================================================= */

const TRIES = [
  {
    id: "send",
    icon: "📎",
    label: "用 LINE / Email 把 index.html 傳給同事",
    verdict: "warn",
    title: "勉強可以，但問題很多",
    points: [
      "對方要先下載、找到檔案、再想辦法打開 —— 很多人卡在這一步。",
      "附檔常被郵件系統或防毒擋掉，手機點開多半也不會顯示成網頁。",
      "你每改一次內容，就要重傳一次給所有人，而且沒人知道誰手上是舊版。",
      "如果不只一個檔案（圖片、CSS），傳過去就散掉了，會破圖。",
      "最關鍵的是：你沒辦法用這個方式給市民。",
    ],
  },
  {
    id: "share",
    icon: "📁",
    label: "丟到科室的共用資料夾",
    verdict: "warn",
    title: "同仁可以，市民不行",
    points: [
      "共用資料夾的位置長這樣：\\\\server\\科室\\公告\\index.html —— 那是路徑，不是網址。",
      "只有連得到市府內網的人打得開，市民完全拿不到。",
      "檔案放在那裡，任何有權限的人都可能不小心改到或刪掉。",
    ],
  },
  {
    id: "come",
    icon: "🖥️",
    label: "請同事過來看我的電腦",
    verdict: "bad",
    title: "這其實就是「還沒部署」",
    points: [
      "一次只能給一個人看，你不在位子上就沒得看。",
      "電腦關機、睡眠、被收回維修，東西就消失了。",
      "這正是為什麼需要「一台一直開著、大家都連得到的電腦」。",
    ],
  },
  {
    id: "deploy",
    icon: "🌐",
    label: "放到一台一直開著的電腦上，給大家一個網址",
    verdict: "good",
    title: "對了 —— 這件事就叫「部署」",
    points: [
      "同事、市民、手機、電腦，任何人拿到網址就能打開。",
      "你改了內容，重新上傳一次，所有人看到的立刻都是新版。",
      "這整堂課要教的，就是怎麼做到這件事（而且不用寫程式、不用打指令）。",
    ],
  },
];

const VERDICT = {
  good: { chip: "✅ 可行", color: "var(--success)", soft: "var(--success-soft)" },
  warn: {
    chip: "⚠️ 有問題",
    color: "var(--diy-yellow-text)",
    soft: "color-mix(in srgb, var(--sun) 16%, var(--surface))",
  },
  bad: { chip: "⛔ 不行", color: "var(--danger)", soft: "var(--danger-soft)" },
};

function LocalVsDeployStep({ onNext }) {
  const [opened, setOpened] = useState({});
  const allSeen = TRIES.every((t) => opened[t.id]);

  return (
    <div className="space-y-4">
      <Eyebrow>第一步 · 你現在卡在哪裡</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">「在我電腦上跑得好好的」—— 然後呢？</h2>

      <div className="callout callout-info">
        <b className="text-ink">你可能已經會了：</b>用 AI
        幫你寫一個小工具或一頁公告，存成檔案放在桌面，滑鼠雙擊，瀏覽器就打開了，功能都正常。
        <br />
        <br />
        <b className="text-ink">卡住的是下一步：那要怎麼讓「別人」也打得開？</b>
        這一關就從這裡開始。
      </div>

      <div>
        <h3 className="text-ink font-bold mb-1">先想想：你現在會怎麼做？</h3>
        <p className="text-muted text-sm mb-3">四個都點點看，就知道差在哪了。</p>
        <div className="grid gap-2.5">
          {TRIES.map((t) => {
            const on = opened[t.id];
            const v = VERDICT[t.verdict];
            return (
              <div
                key={t.id}
                data-try={t.id}
                className="rounded-[16px] border-2 overflow-hidden"
                style={{
                  borderColor: on ? v.color : "var(--border)",
                  background: on ? v.soft : "var(--surface)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpened((o) => ({ ...o, [t.id]: true }))}
                  aria-expanded={!!on}
                  className="w-full text-left flex gap-2.5 items-center p-3.5"
                >
                  <span className="text-2xl shrink-0" aria-hidden="true">
                    {t.icon}
                  </span>
                  <span className="font-bold text-ink text-[15px] flex-1">{t.label}</span>
                  <span
                    className="text-xs font-extrabold whitespace-nowrap"
                    style={{ color: on ? v.color : "var(--muted)" }}
                  >
                    {on ? v.chip : "看結果 →"}
                  </span>
                </button>
                {on && (
                  <div className="px-3.5 pb-3.5 -mt-1">
                    <div className="font-extrabold text-sm mb-1" style={{ color: v.color }}>
                      {t.title}
                    </div>
                    <ul className="list-disc pl-5 m-0 grid gap-1 text-sm text-ink">
                      {t.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {allSeen && (
        <>
          <h3 className="text-ink font-bold">差別，全部寫在網址列上</h3>
          <p className="text-muted text-sm -mt-2">
            下次你雙擊打開自己做的檔案時，看一眼瀏覽器最上面那一行 ——
          </p>

          <UrlBar
            tone="local"
            url="file:///C:/Users/你的帳號/Desktop/公告/index.html"
            tag="現在（本機）"
            note="開頭是 file://，它不是網址，是「你這台電腦裡的一條路徑」。只有你的電腦有這個資料夾；別人把這串字貼到瀏覽器，什麼也不會發生。"
          />
          <UrlBar
            tone="web"
            url="https://你的帳號.github.io/announce/"
            tag="部署後"
            note="開頭是 https://，這才是網址。同事、市民、手機、任何地方，拿到它就打得開。"
          />

          <div
            className="callout"
            style={{
              borderLeftColor: "var(--sun)",
              background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
            }}
          >
            所以一句話講完：
            <b className="text-ink">部署，就是把「只有你電腦有的那條路徑」，換成「全世界都到得了的網址」。</b>
            你已經做好的 HTML 完全不用重做 —— 缺的只是後面這一步。
          </div>

          <button type="button" className="btn btn-primary" onClick={onNext}>
            懂了，那網址是怎麼運作的？ →
          </button>
        </>
      )}
    </div>
  );
}

// 只畫網址列：這一步的重點就是那串字，不需要整個瀏覽器視窗
function UrlBar({ url, tone, tag, note }) {
  const local = tone === "local";
  const color = local ? "var(--danger)" : "var(--success)";
  return (
    <div>
      <div
        className="rounded-[14px] border-2 overflow-hidden"
        style={{ borderColor: color, background: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 py-2.5 px-3 border-b-2 border-line bg-surface2">
          <div className="flex gap-1.5 shrink-0" aria-hidden="true">
            <i className="w-2.5 h-2.5 rounded-full block" style={{ background: "#ff5f57" }} />
            <i className="w-2.5 h-2.5 rounded-full block" style={{ background: "#febc2e" }} />
            <i className="w-2.5 h-2.5 rounded-full block" style={{ background: "#28c840" }} />
          </div>
          <div className="flex-1 font-mono text-[11px] sm:text-xs text-ink bg-surface rounded-lg py-1.5 px-2.5 border border-line overflow-x-auto whitespace-nowrap">
            {url}
          </div>
          <span className="text-[11px] font-extrabold whitespace-nowrap shrink-0" style={{ color }}>
            {local ? "🔒 只有你" : "🌍 所有人"}
          </span>
        </div>
        <div className="p-3">
          <div className="text-xs font-extrabold mb-1" style={{ color }}>
            {tag}
          </div>
          <p className="text-sm text-ink m-0">{note}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   第一步：request / response 動畫
   ========================================================= */

// 三個階段。dir 決定箭頭方向，from/to 是封包在通道上的位置（0 = 瀏覽器端，1 = 伺服器端）
const STAGES = [
  {
    n: "①",
    tab: "送出請求",
    dir: "forward",
    from: 0,
    to: 1,
    color: "var(--accent-dark)",
    packet: { icon: "📨", label: "請求" },
    dirLabel: "瀏覽器 → 伺服器",
    caption: "① 市民的瀏覽器送出請求：「我要看『市民健康講座』這一頁」",
  },
  {
    n: "②",
    tab: "回傳檔案",
    dir: "back",
    from: 1,
    to: 0,
    color: "var(--mint-deep)",
    packet: { icon: "📄", label: "網頁檔案" },
    dirLabel: "伺服器 → 瀏覽器",
    caption: "② 伺服器找出那個檔案，原封不動傳回去（HTML／CSS／JS）",
  },
  {
    n: "③",
    tab: "畫成畫面",
    dir: null,
    from: 0,
    to: 0,
    color: "var(--primary)",
    packet: null,
    caption: "③ 瀏覽器把收到的檔案「畫」成畫面 → 市民就看到你的講座公告了 🎉",
  },
];

const TRAVEL = 1900; // 封包在通道上移動的時間
const HOLD = 1000; // 每一段結束後停一下，讓人看得完字

function ConceptStep({ onNext }) {
  const [stage, setStage] = useState(0); // 0 = 還沒播
  const [pos, setPos] = useState(0); // 封包位置 0~1
  const [dur, setDur] = useState(0); // 移動的過場時間（跳關時設 0，直接定位）
  const [playing, setPlaying] = useState(false);
  const run = useRef(0); // 播放批次編號，重播時讓上一輪自己停下來

  const st = stage > 0 ? STAGES[stage - 1] : null;

  const play = async () => {
    const me = ++run.current;
    setPlaying(true);
    setStage(0);
    setDur(0);
    setPos(0);
    await sleep(450);

    for (const [i, s] of STAGES.entries()) {
      if (run.current !== me) return;
      setStage(i + 1);
      setDur(0);
      setPos(s.from);
      await sleep(70); // 先用 0 過場把封包定到起點，再開始移動
      if (run.current !== me) return;
      if (s.from !== s.to) {
        setDur(TRAVEL);
        setPos(s.to);
        await sleep(TRAVEL);
      }
      if (run.current !== me) return;
      await sleep(HOLD);
    }
    if (run.current === me) setPlaying(false);
  };

  // 點階段標籤：直接跳到那一格的「定格」狀態，老師可以自己控制節奏
  const jump = (i) => {
    run.current++;
    setPlaying(false);
    setDur(0);
    setStage(i + 1);
    setPos(STAGES[i].to);
  };

  return (
    <div className="space-y-4">
      <Eyebrow>第二步 · 概念</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">市民打開你做的「講座公告頁」時，發生了什麼事？</h2>
      <p className="text-muted text-sm">
        情境：你想把一頁「市民健康講座公告」放上網，讓市民查得到。按「播放」看一次「瀏覽器 ↔ 伺服器」的對話，
        也可以點上面的 ①②③ 自己一格一格看。
      </p>

      {/* 階段標籤：兼作進度指示與跳關按鈕 */}
      <div className="flex gap-2 flex-wrap">
        {STAGES.map((s, i) => {
          const on = stage === i + 1;
          return (
            <button
              key={s.n}
              type="button"
              onClick={() => jump(i)}
              aria-current={on ? "step" : undefined}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border-2 transition-colors"
              style={
                on
                  ? {
                      borderColor: s.color,
                      background: `color-mix(in srgb, ${s.color} 15%, var(--surface))`,
                      color: s.color,
                    }
                  : { borderColor: "var(--border)", background: "var(--surface)", color: "var(--muted)" }
              }
            >
              {s.n} {s.tab}
            </button>
          );
        })}
      </div>

      <div className="rounded-[18px] border-2 border-line bg-surface2 p-3 sm:p-4">
        {/* 桌機：左右並排 */}
        <div className="hidden sm:grid grid-cols-[1fr_minmax(180px,1.1fr)_1fr] items-center gap-2">
          <Node emoji="💻" label="市民的瀏覽器" sub="市民的手機或電腦" tag="前端在這裡跑" />
          <Lane st={st} pos={pos} dur={dur} />
          <Node emoji="🖥️" label="伺服器" sub="一直開著的電腦" tag="後端在這裡跑" />
        </div>
        {/* 手機：上下堆疊，通道也轉成直的 */}
        <div className="sm:hidden grid gap-1">
          <Node emoji="💻" label="市民的瀏覽器" sub="市民的手機或電腦" tag="前端在這裡跑" />
          <Lane st={st} pos={pos} dur={dur} vertical />
          <Node emoji="🖥️" label="伺服器" sub="一直開著的電腦" tag="後端在這裡跑" />
        </div>
      </div>

      <p
        className="callout callout-info min-h-[3.2em] sm:min-h-[2.4em]"
        aria-live="polite"
        style={st ? { borderLeftColor: st.color } : undefined}
      >
        {st ? st.caption : "👉 按「播放」看看資料怎麼跑"}
      </p>

      <div className="flex gap-2.5 flex-wrap">
        <button type="button" className="btn btn-accent" onClick={play} disabled={playing}>
          {playing ? "播放中…" : stage === STAGES.length ? "↻ 再播一次" : "▶ 播放"}
        </button>
      </div>

      <div className="callout">
        所以「<b className="text-ink">部署（Deploy）</b>
        」就是：把你做好的網頁檔案（例如那頁活動公告），放到一台「一直開著、大家都連得到」的電腦（伺服器）上，市民才看得到。也因為是放到別人連得到的地方，
        <b className="text-ink">上傳前要先確認這份內容可以對外公開</b>。
      </div>
      <button type="button" className="btn btn-primary" onClick={onNext}>
        我懂了，下一步 →
      </button>
    </div>
  );
}

// 封包在上面跑的通道：軌道 + 方向箭頭 + 會移動的封包
function Lane({ st, pos, dur, vertical = false }) {
  const color = st?.color || "var(--muted)";
  const dir = st?.dir || null;
  // 兩端留白，封包才不會被切到
  const along = `calc(10% + ${pos} * 80%)`;
  const chev = dir ? (vertical ? (dir === "forward" ? "▼" : "▲") : dir === "forward" ? "▶" : "◀") : null;
  // 箭頭永遠照「實際行進方向」排列
  const chevs = [0, 1, 2, 3];

  return (
    <div className={`relative ${vertical ? "h-[96px] w-full" : "h-[92px]"}`}>
      {/* 方向說明 */}
      {st?.dirLabel && (
        <div
          className={`absolute z-[2] text-[11px] font-extrabold px-2 py-0.5 rounded-full border-2 whitespace-nowrap ${
            vertical ? "top-1/2 -translate-y-1/2 right-0" : "top-0 left-1/2 -translate-x-1/2"
          }`}
          style={{
            color,
            borderColor: color,
            background: "var(--surface)",
          }}
        >
          {st.dirLabel}
        </div>
      )}

      {/* 軌道 */}
      <div
        className={`absolute rounded-full ${
          vertical
            ? "top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5"
            : "left-0 right-0 top-1/2 -translate-y-1/2 h-1.5"
        }`}
        style={{ background: "var(--track)" }}
      />

      {/* 方向箭頭：沿著軌道流動 */}
      {chev && (
        <div
          className={`absolute flex ${
            vertical
              ? "top-0 bottom-0 left-1/2 -translate-x-1/2 flex-col justify-evenly items-center"
              : "left-0 right-0 top-1/2 -translate-y-1/2 justify-evenly items-center"
          } ${dir === "back" ? "flex-row-reverse" : ""} ${vertical && dir === "back" ? "flex-col-reverse" : ""}`}
          aria-hidden="true"
        >
          {chevs.map((i) => (
            <span
              key={i}
              className="text-[13px] leading-none animate-chev"
              style={{ color, animationDelay: i * 0.13 + "s" }}
            >
              {chev}
            </span>
          ))}
        </div>
      )}

      {/* 移動中的封包 */}
      {st?.packet && (
        <div
          className={`absolute z-[3] ${vertical ? "left-1/2 -translate-x-1/2 -translate-y-1/2" : "top-1/2 -translate-x-1/2 -translate-y-1/2"}`}
          style={{
            [vertical ? "top" : "left"]: along,
            transition: `${vertical ? "top" : "left"} ${dur}ms cubic-bezier(.4,0,.2,1)`,
          }}
        >
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border-2 whitespace-nowrap"
            style={{ borderColor: color, color, background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
          >
            <span className="text-sm" aria-hidden="true">
              {st.packet.icon}
            </span>
            {st.packet.label}
          </span>
        </div>
      )}
    </div>
  );
}

function Node({ emoji, label, sub, tag }) {
  return (
    <div
      className="text-center py-3 px-3 rounded-[18px] border-2 border-line bg-surface"
      style={{ boxShadow: "0 4px 0 var(--border)" }}
    >
      <span className="text-[38px] block leading-none">{emoji}</span>
      <div className="font-extrabold mt-1.5 text-[15px]">{label}</div>
      <div className="text-xs text-muted">{sub}</div>
      {tag && <div className="text-[11px] font-extrabold text-accentText mt-1 whitespace-nowrap">{tag}</div>}
    </div>
  );
}

/* =========================================================
   第二步：前端 vs 後端
   ========================================================= */

const SIDES = {
  front: { icon: "👀", name: "前端", sub: "市民看得到的", color: "var(--frontend-text)" },
  back: { icon: "🗄️", name: "後端", sub: "在伺服器裡做的", color: "var(--backend-text)" },
};

const PARTS = [
  {
    t: "講座公告的版面、文字和照片",
    a: "front",
    why: "市民眼睛看得到的畫面，都是前端。",
  },
  {
    t: "把市民填好的報名資料存起來",
    a: "back",
    why: "資料要留在伺服器上、之後還查得到，這是後端的工作。",
  },
  {
    t: "報名額滿時，把按鈕變成灰色不能按",
    a: "front",
    why: "改變畫面長相是前端。（但「還剩幾個名額」得先跟後端要）",
  },
  {
    t: "報名成功後，自動寄一封確認信給市民",
    a: "back",
    why: "寄信要有一台一直開著的電腦去執行，市民看不到這個過程。",
  },
  {
    t: "決定哪些承辦同仁才能看到報名名冊",
    a: "back",
    why: "權限控管一定要在後端。放在前端等於門沒鎖，打開原始碼就破解了。",
  },
  {
    t: "手機打開時，版面自動變成一欄",
    a: "front",
    why: "版面怎麼排是在市民自己的手機上算出來的，屬於前端。",
  },
];

function FrontBackStep({ onNext, navigate }) {
  const [ans, setAns] = useState({}); // { [index]: "front" | "back" }
  const done = PARTS.every((p, i) => ans[i] === p.a);

  const pick = (i, side) => {
    if (ans[i] === PARTS[i].a) return; // 已經答對就鎖住
    setAns((a) => ({ ...a, [i]: side }));
  };

  return (
    <div className="space-y-4">
      <Eyebrow>第三步 · 前端與後端</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">「前端」和「後端」，其實就是市府的前台和後台</h2>

      <div className="callout callout-info">
        剛剛那張圖的兩台電腦，各自負責不同的事。用你最熟的場景來想 ——
        <b className="text-ink">市民走進市民服務中心洽公</b>：
      </div>

      <SceneMap navigate={navigate} />

      <div className="grid gap-3 sm:grid-cols-2">
        <SideCard
          side="front"
          real="櫃台、指示牌、抽號碼機、申請表"
          web="畫面、文字、按鈕、表單長什麼樣"
          where="跑在「市民自己的手機或電腦」上"
        />
        <SideCard
          side="back"
          real="後面的辦公室：檔案庫、承辦科員、公文流程"
          web="存資料、算結果、寄通知、決定誰能看"
          where="跑在「一直開著的伺服器」上"
        />
      </div>

      <div>
        <h3 className="text-ink font-bold mb-1">換你分分看</h3>
        <p className="text-muted text-sm mb-3">
          假設你要做一個「市民健康講座線上報名」。下面每件事，是前端還是後端負責？（六題都答對才能繼續）
        </p>

        {/* 六題的示意圖。圖上的 ①~⑥ 跟下面六張卡片同順序、文字一字不差。
            圖檔沒放的話整塊不顯示，下面的題目本來就完整，不會開天窗。 */}
        <div className="mb-3">
          <ZoomFigure
            src={import.meta.env.BASE_URL + "images/frontback-signup.jpg"}
            alt="市民健康講座線上報名的前後端分工示意圖：左邊是市民看得到的畫面，右邊是伺服器在背後做的事，中間標示資料往返"
            caption="圖上的編號和下面六題一一對應"
          />
        </div>

        <div className="grid gap-2.5">
          {PARTS.map((p, i) => {
            const picked = ans[i];
            const ok = picked === p.a;
            const wrong = picked && !ok;
            return (
              <div
                key={p.t}
                data-fb-row={p.a}
                className="rounded-[16px] border-2 p-3 bg-surface"
                style={{
                  borderColor: ok ? "var(--mint)" : wrong ? "var(--danger)" : "var(--border)",
                  background: ok ? "var(--success-soft)" : wrong ? "var(--danger-soft)" : "var(--surface)",
                }}
              >
                <div className="flex gap-2.5 items-center flex-wrap">
                  <span className="text-[15px] text-ink font-semibold flex-1 min-w-[180px]">
                    {ok && <span className="font-extrabold text-success mr-1">✓</span>}
                    {wrong && <span className="font-extrabold text-danger mr-1">✗</span>}
                    {p.t}
                  </span>
                  <div className="flex gap-2">
                    {["front", "back"].map((s) => {
                      const sel = picked === s;
                      const on = sel && ok;
                      return (
                        <button
                          key={s}
                          type="button"
                          data-fb-pick={s}
                          disabled={ok}
                          onClick={() => pick(i, s)}
                          aria-pressed={sel}
                          className="px-3 py-1.5 rounded-full text-xs font-extrabold border-2 whitespace-nowrap transition-colors disabled:cursor-default"
                          style={
                            on
                              ? {
                                  borderColor: SIDES[s].color,
                                  background: `color-mix(in srgb, ${SIDES[s].color} 16%, var(--surface))`,
                                  color: SIDES[s].color,
                                }
                              : {
                                  borderColor: "var(--border)",
                                  background: "var(--surface)",
                                  color: "var(--muted)",
                                }
                          }
                        >
                          {SIDES[s].icon} {SIDES[s].name}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {ok && <div className="text-sm text-ink mt-2">{p.why}</div>}
                {wrong && (
                  <div className="text-sm text-danger font-bold mt-2">
                    再想想：這件事市民「看得到」，還是在後面「做掉」的？
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {done && (
        <>
          <div
            className="callout"
            style={{
              borderLeftColor: "var(--sun)",
              background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
            }}
          >
            <b className="text-ink">這件事會一路影響你後面的每一關：</b>
            <ul className="list-disc pl-5 mt-1.5 grid gap-1">
              <li>
                <b className="text-ink">只有前端的網站＝「靜態網站」</b>
                。它就是幾個檔案，誰來看都長一樣，最好部署、最便宜、幾乎不用顧 —— 下一關的 GitHub Pages
                就是專門放這種的。
              </li>
              <li>
                <b className="text-ink">一旦需要後端</b>
                （要存資料、要登入、要控管誰能看），就得有一台一直跑程式的伺服器。難度、費用、責任都跟著上來，
                也常常就是「該找資訊單位」的那條線。
              </li>
            </ul>
          </div>
          <button type="button" className="btn btn-primary" onClick={onNext}>
            六題都對了，下一步 →
          </button>
        </>
      )}
    </div>
  );
}

function SideCard({ side, real, web, where }) {
  const s = SIDES[side];
  return (
    <div
      className="rounded-[18px] border-2 p-4 bg-surface"
      style={{ borderColor: s.color, boxShadow: "0 4px 0 var(--border)" }}
    >
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl" aria-hidden="true">
          {s.icon}
        </span>
        <span className="font-extrabold text-lg" style={{ color: s.color }}>
          {s.name}
        </span>
        <span className="text-xs font-bold text-muted">{s.sub}</span>
      </div>
      <dl className="mt-2.5 grid gap-2 text-sm">
        <div>
          <dt className="text-xs font-extrabold text-muted">在市民服務中心</dt>
          <dd className="text-ink m-0">{real}</dd>
        </div>
        <div>
          <dt className="text-xs font-extrabold text-muted">在網站上</dt>
          <dd className="text-ink m-0">{web}</dd>
        </div>
        <div>
          <dt className="text-xs font-extrabold text-muted">程式在哪裡跑</dt>
          <dd className="text-ink m-0">{where}</dd>
        </div>
      </dl>
    </div>
  );
}

/* =========================================================
   第四步：把檔案放上伺服器
   ========================================================= */

function DeployStep({ onDone }) {
  const [picked, setPicked] = useState(false);
  const [over, setOver] = useState(false);
  const [filled, setFilled] = useState(false);

  const place = () => {
    if (filled) return;
    setFilled(true);
    setTimeout(onDone, 1100);
  };

  return (
    <div className="space-y-4">
      <Eyebrow>第五步 · 動手試試</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">把你的網頁「放上」伺服器</h2>
      <p className="text-muted text-sm">把 index.html 拖到伺服器上（手機可以用點的：先點檔案，再點伺服器）</p>

      <div className="text-center mb-1.5">
        {!filled && (
          <span
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", "file")}
            onClick={() => setPicked((p) => !p)}
            className={`inline-flex items-center gap-2 py-3 px-[18px] rounded-[14px] bg-surface border-2 font-bold cursor-grab select-none ${picked ? "border-accent animate-pulseRing" : "border-line"}`}
            style={{ boxShadow: "0 5px 0 var(--border)" }}
          >
            📄 index.html
          </span>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          place();
        }}
        onClick={() => {
          if (picked) place();
        }}
        className={`border-[3px] border-dashed rounded-[22px] p-6 text-center font-semibold transition-all
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
        {filled ? (
          <span>
            ✅ 上線了！你的活動公告頁現在在：
            <br />
            <code className="font-mono text-sm bg-surface2 px-1.5 py-0.5 rounded border border-line">
              https://你的機關.example.gov.tw/活動公告
            </code>
          </span>
        ) : (
          "🖥️  這是一台開著的伺服器 — 把檔案放進來"
        )}
      </div>
    </div>
  );
}
