import { useLayoutEffect, useRef, useState } from "react";

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
    real: "人一多就先抽號碼牌。櫃台只有那幾個，所以照順序放人進去，不會讓大家全擠在櫃台前。",
    tech: "這就是「排隊（Queue）」與流量管制：湧進來的比能處理的多，就先排成一列慢慢消化，而不是硬塞進去把櫃台（伺服器）壓垮。而且你抽完就能去坐著等，不必站著等到好。",
    term: "queue",
  },
  {
    id: "counter",
    x: 60,
    y: 38,
    icon: "🙋",
    side: "front",
    name: "一般櫃台",
    real: "民眾唯一看得到、摸得到的一面：承辦人員、申請表、指示牌。",
    tech: "這就是「前端」。畫面、文字、按鈕、表單長什麼樣，都在這一層。",
  },
  {
    id: "priority",
    x: 80,
    y: 52,
    icon: "👵",
    side: "back",
    name: "敬老／愛心櫃台",
    real: "不是每個人都能走這一條。要先確認身分（例如敬老卡），符合的人才用得到。",
    tech: "這是兩件事：先確認「你是誰」（登入），再決定「你能用什麼」（權限）。⚠️ 權限一定要由後端把關 —— 前端只把按鈕藏起來等於門沒鎖。",
    term: "authz",
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

        {/* 夠寬（lg 以上）才浮在圖上：圖再小的話高度不夠，說明框一定會蓋住標記本身 */}
        {spot && <Tip spot={spot} navigate={navigate} floating />}
      </div>

      <figcaption className="text-muted text-[13px] mt-2 text-center">
        把滑鼠移到圖上的 <b className="text-ink">5 個標記</b> 上（手機、平板直接點），
        看看現場的每個東西對應到網站的什麼。
      </figcaption>

      {/* lg 以下：說明放在圖的下面。浮動框在小螢幕會蓋住整張圖、也擠不出位置 */}
      <div className="lg:hidden mt-2.5">
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
  const ref = useRef(null);
  const [top, setTop] = useState(null);

  // 說明框的高度會隨文字長短改變，純用 CSS 的上／下錨定一定會有某個標記爆版
  //（實測敬老櫃台那個就超出圖的上緣 41px）。改成量完實際高度再決定放哪：
  // 先試標記上方，放不下就翻到下方，兩邊都不夠就貼齊邊界。
  useLayoutEffect(() => {
    if (!floating) return;
    const place = () => {
      const el = ref.current;
      const box = el?.offsetParent;
      if (!el || !box) return;
      const H = el.offsetHeight;
      const CH = box.clientHeight;
      const py = (spot.y / 100) * CH;
      // 標記本身（圓圈 30px + 箭頭 9px）就在目標點上方，要讓開它才不會蓋住編號
      let t = py - 48 - H; // 放上方
      if (t < 8) t = py + 14; // 放不下 → 翻到下方
      if (t + H > CH - 8) t = Math.max(8, CH - 8 - H); // 還是超出 → 貼齊
      setTop(t);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [spot.id, spot.y, floating]);

  const pos = floating
    ? {
        left: `clamp(8px, ${spot.x}%, calc(100% - 8px))`,
        top: top == null ? 0 : top,
        // 量好之前先不要露出來，免得閃一下
        opacity: top == null ? 0 : 1,
        transform: `translateX(${spot.x < 28 ? "-10%" : spot.x > 72 ? "-90%" : "-50%"})`,
        // 一定要給明確寬度：只設 left 的絕對定位元素會被右邊界擠成細長條，
        // transform 只是視覺位移，救不回已經算好的寬度。
        width: "min(320px, 80%)",
      }
    : undefined;

  return (
    <div
      ref={ref}
      role="status"
      className={
        floating
          ? "hidden lg:block absolute z-[4] rounded-[14px] border-2 p-3 pointer-events-none"
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
