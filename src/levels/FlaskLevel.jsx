import { useState } from "react";
import Level, { Eyebrow } from "../components/Level.jsx";
import Quiz from "../components/Quiz.jsx";
import { QUIZZES } from "../content/quizzes.js";
import { BADGES } from "../data/levels.js";
import { DONE } from "../content/levelCopy.js";

/* 這一關刻意排在自架之前：前面九關的後端都是「借別人的」，
   這裡第一次是你自己寫的，後面的自架／Docker 才有具體的對象可以放。

   重點不在 Flask 的語法，而在兩件同仁最常撞牆的事：
   ① 跑起來看到網址 ≠ 別人連得到（127.0.0.1 / 192.168 / 0.0.0.0 的差別）
   ② debug=True 那個很方便的錯誤頁，藏著可以執行指令的主控台 */

/* ---------- 模擬用的 app.py ---------- */
const BASE_CODE = [
  "from flask import Flask",
  "app = Flask(__name__)",
  "",
  '@app.route("/")',
  "def 首頁():",
  '    return "哈囉，這是我的第一個 Flask"',
  "",
  "app.run()",
];

const EXTRA_CODE = [
  "from flask import Flask",
  "app = Flask(__name__)",
  "",
  '@app.route("/")',
  "def 首頁():",
  '    return "哈囉，這是我的第一個 Flask"',
  "",
  '@app.route("/報表")',
  "def 報表():",
  "    筆數 = len(讀取今日案件())",
  '    return f"今天共 {筆數} 筆"',
  "",
  "app.run()",
];

const PATHS = [
  { path: "/", out: "哈囉，這是我的第一個 Flask", needExtra: false },
  { path: "/報表", out: "今天共 128 筆", needExtra: true },
  { path: "/統計", out: null, needExtra: false },
];

const BOOT = [
  " * Serving Flask app 'app'",
  " * Debug mode: off",
  " * Running on http://127.0.0.1:5000",
  "Press CTRL+C to quit",
];

/* ---------- 位址對照 ---------- */
const ADDRS = [
  {
    id: "loopback",
    addr: "127.0.0.1",
    alias: "也叫 localhost",
    mean: "「我自己這台」",
    who: "只有這台電腦。連你旁邊那一台都不行。",
    note: "每台電腦講 127.0.0.1，指的都是它自己 —— 所以這個網址傳給別人，對方的電腦只會去找它自己。",
    tone: "green",
  },
  {
    id: "lan",
    addr: "192.168.x.x",
    alias: "或 10.x.x.x、172.16~31.x.x",
    mean: "內網位址（私有位址）",
    who: "同一個網路裡的人 —— 大致就是同一間辦公室、同一個網段的同仁。",
    note: "這種位址在網際網路上不存在，全世界有無數台電腦都叫 192.168.1.50。你在家連不到辦公室那台。",
    tone: "yellow",
  },
  {
    id: "any",
    addr: "0.0.0.0",
    alias: "app.run(host=\"0.0.0.0\")",
    mean: "不是一個位址，是「所有網卡我都聽」",
    who: "取決於這台機器本來連得到誰 —— 在辦公室內網，就是內網的同仁。",
    note: "常被誤會成「公開到全世界」。它只是打開門，門外有誰是網路決定的。但也別小看：門確實開了。",
    tone: "yellow",
  },
  {
    id: "public",
    addr: "公開 IP／網域",
    alias: "例如 https://xxx.gov.tw",
    mean: "真的在網際網路上",
    who: "全世界。包含全世界的掃描機器人。",
    note: "走到這一步就是「對外服務」，不再是你自己的事 —— 這是納管的範圍，要找資訊單位。",
    tone: "red",
  },
];

const TONE = {
  green: { color: "var(--diy-green-text)", soft: "var(--success-soft)" },
  yellow: { color: "var(--diy-yellow-text)", soft: "color-mix(in srgb, var(--sun) 16%, var(--surface))" },
  red: { color: "var(--diy-red-text)", soft: "var(--danger-soft)" },
};

