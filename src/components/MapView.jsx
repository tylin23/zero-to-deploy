import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "../state/progress.jsx";
import { mapOrder, PHASES } from "../data/levels.js";

// 沿曲線把各節點中心連起來
function buildPath(list) {
  if (list.length < 2) return "";
  let d = `M ${list[0].x} ${list[0].y}`;
  for (let i = 1; i < list.length; i++) {
    const p0 = list[i - 1], p1 = list[i];
    const my = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${my}, ${p1.x} ${my}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function MapView({ navigate }) {
  const { completed, isComplete, badges } = useProgress();
  const trailRef = useRef(null);
  const [w, setW] = useState(0);

  // 量測容器寬度，並在視窗改變大小時重新計算
  useLayoutEffect(() => {
    const el = trailRef.current;
    if (!el) return;
    const measure = () => setW(el.clientWidth || 0);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const currentId = mapOrder.find((l) => l.status === "ready" && !isComplete(l.id))?.id;

  // 回訪者：載入後自動捲到「目前這關」，不用自己找
  const scrolled = useRef(false);
  useEffect(() => {
    if (scrolled.current || !w || !currentId) return;
    const idx = mapOrder.findIndex((l) => l.id === currentId);
    if (idx <= 0) { scrolled.current = true; return; }
    const el = trailRef.current?.querySelector(`[data-node="${currentId}"]`);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); scrolled.current = true; }
  }, [w, currentId]);

  const layout = useMemo(() => {
    const W = w || 520;
    const n = mapOrder.length;
    const gap = 158; // 需容納「上一關標籤」與「目前關卡標記」不打架
    const padTop = 78, padBottom = 96;
    const amp = Math.min(W * 0.3, 150);
    const cx = W / 2;
    const DIV_GAP = 104; // 「交給資訊單位納管」分界關口的額外空間

    let extra = 0, dividerY = null;
    const pts = [];
    mapOrder.forEach((l, i) => {
      if (i > 0 && mapOrder[i - 1].phase === "pre" && l.phase === "post") {
        const yPrev = padTop + (i - 1) * gap + extra;
        extra += DIV_GAP;
        dividerY = (yPrev + padTop + i * gap + extra) / 2;
      }
      pts.push({ x: cx + amp * Math.sin(i * 0.95 + 0.4), y: padTop + i * gap + extra });
    });

    const height = padTop + (n - 1) * gap + extra + padBottom;
    let lastDone = -1;
    mapOrder.forEach((l, i) => { if (isComplete(l.id)) lastDone = i; });
    return {
      W, height, pts, dividerY,
      base: buildPath(pts),
      done: lastDone >= 1 ? buildPath(pts.slice(0, lastDone + 1)) : "",
      finish: { x: cx, y: padTop + (n - 1) * gap + extra + 60 },
    };
    // completed 變動時要重畫進度線
  }, [w, completed]); // eslint-disable-line react-hooks/exhaustive-deps

  const badgeList = Object.values(badges);

  return (
    <div>
      <div className="text-center mb-2">
        <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">部署地圖</span>
        <h1 className="text-[clamp(26px,5vw,38px)] font-bold text-ink">沿著路徑闖關 🗺️</h1>
        <p className="text-muted text-sm">從「自己動手」一路走到「交接納管」。<b className="text-ink">前段你能自己做</b>，後段是交給資訊單位時要聽得懂的事。</p>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <button type="button" onClick={() => navigate("#/guide")} className="btn btn-ghost !py-2 !px-4 !text-sm">🧭 選型指南</button>
          <button type="button" onClick={() => navigate("#/terms")} className="btn btn-ghost !py-2 !px-4 !text-sm">📇 名詞小教室</button>
        </div>
      </div>

      <div className="text-center mb-1">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border-2 border-line bg-surface text-ink">
          {PHASES.pre.icon} {PHASES.pre.label}
        </span>
      </div>

      <div ref={trailRef} data-testid="trail" className="relative mx-auto max-w-[560px]" style={{ height: layout.height }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          viewBox={`0 0 ${layout.W} ${layout.height}`} preserveAspectRatio="none">
          <path d={layout.base} fill="none" stroke="var(--track)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          {layout.done && <path d={layout.done} fill="none" stroke="var(--mint)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />}
          <path d={layout.base} fill="none" stroke="color-mix(in srgb, var(--surface) 70%, transparent)" strokeWidth="4" strokeDasharray="2 16" strokeLinecap="round" />
        </svg>

        {layout.dividerY != null && (
          <div data-testid="phase-divider" className="absolute left-0 right-0 -translate-y-1/2 pointer-events-none px-1" style={{ top: layout.dividerY }}>
            <div className="flex items-center gap-2">
              <span className="flex-1 border-t-2 border-dashed" style={{ borderColor: "var(--border)" }} />
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold border-2 whitespace-nowrap"
                style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--ink)", boxShadow: "var(--shadow-sm)" }}>
                {PHASES.post.icon} 交給資訊單位納管
              </span>
              <span className="flex-1 border-t-2 border-dashed" style={{ borderColor: "var(--border)" }} />
            </div>
            <div className="text-center text-[11px] text-muted mt-1.5">↓ 以下偏正式系統，多由資訊單位處理，了解即可</div>
          </div>
        )}

        {mapOrder.map((lv, i) => (
          <TrailNode key={lv.id} lv={lv} index={i} pos={layout.pts[i]}
            done={isComplete(lv.id)} current={lv.id === currentId} navigate={navigate} />
        ))}

        <div className="absolute -translate-x-1/2 text-center" style={{ left: layout.finish.x, top: layout.finish.y }}>
          <div className="text-[46px]" style={{ filter: "drop-shadow(0 4px 4px rgba(0,0,0,.15))" }}>🏆</div>
          <div className="font-bold text-[13px] text-muted">全部部署技能達成！</div>
        </div>
      </div>

      {badgeList.length > 0 && (
        <div className="card mt-8 space-y-4">
          <h3 className="text-ink">🏅 我的徽章</h3>
          <div className="flex gap-3.5 flex-wrap">
            {badgeList.map((b) => (
              <div key={b.id} className="inline-flex flex-col items-center gap-1 py-4 px-6 rounded-[22px] border-2 border-line"
                style={{ background: "linear-gradient(150deg, var(--accent-soft), var(--primary-soft))", boxShadow: "0 6px 0 var(--border)" }}>
                <span className="text-[46px]">{b.icon}</span>
                <span className="font-extrabold text-base text-ink">{b.name}</span>
                <span className="text-xs text-muted">{b.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TrailNode({ lv, index, pos, done, current, navigate }) {
  const locked = lv.status !== "ready";

  let circle;
  if (locked) circle = { background: "var(--surface-2)", boxShadow: "0 8px 0 var(--border), var(--shadow-sm)", filter: "grayscale(.5)", opacity: 0.8, cursor: "not-allowed" };
  else if (done) circle = { background: "linear-gradient(160deg, var(--mint), var(--mint-dark))", boxShadow: "0 8px 0 var(--mint-dark), var(--shadow-sm)" };
  else if (current) circle = { background: "linear-gradient(160deg, var(--accent), var(--accent-dark))", boxShadow: "0 8px 0 var(--accent-dark), var(--shadow)" };
  else circle = { background: "linear-gradient(160deg, var(--surface), var(--primary-soft))", boxShadow: "0 8px 0 color-mix(in srgb, var(--primary) 30%, var(--border)), var(--shadow-sm)" };

  const num = done ? { background: "var(--mint-dark)", color: "#fff", borderColor: "var(--mint-dark)" }
    : current ? { background: "var(--accent-dark)", color: "#fff", borderColor: "var(--accent-dark)" }
    : { background: "var(--surface)", color: "var(--muted)", borderColor: "var(--border)" };

  return (
    <div data-node={lv.id} className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center" style={{ left: pos.x, top: pos.y }}>
      {/* 編號角標 */}
      <span className="absolute -top-2 -left-2 w-7 h-7 rounded-full border-2 text-xs font-extrabold grid place-items-center z-[2]"
        style={{ ...num, boxShadow: "var(--shadow-sm)" }}>{index + 1}</span>

      {done && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[15px] tracking-[-2px] whitespace-nowrap" style={{ textShadow: "0 2px 2px rgba(0,0,0,.15)" }}>⭐⭐⭐</span>}

      {current && (
        <span className="absolute -top-[26px] left-1/2 -translate-x-1/2 text-[12px] font-bold py-[3px] px-3 rounded-full whitespace-nowrap animate-bob"
          style={{ background: "var(--ink)", color: "var(--surface)", boxShadow: "var(--shadow-sm)" }}>從這開始</span>
      )}

      <button
        type="button"
        disabled={locked}
        aria-label={lv.title + (locked ? "（即將推出）" : "")}
        onClick={() => { if (!locked) navigate("#/level/" + lv.id); }}
        className="relative w-[84px] h-[84px] rounded-full grid place-items-center text-[38px] border-none transition-transform active:translate-y-[6px]"
        style={circle}
      >
        <span className="leading-none" style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,.12))", opacity: locked ? 0.35 : 1 }}>{lv.emoji}</span>
        {locked && <span className="absolute text-[26px]">🔒</span>}
        {done && <span className="absolute text-[34px] text-white">✓</span>}
      </button>

      <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-max text-center">
        <div className={`font-bold text-[12px] sm:text-sm leading-tight px-2.5 py-0.5 rounded-full whitespace-nowrap ${locked ? "text-muted" : "text-ink"}`}
          style={{ background: "color-mix(in srgb, var(--surface) 80%, transparent)" }}>{lv.short || lv.title}</div>
      </div>
    </div>
  );
}
