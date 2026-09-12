import { useState } from "react";

/**
 * 市民服務中心場景圖：圖上有幾個往下指的標記，滑鼠移上去／點一下／用鍵盤 Tab 到，
 * 就會說明「現場這個東西」對應到「網站的哪個概念」。
 *
 * 圖檔放在 public/images/ 底下，用 BASE_URL 組網址，子路徑託管（/zero-to-deploy/）才不會 404。
 * 圖若載不到就整塊不顯示，下面的文字卡片本來就講得完整，不會開天窗。
 */
const SRC = import.meta.env.BASE_URL + "images/service-center.jpg";

// x / y 是標記「指到的那個點」在圖上的百分比位置
const SPOTS = [
  {
    id: "door",
    x: 6,
    y: 24,
    icon: "🚪",
    side: "front",
    name: "入口大門",
    real: "民眾要先找得到門、而且門開著，才進得來。",
    tech: "這就是「網址」。你的東西做得再好，沒有一個大家到得了的網址（https://…），等於門鎖著 —— 這也正是第 1 步在講的 file:// 和 https:// 的差別。",
  },
  {
    id: "kiosk",
    x: 12,
    y: 54,
    icon: "🎫",
    side: "back",
    name: "抽號碼機",
    real: "抽一張號碼牌，系統記下你的順序，再照順序一個一個叫號。",
    tech: "這就是「佇列（Queue）」。要一次寄幾千封市民通知、或產一大批月報表時，也是把任務排成一列，背景一個一個處理，才不會一次塞爆。",
    term: "queue",
  },
  {
    id: "phone",
    x: 30,
    y: 75,
    icon: "📱",
    side: "front",
    name: "民眾手上的手機",
    real: "同一件事，有人到現場辦，也有人直接用手機辦。",
    tech: "所以同一個網站，電腦和手機都要能看。版面怎麼排，是在市民自己的裝置上算出來的 —— 那是前端的工作。",
  },
  {
    id: "seats",
    x: 42,
    y: 86,
    icon: "🪑",
    side: null,
    name: "等候區座椅",
    real: "抽完號碼就可以去坐著，不必站在櫃台前等到好。",
    tech: "這叫「非同步」。系統先回你一句「收到了，案號 ○○○」，真正的處理在背景做完再通知你 —— 使用者才不會覺得整個卡住。",
    term: "queue",
  },
  {
    id: "counter",
    x: 60,
    y: 38,
    icon: "🙋",
    side: "front",
    name: "櫃台",
    real: "民眾唯一看得到、摸得到的一面：承辦人員、申請表、指示牌。",
    tech: "這就是「前端」。畫面、文字、按鈕、表單長什麼樣，都在這一層。",
  },
  {
    id: "archive",
    x: 92,
    y: 21,
    icon: "🗄️",
    side: "back",
    name: "後方辦公區與檔案櫃",
    real: "隔著玻璃的後面：資料真正存放在這裡，公文在這裡跑流程。",
    tech: "這就是「後端」。存資料、算結果、寄通知、決定誰能看 —— 民眾一眼都看不到，但沒有它什麼都留不下來。",
  },
];

const SIDE_LABEL = {
  front: { text: "前端", color: "var(--frontend-text)" },
  back: { text: "後端", color: "var(--backend-text)" },
};