/* ---------- 「誰連得到？」練習 ---------- */
const REACH = [
  {
    id: "self",
    text: "你在自己的辦公電腦跑 app.run()，終端機印出 http://127.0.0.1:5000。你把這個網址用 LINE 傳給隔壁同事。",
    answer: "me",
    why: "同事打不開 —— 而且這是最常見的誤會。127.0.0.1 是「我自己這台」，他的瀏覽器會去找他自己的電腦，那上面根本沒有跑 Flask。",
  },
  {
    id: "office",
    text: "你改成 app.run(host=\"0.0.0.0\")，查到自己的內網位址是 192.168.1.50，傳 http://192.168.1.50:5000 給同一間辦公室的同事。",
    answer: "lan",
    why: "同事打得開。但你自己晚上回家、用家裡的網路打同一個網址，一樣打不開 —— 192.168 的位址只在那個內網裡有效。（而且你電腦一關機，同事就打不開了。）",
  },
  {
    // 跟上一題同一個網址、同一個答案 —— 這正是重點：換成給誰看，連得到的人並不會變。
    id: "citizen",
    text: "同樣是 http://192.168.1.50:5000，位址一個字都沒改，你把它貼在給市民的公告上。",
    answer: "lan",
    why: "答案跟上一題一模一樣，因為位址一個字都沒改 —— 能連得到的還是只有那間辦公室的人，市民打不開（幸好打不開）。市民的網路裡沒有這台機器；就算他們家裡剛好也有一台 192.168.1.50，那也是他們自己家的某台裝置。要真的對外，得有公開位址，而那是資訊單位的事。",
  },
  {
    id: "public",
    text: "資訊單位幫你把這個服務架到一台對外的主機上，有公開位址、網域和憑證。",
    answer: "world",
    why: "全世界都連得到 —— 包含全世界的掃描機器人，你上線幾分鐘內就會開始被敲門。這也是為什麼這一步不是自己按一按就好。",
  },
];

const RV = {
  me: { label: "只有我自己", color: "var(--diy-green-text)", soft: "var(--success-soft)" },
  lan: {
    label: "同辦公室的同仁",
    color: "var(--diy-yellow-text)",
    soft: "color-mix(in srgb, var(--sun) 16%, var(--surface))",
  },
  world: { label: "全世界", color: "var(--diy-red-text)", soft: "var(--danger-soft)" },
};

const CHECKLIST = [
  "跑起來之後，先問自己一句：這個網址現在「誰連得到」？",
  "只給自己用，就讓它留在 127.0.0.1 —— 這是最安全、也最常用的做法。",
  "要給同仁用之前，先問資訊單位：這台機器可以這樣開服務嗎？",
  "host 不是 127.0.0.1 的時候，debug 一律關掉。",
  "練習階段一律用假資料／去識別化資料，不要拿真的個資測。",
];

export default function FlaskLevel({ ctx }) {
  return (
    <Level
      ctx={ctx}
      badge={BADGES.flask}
      done={{ ...DONE.flask }}
      steps={[
        ({ next }) => <WhyStep onNext={next} />,
        ({ next }) => <SimStep onNext={next} />,
        ({ finish }) => <AddrStep onFinish={finish} />,
      ]}
    />
  );
}

