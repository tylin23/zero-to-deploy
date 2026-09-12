import { useRef, useState } from "react";
import Level, { Eyebrow } from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function IntroLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.concept}
      done={DONE.intro}
      steps={[
        ({ next }) => <ConceptStep onNext={next} />,
        ({ next }) => <FrontBackStep onNext={next} />,
        ({ next }) => (
          <div className="space-y-4">
            <Eyebrow>第三步 · 檢查一下</Eyebrow>
            <Quiz {...QUIZZES.intro} onCorrect={() => setTimeout(next, 1200)} />
          </div>
        ),
        ({ finish }) => <DeployStep onDone={finish} />,
      ]}
    />
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
    caption: "① 民眾的瀏覽器送出請求：「我要看『里民活動公告』這一頁」",
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
    caption: "③ 瀏覽器把收到的檔案「畫」成畫面 → 民眾就看到你的活動公告了 🎉",
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
      <Eyebrow>第一步 · 概念</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">民眾打開你做的「活動公告頁」時，發生了什麼事？</h2>
      <p className="text-muted text-sm">
        情境：你想把一頁「里民活動公告」放上網，讓民眾查得到。按「播放」看一次「瀏覽器 ↔ 伺服器」的對話，
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
          <Node emoji="💻" label="你的瀏覽器" sub="民眾的手機或電腦" tag="前端在這裡跑" />
          <Lane st={st} pos={pos} dur={dur} />
          <Node emoji="🖥️" label="伺服器" sub="一直開著的電腦" tag="後端在這裡跑" />
        </div>
        {/* 手機：上下堆疊，通道也轉成直的 */}
        <div className="sm:hidden grid gap-1">
          <Node emoji="💻" label="你的瀏覽器" sub="民眾的手機或電腦" tag="前端在這裡跑" />
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
        」就是：把你做好的網頁檔案（例如那頁活動公告），放到一台「一直開著、大家都連得到」的電腦（伺服器）上，民眾才看得到。也因為是放到別人連得到的地方，
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
  front: { icon: "👀", name: "前端", sub: "民眾看得到的", color: "var(--frontend-text)" },
  back: { icon: "🗄️", name: "後端", sub: "在伺服器裡做的", color: "var(--backend-text)" },
};

const PARTS = [
  {
    t: "活動公告的版面、文字和照片",
    a: "front",
    why: "民眾眼睛看得到的畫面，都是前端。",
  },
  {
    t: "把民眾填好的報名資料存起來",
    a: "back",
    why: "資料要留在伺服器上、之後還查得到，這是後端的工作。",
  },
  {
    t: "報名額滿時，把按鈕變成灰色不能按",
    a: "front",
    why: "改變畫面長相是前端。（但「還剩幾個名額」得先跟後端要）",
  },
  {
    t: "報名成功後，自動寄一封確認信給民眾",
    a: "back",
    why: "寄信要有一台一直開著的電腦去執行，民眾看不到這個過程。",
  },
  {
    t: "決定哪些同仁才能看到報名名冊",
    a: "back",
    why: "權限控管一定要在後端。放在前端等於門沒鎖，打開原始碼就破解了。",
  },
  {
    t: "手機打開時，版面自動變成一欄",
    a: "front",
    why: "版面怎麼排是在民眾自己的手機上算出來的，屬於前端。",
  },
];

function FrontBackStep({ onNext }) {
  const [ans, setAns] = useState({}); // { [index]: "front" | "back" }
  const done = PARTS.every((p, i) => ans[i] === p.a);

  const pick = (i, side) => {
    if (ans[i] === PARTS[i].a) return; // 已經答對就鎖住
    setAns((a) => ({ ...a, [i]: side }));
  };

  return (
    <div className="space-y-4">
      <Eyebrow>第二步 · 前端與後端</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">「前端」和「後端」，其實就是公所的前台和後台</h2>

      <div className="callout callout-info">
        剛剛那張圖的兩台電腦，各自負責不同的事。用你最熟的場景來想 ——
        <b className="text-ink">民眾走進區公所辦事</b>：
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SideCard
          side="front"
          real="櫃台、指示牌、抽號碼機、申請表"
          web="畫面、文字、按鈕、表單長什麼樣"
          where="跑在「民眾自己的手機或電腦」上"
        />
        <SideCard
          side="back"
          real="後面的辦公室：檔案庫、承辦人、公文流程"
          web="存資料、算結果、寄通知、決定誰能看"
          where="跑在「一直開著的伺服器」上"
        />
      </div>

      <div>
        <h3 className="text-ink font-bold mb-1">換你分分看</h3>
        <p className="text-muted text-sm mb-3">
          假設你要做一個「里民活動線上報名」。下面每件事，是前端還是後端負責？（六題都答對才能繼續）
        </p>

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
                    再想想：這件事民眾「看得到」，還是在後面「做掉」的？
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
          <dt className="text-xs font-extrabold text-muted">在區公所</dt>
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
      <Eyebrow>第四步 · 動手試試</Eyebrow>
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