export default function SceneMap({ navigate }) {
  // hover 是滑過去的暫時預覽，pin 是點下去釘住的。
  // 只靠 hover 的話，手機點完一捲動就會收到 mouseleave、說明直接消失。
  const [hover, setHover] = useState(null);
  const [pin, setPin] = useState(null);
  const [broken, setBroken] = useState(false);
  if (broken) return null;

  const active = hover ?? pin;
  const spot = SPOTS.find((s) => s.id === active) || null;

  // 觸控裝置點過之後 hover 會一直黏著，所以取消釘選時要把它一起清掉，
  // 不然「再點一次收起來」不會有反應。
  const togglePin = (id) => {
    const off = pin === id;
    setPin(off ? null : id);
    if (off) setHover(null);
  };

  return (
    <figure className="m-0">
      <div
        className="relative rounded-[18px] border-2 border-line overflow-hidden bg-surface2"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <img
          src={SRC}
          onError={() => setBroken(true)}
          alt="市民服務中心的大廳：左邊是入口玻璃門和抽號碼機，中間一排櫃台有承辦人員在為民眾服務，前方是等候區座椅，右後方隔著玻璃是辦公區與檔案櫃。"
          className="block w-full h-auto"
          style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
          loading="lazy"
        />

        {SPOTS.map((s, i) => (
          <Marker
            key={s.id}
            s={s}
            n={i + 1}
            active={active === s.id}
            onEnter={() => setHover(s.id)}
            onLeave={() => setHover((h) => (h === s.id ? null : h))}
            onPin={() => togglePin(s.id)}
          />
        ))}

        {/* 桌機：浮在圖上的說明框 */}
        {spot && <Tip spot={spot} navigate={navigate} floating />}
      </div>

      <figcaption className="text-muted text-[13px] mt-2 text-center">
        把滑鼠移到圖上的 <b className="text-ink">6 個標記</b> 上（手機直接點），
        看看現場的每個東西對應到網站的什麼。
      </figcaption>

      {/* 手機：說明改放在圖的下面，浮動框在小螢幕會蓋住整張圖 */}
      <div className="sm:hidden mt-2.5">
        {spot ? (
          <Tip spot={spot} navigate={navigate} />
        ) : (
          <div className="rounded-[14px] border-2 border-dashed border-line p-3.5 text-center text-muted text-sm">
            👆 點圖上的標記看說明
          </div>
        )}
      </div>
    </figure>
  );
}

function Marker({ s, n, active, onEnter, onLeave, onPin }) {
  return (
    <button
      type="button"
      // 整個標記放在目標點的「上方」，底下的箭頭尖端剛好指到那個點
      className="absolute z-[3] flex flex-col items-center"
      style={{ left: s.x + "%", top: s.y + "%", transform: "translate(-50%, -100%)" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onPin}
      aria-label={`${s.name}：${s.real}`}
      aria-expanded={active}
    >
      <span
        className="grid place-items-center rounded-full text-white font-extrabold border-2 border-white transition-transform"
        style={{
          width: 30,
          height: 30,
          fontSize: 13,
          background: "var(--btn-primary-bg)",
          boxShadow: "0 2px 8px rgba(0,0,0,.35)",
          transform: active ? "scale(1.25)" : "scale(1)",
        }}
      >
        {n}
      </span>
      {/* 向下的箭頭 */}
      <span
        aria-hidden="true"
        className="block"
        style={{
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "9px solid var(--btn-primary-bg)",
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,.35))",
          marginTop: -1,
        }}
      />
    </button>
  );
}

function Tip({ spot, navigate, floating = false }) {
  const side = spot.side ? SIDE_LABEL[spot.side] : null;
  // 浮動版：圖上方三分之一的標記，說明框改放到下面，才不會超出圖外
  const below = spot.y < 40;
  const pos = floating
    ? {
        left: `clamp(8px, ${spot.x}%, calc(100% - 8px))`,
        [below ? "top" : "bottom"]: below ? `calc(${spot.y}% + 14px)` : `calc(${100 - spot.y}% + 26px)`,
        transform: `translateX(${spot.x < 28 ? "-10%" : spot.x > 72 ? "-90%" : "-50%"})`,
        // 一定要給明確寬度：只設 left 的絕對定位元素會被右邊界擠成細長條，
        // transform 只是視覺位移，救不回已經算好的寬度。
        width: "min(300px, 78%)",
      }
    : undefined;

  return (
    <div
      role="status"
      className={
        floating
          ? "hidden sm:block absolute z-[4] rounded-[14px] border-2 p-3 pointer-events-none"
          : "rounded-[14px] border-2 p-3"
      }
      style={{
        ...pos,
        borderColor: "var(--primary)",
        background: "var(--surface)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex items-center gap-1.5 flex-wrap mb-1">
        <span className="text-lg" aria-hidden="true">
          {spot.icon}
        </span>
        <span className="font-extrabold text-ink text-sm">{spot.name}</span>
        {side && (
          <span
            className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-full border"
            style={{ color: side.color, borderColor: side.color }}
          >
            {side.text}
          </span>
        )}
      </div>
      <p className="text-[13px] text-muted m-0">{spot.real}</p>
      <p className="text-[13px] text-ink mt-1.5 mb-0">{spot.tech}</p>
      {spot.term && !floating && (
        <button
          type="button"
          onClick={() => navigate("#/terms/" + spot.term)}
          className="gh-btn gh-btn-sm mt-2"
        >
          📇 看名詞小教室
        </button>
      )}
    </div>
  );
}