/* ---------- 步驟 1：你的 .py 現在只有你能跑 ---------- */
function WhyStep({ onNext }) {
  const [web, setWeb] = useState(false);

  const steps = web
    ? ["你把網址給同仁", "同仁用瀏覽器打開"]
    : ["請同仁先裝 Python", "裝好套件", "開命令提示字元", "cd 到那個資料夾", "打 python 統計.py", "看終端機的輸出"];

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 1 / 3 · 這是什麼</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">你已經會寫 Python 了，差的只是一個網址 🐍</h2>

      <div className="callout callout-info">
        假設你寫好了一支 <code className="font-mono text-xs">統計.py</code>
        ，跑起來會算出今天的案件統計。現在科長說「這個很好用，讓大家都能用」——
        <b className="text-ink">問題就來了</b>。
      </div>

      <div className="border-2 border-line rounded-[18px] bg-surface2 p-4 space-y-3">
        <label className="flex items-center gap-2.5 text-sm font-bold cursor-pointer">
          <input
            type="checkbox"
            checked={web}
            onChange={(e) => setWeb(e.target.checked)}
            style={{ width: 20, height: 20, accentColor: "var(--mint)" }}
          />
          改用 Flask 包起來
        </label>

        <div className="text-xs font-extrabold text-muted">同仁要用到它，得經過幾步：</div>

        <ol className="m-0 pl-0 list-none space-y-1.5" data-usage>
          {steps.map((s, i) => (
            <li
              key={s}
              className="text-[13px] font-bold px-3 py-2 rounded-lg border-2 flex items-center gap-2"
              style={{
                borderColor: web ? "var(--mint)" : "var(--border)",
                background: web ? "color-mix(in srgb, var(--mint) 14%, var(--surface))" : "var(--surface)",
                color: "var(--ink)",
              }}
            >
              <span className="text-muted font-mono">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>

        <p className="text-sm text-muted m-0">
          {web ? (
            <>
              <b className="text-ink">兩步。</b>而且同仁的電腦上什麼都不用裝 ——
              Python 是在<b className="text-ink">你那台</b>跑的，他只是用瀏覽器看結果。
            </>
          ) : (
            <>
              六步，而且第一步就會卡住。<b className="text-ink">不是程式不好，是「給別人用」這件事沒做。</b>
              　這一整門課講的就是這件事。
            </>
          )}
        </p>
      </div>

      <div className="callout">
        <b className="text-ink">前面九關的後端，都是「借別人的」</b>
        <div className="mt-1.5 text-sm">
          第 7 關是 <b className="text-ink">Google 幫你跑</b>（GAS）、第 8 關是{" "}
          <b className="text-ink">Hugging Face 幫你跑模型</b>、第 9 關是{" "}
          <b className="text-ink">Google 幫你顧資料庫和登入</b>（Firebase）。
          好處是你不用管機器，壞處是能做什麼由平台決定。
        </div>
        <div className="mt-1.5 text-sm">
          這一關是第一次 <b className="text-ink">你自己寫一個後端</b>
          。想做什麼都可以 —— 代價是，機器、安全、更新，全部變成你的事。
        </div>
      </div>

      <div className="border-2 border-line rounded-[18px] bg-surface p-4 space-y-2">
        <div className="text-sm font-extrabold text-ink">最小的一支 Flask，就這幾行：</div>
        <pre className="font-mono text-xs bg-surface2 border-2 border-line rounded-[12px] p-3 overflow-x-auto m-0 text-ink">
          {BASE_CODE.join("\n")}
        </pre>
        <p className="text-sm text-muted m-0">
          真正的重點是{" "}
          <code className="font-mono text-xs text-ink">{'@app.route("/")'}</code> 這一行 —— 它是一張
          <b className="text-ink">「網址 → 哪一段 Python」的對應表</b>
          。有人打開這個網址，Flask 就去跑下面那個函式，把 return 的東西送回瀏覽器。
        </p>
        <p className="text-sm text-muted m-0">
          這跟第 6 關的 API 是同一件事，只是那時候你在<b className="text-ink">讀別人的</b>
          ，現在換你<b className="text-ink">做一個給別人讀</b>。
        </p>
      </div>

      <button type="button" className="btn btn-primary" onClick={onNext}>
        先在模擬介面跑一次 →
      </button>
    </div>
  );
}

/* ---------- 步驟 2：假終端機 + 假瀏覽器 ---------- */
function SimStep({ onNext }) {
  const [extra, setExtra] = useState(false);
  const [running, setRunning] = useState(false);
  const [path, setPath] = useState(null);
  const [visited, setVisited] = useState({});

  const code = extra ? EXTRA_CODE : BASE_CODE;
  const hit = PATHS.find((p) => p.path === path);
  // out 是 null 代表 app.py 裡根本沒有這個 route；needExtra 則是「勾了才有」
  const ok = hit && hit.out !== null && (!hit.needExtra || extra);
  const seen404 = visited["/統計"] || (visited["/報表"] && !extra);
  const done = visited["/"] && seen404 && extra && visited["/報表"];

  const open = (p) => {
    setPath(p);
    setVisited((s) => ({ ...s, [p]: true }));
  };

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 2 / 3 · 先在模擬介面練一次</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">跑起來，然後打開那個網址 ▶</h2>

      <p className="text-muted text-sm m-0">
        下面是假的終端機和假的瀏覽器，點壞了也不會怎樣。先按執行，再去點網址。
      </p>

      <div className="grid gap-3 lg:grid-cols-2 items-start">
        {/* 左：app.py */}
        <div className="border-2 border-line rounded-[18px] bg-surface p-3.5 space-y-2.5 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-extrabold text-ink font-mono">app.py</span>
            <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-muted">
              <input
                type="checkbox"
                checked={extra}
                onChange={(e) => {
                  setExtra(e.target.checked);
                  setPath(null);
                }}
                style={{ width: 16, height: 16, accentColor: "var(--mint)" }}
              />
              多加一個 /報表 的 route
            </label>
          </div>
          <pre
            data-code
            className="font-mono text-xs bg-surface2 border-2 border-line rounded-[12px] p-3 overflow-x-auto m-0 text-ink"
          >
            {code.join("\n")}
          </pre>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setRunning(true);
              setPath(null);
            }}
          >
            ▶ python app.py
          </button>
        </div>

        {/* 右：終端機 + 瀏覽器 */}
        <div className="space-y-3 min-w-0">
          <div className="border-2 border-line rounded-[18px] bg-surface2 p-3.5">
            <div className="text-xs font-extrabold text-muted mb-1.5">終端機</div>
            <pre data-term className="font-mono text-xs m-0 text-ink whitespace-pre-wrap break-words">
              {running ? BOOT.join("\n") : "（還沒執行）"}
            </pre>
          </div>

          {running && (
            <div className="border-2 border-line rounded-[18px] bg-surface overflow-hidden animate-pop">
              <div className="bg-surface2 border-b-2 border-line px-3 py-2 space-y-2">
                <div className="text-xs font-extrabold text-muted">瀏覽器 · 點一個網址試試</div>
                <div className="flex flex-wrap gap-1.5" data-urls>
                  {PATHS.map((p) => (
                    <button
                      key={p.path}
                      type="button"
                      className="gh-btn gh-btn-sm font-mono max-w-full break-all text-left"
                      style={
                        path === p.path
                          ? { borderColor: "var(--primary)", background: "var(--primary-soft)" }
                          : undefined
                      }
                      onClick={() => open(p.path)}
                    >
                      127.0.0.1:5000{p.path}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 min-h-[88px]" data-page>
                {!path ? (
                  <span className="text-muted text-sm">↑ 上面挑一個網址</span>
                ) : ok ? (
                  <div>
                    <div className="text-ink text-[15px]">{hit.out}</div>
                    <div className="text-muted text-xs mt-2">
                      這行字就是 <code className="font-mono">return</code> 回去的東西。
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-ink font-bold text-[15px]">Not Found</div>
                    <div className="text-muted text-sm mt-0.5">
                      The requested URL was not found on the server.
                    </div>
                    <div
                      className="mt-2.5 text-sm text-ink rounded-[10px] p-2.5"
                      style={{ background: "color-mix(in srgb, var(--sun) 16%, var(--surface))" }}
                    >
                      <b>這不是壞掉，是 404。</b>
                      意思是「你要的這個網址，我的 app.py 裡沒有對應的 route」。
                      {hit?.needExtra && !extra && <>　把左邊那個勾勾打開，再點一次這個網址。</>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {running && (
        <div className="callout">
          <b className="text-ink">注意終端機印出來的那一行：</b>
          <code className="font-mono text-xs text-ink">　Running on http://127.0.0.1:5000</code>
          <div className="mt-1.5 text-sm">
            這是整關最重要的一行字，也是最容易誤會的一行 ——
            <b className="text-ink">看到網址，不代表別人連得到</b>。下一步專門講這件事。
          </div>
        </div>
      )}

      <div className="callout callout-info">
        <b className="text-ink">順帶一提：</b>
        真的要動手時，在自己電腦上就是三行指令 ——{" "}
        <code className="font-mono text-xs text-ink">pip install flask</code>、把上面那段存成{" "}
        <code className="font-mono text-xs text-ink">app.py</code>、
        <code className="font-mono text-xs text-ink">python app.py</code>。 Flask
        不用註冊、不用帳號、不連任何雲端服務，整件事都發生在你自己的電腦裡。
      </div>

      <button type="button" className="btn btn-primary" onClick={onNext} disabled={!running}>
        {running
          ? done
            ? "看懂了，下一步講「誰連得到」 →"
            : "下一步：這個網址誰連得到？ →"
          : "先按上面的 ▶ 執行"}
      </button>
    </div>
  );
}

/* ---------- 步驟 3：位址、debug，以及界線 ---------- */
function AddrStep({ onFinish }) {
  const [openAddr, setOpenAddr] = useState(null);
  const [picked, setPicked] = useState({});
  const [checked, setChecked] = useState({});
  const [passed, setPassed] = useState(false);

  const answered = REACH.filter((c) => picked[c.id]).length;
  const allChecked = CHECKLIST.every((_, i) => checked[i]);

  return (
    <div className="space-y-4">
      <Eyebrow>步驟 3 / 3 · 真的動手之前</Eyebrow>
      <h2 className="text-2xl font-bold text-ink">這個網址，到底誰連得到？ 🌐</h2>

      <div
        className="callout"
        style={{
          borderLeftColor: "var(--sun)",
          background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
        }}
      >
        <b className="text-ink">「我明明看到網址了，為什麼同事打不開？」</b>
        <div className="mt-1.5">
          這是初學者最常卡住的一題。原因是：
          <b className="text-ink">有些位址看起來像網址，但它指的是「這台電腦自己」或「這間辦公室裡面」</b>
          ，外面的人根本走不進來。四種位址一次分清楚。
        </div>
      </div>

      {/* 位址對照 */}
      <div className="grid gap-2.5" data-addrs>
        {ADDRS.map((a) => {
          const on = openAddr === a.id;
          return (
            <div key={a.id} data-addr={a.id} className="border-2 border-line rounded-[14px] bg-surface overflow-hidden">
              <button
                type="button"
                className="w-full text-left p-3.5 flex items-start justify-between gap-3"
                onClick={() => setOpenAddr(on ? null : a.id)}
              >
                <span className="min-w-0">
                  <span className="font-mono font-bold text-ink text-[15px] break-words">{a.addr}</span>
                  <span className="text-muted text-xs ml-2">{a.alias}</span>
                  <span className="block text-sm text-ink mt-1">{a.mean}</span>
                </span>
                <span className="text-muted text-xs whitespace-nowrap mt-1">{on ? "收合 ▲" : "展開 ▼"}</span>
              </button>
              {on && (
                <div className="px-3.5 pb-3.5 space-y-2 animate-pop">
                  <div
                    className="rounded-[10px] px-3 py-2 text-sm"
                    style={{ background: TONE[a.tone].soft }}
                  >
                    <b style={{ color: TONE[a.tone].color }}>誰連得到：</b>
                    <span className="text-ink">　{a.who}</span>
                  </div>
                  <p className="text-sm text-muted m-0">{a.note}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Port：位址只答了一半，另一半是門有沒有開 */}
      <div className="border-2 border-line rounded-[18px] bg-surface p-4 space-y-2" data-port>
        <div className="text-sm font-extrabold text-ink">
          🔌 那位址後面的 <code className="font-mono">:5000</code> 又是什麼？
        </div>
        <p className="text-sm text-ink m-0">
          位址是<b>「哪一台機器」</b>，port（埠號）是<b>「那台機器上的哪一個服務」</b>
          。 一台機器可以同時跑很多個服務，靠號碼分開 —— 像大樓地址之後還要轉分機。
        </p>
        <p className="text-sm text-muted m-0">
          你平常上網的網址看不到 port，是因為 http 預設 80、https 預設 443，
          <b className="text-ink">瀏覽器自動幫你補上了</b>；Flask 的 5000 不是預設值，所以要寫出來。
        </p>
        <div className="text-sm text-ink">
          跑起來如果噴 <code className="font-mono text-xs">Address already in use</code>，代表這個號碼已經有人在用
          （5000 在 Mac 上常被系統佔走）。這不是壞掉，
          <code className="font-mono text-xs">app.run(port=5001)</code> 換一個號碼就好。
        </div>
        <div
          className="rounded-[10px] px-3 py-2.5 text-sm text-ink"
          style={{ background: "color-mix(in srgb, var(--sun) 16%, var(--surface))" }}
        >
          <b>⚠️ 位址對了還不夠 —— 這是「同事還是連不到」的第二個原因。</b>
          <div className="mt-1">
            <code className="font-mono text-xs">host=&quot;0.0.0.0&quot;</code>{" "}
            只是<b>你的程式願意聽</b>，機器的<b>防火牆</b>預設還是會擋掉外來連線，要放行 5000 這個號碼才通得了。
            而在市府的機器上，<b>這件事通常不是你自己能決定的</b> —— 要問資訊單位。
          </div>
          <div className="mt-1.5">
            所以連不到時，兩個原因要分開查：<b className="text-ink">位址錯＝找錯機器；port 沒開＝找對機器但門關著。</b>
          </div>
        </div>
      </div>

      {/* 誰連得到 練習 */}
      <div className="border-2 border-line rounded-[18px] bg-surface2 p-4 space-y-3">
        <div className="text-sm font-extrabold text-ink">🧪 練習：這四種情況，誰連得到？</div>
        <div className="grid gap-2.5">
          {REACH.map((c) => {
            const my = picked[c.id];
            const right = my === c.answer;
            return (
              <div key={c.id} data-reach={c.id} className="border-2 border-line rounded-[14px] bg-surface p-3.5">
                <p className="text-[15px] text-ink m-0 mb-2.5">{c.text}</p>
                {!my ? (
                  <div className="flex flex-wrap gap-2">
                    {["me", "lan", "world"].map((v) => (
                      <button
                        key={v}
                        type="button"
                        className="gh-btn gh-btn-sm"
                        onClick={() => setPicked((s) => ({ ...s, [c.id]: v }))}
                      >
                        {RV[v].label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    className="rounded-[12px] p-3 border-2"
                    style={{ borderColor: "var(--border)", background: RV[c.answer].soft }}
                  >
                    <div className="text-sm font-extrabold mb-1" style={{ color: RV[c.answer].color }}>
                      {right ? "判斷正確 —— " : "正解是 —— "}
                      {RV[c.answer].label}
                    </div>
                    <p className="text-sm text-ink m-0">{c.why}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {answered === REACH.length && (
          <p className="text-sm text-muted m-0">
            一句話記住：
            <b className="text-ink">
              位址決定「誰走得進來」，而不是「你看不看得到那串字」。
            </b>
            　你螢幕上那個網址，通常只對你自己有意義。
          </p>
        )}
      </div>

      {/* debug=True */}
      <div
        className="callout"
        style={{
          borderLeftColor: "var(--danger)",
          background: "color-mix(in srgb, var(--danger) 8%, var(--surface))",
        }}
      >
        <b className="text-ink">⚠️ 網路上的 Flask 教學幾乎都寫 debug=True —— 但它不能跟著上線</b>
        <div className="mt-1.5 text-sm">
          <code className="font-mono text-xs text-ink">app.run(debug=True)</code>{" "}
          很好用：程式出錯時，瀏覽器會直接顯示錯在哪一行，連改完自動重啟都有。開發時確實該開。
        </div>
        <div className="mt-1.5 text-sm">
          但那個錯誤頁上有一個<b className="text-ink">互動式除錯主控台</b>
          ，可以在上面直接執行 Python 指令。也就是說，
          <b className="text-ink">任何打得開這個網址的人，等於拿到了那台電腦的操作權</b>
          。新版 Flask 會要求一組 PIN（印在你的終端機上）， 但那是拖延，不是防護。
        </div>
        <div className="mt-1.5 text-sm">
          <b className="text-ink">規則很簡單：host 不是 127.0.0.1 的時候，debug 一律關掉。</b>
        </div>
      </div>

      {/* 三條路 */}
      <div className="border-2 border-line rounded-[18px] bg-surface p-4 space-y-2.5">
        <div className="text-sm font-extrabold text-ink">寫好之後，這個東西放哪裡跑？三條路</div>
        <div className="text-sm text-ink">
          <b>① 只給自己用</b> —— 就留在 <code className="font-mono text-xs">127.0.0.1</code>
          。把一支已經在跑的 Python 腳本變成有介面的小工具，這是最安全、也最常用的做法，
          <b>而且完全在你自己的權限範圍內</b>。
        </div>
        <div className="text-sm text-ink">
          <b>② 給科內同仁用</b> —— 需要一台一直開著的機器（下一關），或把環境一起打包（第 12 關）。
          動手之前<b>先問資訊單位：這台機器可以這樣開服務嗎？</b>
        </div>
        <div className="text-sm text-ink">
          <b>③ 對外給市民用</b> —— 停。這是納管的範圍，交資訊單位。
          你這一關學到的東西不會白費，它讓你在跟資訊單位討論時知道對方在講什麼。
        </div>
      </div>

      {/* 檢查清單 */}
      <div className="border-2 border-line rounded-[18px] bg-surface2 p-4 space-y-2">
        <div className="text-sm font-extrabold text-ink">✅ 動手前的檢查清單</div>
        {CHECKLIST.map((t, i) => (
          <label key={i} className="flex items-start gap-2.5 text-sm text-ink cursor-pointer">
            <input
              type="checkbox"
              checked={!!checked[i]}
              onChange={(e) => setChecked((s) => ({ ...s, [i]: e.target.checked }))}
              style={{ width: 18, height: 18, accentColor: "var(--mint)", marginTop: 2, flexShrink: 0 }}
            />
            <span>{t}</span>
          </label>
        ))}
      </div>

      <hr className="border-0 border-t border-line my-2" />

      <Quiz {...QUIZZES.flask} onCorrect={() => setPassed(true)} />

      <button
        type="button"
        className="btn btn-primary"
        disabled={!passed || !allChecked || answered < REACH.length}
        onClick={onFinish}
      >
        {answered < REACH.length
          ? "先把上面四題「誰連得到」做完"
          : !allChecked
            ? "再勾完檢查清單"
            : "完成這一關 🎉"}
      </button>
    </div>
  );
}
