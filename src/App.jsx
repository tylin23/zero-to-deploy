import { lazy, Suspense, useEffect, useRef } from "react";
import { ProgressProvider, useProgress } from "./state/progress.jsx";
import { useHashRoute } from "./hooks/useHashRoute.js";
import { mapOrder, PHASES, RISKS, EVAL, totalReady } from "./data/levels.js";
import TopBar from "./components/TopBar.jsx";
import { BottomNav } from "./components/Nav.jsx";
import Home from "./components/Home.jsx";
import MapView from "./components/MapView.jsx";
import RiskNotice from "./components/RiskNotice.jsx";
import RiskNote from "./components/RiskNote.jsx";
import EvalBar from "./components/EvalBar.jsx";
import Guide from "./components/Guide.jsx";
import TermsPage from "./components/TermsPage.jsx";
import { LEVEL_TERMS, termById } from "./data/terms.js";

// 關卡採 lazy 載入：首頁與地圖不必先下載每一關的程式碼
const LEVELS = {
  landscape: lazy(() => import("./levels/LandscapeLevel.jsx")),
  intro: lazy(() => import("./levels/IntroLevel.jsx")),
  "github-pages": lazy(() => import("./levels/GitHubPagesLevel.jsx")),
  boundary: lazy(() => import("./levels/BoundaryLevel.jsx")),
  hosting: lazy(() => import("./levels/HostingLevel.jsx")),
  api: lazy(() => import("./levels/ApiLevel.jsx")),
  gas: lazy(() => import("./levels/GasLevel.jsx")),
  huggingface: lazy(() => import("./levels/HuggingFaceLevel.jsx")),
  selfhost: lazy(() => import("./levels/SelfHostLevel.jsx")),
  docker: lazy(() => import("./levels/DockerLevel.jsx")),
  "exe-queue": lazy(() => import("./levels/ExeQueueLevel.jsx")),
};

// 關卡載入中的暫時畫面
function LevelLoading() {
  return (
    <div className="card text-center text-muted py-10" aria-busy="true">
      <div className="text-3xl mb-2">⏳</div>
      關卡載入中…
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  );
}

function Shell() {
  const { hash, navigate } = useHashRoute();
  const { riskAck } = useProgress();
  const mainRef = useRef(null);

  // a11y：換頁後把焦點移到主要內容，鍵盤／讀屏使用者才不會迷失
  useEffect(() => {
    if (mainRef.current) mainRef.current.focus({ preventScroll: true });
  }, [hash]);

  const levelMatch = hash.match(/^#\/level\/(.+)$/);
  const termsMatch = hash.match(/^#\/terms(?:\/(.+))?$/);

  // 風險閘門：還沒確認風險預告書之前，任何「動手」的頁面（地圖／關卡）
  // 都先導到預告書；確認後再回到原本要去的地方（含深連結、書籤）。
  const needsGate = (hash === "#/map" || !!levelMatch) && !riskAck;

  let view;
  if (needsGate) view = <RiskNotice navigate={navigate} next={hash} />;
  else if (hash === "#/" || hash === "") view = <Home navigate={navigate} />;
  else if (hash === "#/risk") view = <RiskNotice navigate={navigate} />;
  else if (hash === "#/guide") view = <Guide navigate={navigate} />;
  else if (termsMatch) view = <TermsPage navigate={navigate} focusId={termsMatch[1] || null} />;
  else if (hash === "#/map") view = <MapView navigate={navigate} />;
  else if (levelMatch) view = <LevelPage id={levelMatch[1]} navigate={navigate} />;
  else view = <Home navigate={navigate} />;

  return (
    <div className="min-h-full flex flex-col">
      <TopBar hash={hash} navigate={navigate} />
      <main
        ref={mainRef}
        tabIndex={-1}
        className="flex-1 w-full max-w-[940px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-10 outline-none"
      >
        {view}
      </main>
      <SiteFooter navigate={navigate} />
      {/* 手機底部分頁列會蓋住內容，留出等高的空間 */}
      <div className="md:hidden h-[64px]" aria-hidden="true" />
      <BottomNav hash={hash} navigate={navigate} />
    </div>
  );
}

function SiteFooter({ navigate }) {
  const { reset } = useProgress();
  return (
    <footer className="border-t border-line mt-4">
      <div className="max-w-[940px] mx-auto px-4 sm:px-6 py-5 text-[13px] text-muted space-y-2.5 text-center">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 justify-center">
          <button
            type="button"
            onClick={() => navigate("#/risk")}
            className="text-ink font-bold underline underline-offset-2"
          >
            ⚠️ 風險預告書
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("要清除所有學習進度與徽章嗎？（給老師重新開課用）")) {
                reset();
                navigate("#/");
              }
            }}
            className="underline underline-offset-2 hover:text-ink"
          >
            ↺ 重設學習進度
          </button>
        </div>
        <div>Zero to Deploy · 一個用來教「網頁部署」的互動教材</div>
        <div className="text-accentText font-bold">這個網站本身，就是用 GitHub Pages 部署的 ✨</div>
      </div>
    </footer>
  );
}

function LevelPage({ id, navigate }) {
  const { markComplete, awardBadge, isComplete } = useProgress();
  const idx = mapOrder.findIndex((l) => l.id === id);
  const meta = mapOrder[idx];
  const LevelComp = LEVELS[id];
  if (!meta || !LevelComp) {
    navigate("#/map");
    return null;
  }

  const prev = idx > 0 ? mapOrder[idx - 1] : null;
  const next = idx < mapOrder.length - 1 ? mapOrder[idx + 1] : null;

  const ctx = {
    complete: (badge) => {
      markComplete(id);
      if (badge) awardBadge(badge);
    },
    goMap: () => navigate("#/map"),
    goNext: () => navigate(next ? "#/level/" + next.id : "#/map"),
    next,
    navigate,
  };

  return (
    <div>
      {/* 麵包屑：我在整張地圖的哪裡 */}
      <div className="flex items-center gap-2 flex-wrap mb-3 text-[13px]">
        <button
          type="button"
          onClick={() => navigate("#/map")}
          className="inline-flex items-center gap-1.5 bg-surface border-2 border-line text-muted font-bold py-1.5 px-3.5 rounded-full active:translate-y-1 transition-transform"
          style={{ boxShadow: "0 4px 0 var(--border)" }}
        >
          ← 回地圖
        </button>
        <span className="font-extrabold text-muted">
          第 {idx + 1} / {totalReady} 關
        </span>
        <span className="text-muted" aria-hidden="true">
          ·
        </span>
        <span className="font-bold text-muted whitespace-nowrap">
          {PHASES[meta.phase].icon} <span className="sm:hidden">{PHASES[meta.phase].short}</span>
          <span className="hidden sm:inline">{PHASES[meta.phase].label}</span>
        </span>
        {isComplete(id) && (
          <span className="pill" style={{ background: "var(--success-soft)", color: "var(--success)" }}>
            ✓ 已完成
          </span>
        )}
      </div>

      <div className="flex items-center gap-3.5 mb-2">
        <span className="text-[44px]" style={{ filter: "drop-shadow(0 3px 3px rgba(0,0,0,.12))" }}>
          {meta.emoji}
        </span>
        <div>
          <h1 className="text-[clamp(22px,4vw,30px)] font-bold text-ink m-0">{meta.title}</h1>
          <p className="text-muted text-sm m-0">{meta.tagline}</p>
        </div>
      </div>
      <EvalBar ev={EVAL[id]} />
      <RiskNote risk={RISKS[id]} />
      <Suspense fallback={<LevelLoading />}>
        <LevelComp ctx={ctx} />
      </Suspense>
      <RelatedTerms ids={LEVEL_TERMS[id]} navigate={navigate} />
      <LevelPager prev={prev} next={next} navigate={navigate} />
    </div>
  );
}

// 關卡底部的上／下一關，不必每次回地圖再點
function LevelPager({ prev, next, navigate }) {
  if (!prev && !next) return null;
  const box =
    "flex-1 min-w-[150px] text-left bg-surface border-2 border-line rounded-[18px] p-3.5 transition-transform active:translate-y-1 hover:border-primary";
  return (
    <nav aria-label="關卡導覽" className="flex flex-wrap gap-3 mt-5">
      {prev && (
        <button type="button" className={box} onClick={() => navigate("#/level/" + prev.id)}>
          <div className="text-xs font-bold text-muted">← 上一關</div>
          <div className="font-extrabold text-ink text-sm mt-0.5">
            {prev.emoji} {prev.short || prev.title}
          </div>
        </button>
      )}
      {next && (
        <button type="button" className={box + " text-right"} onClick={() => navigate("#/level/" + next.id)}>
          <div className="text-xs font-bold text-muted">下一關 →</div>
          <div className="font-extrabold text-ink text-sm mt-0.5">
            {next.emoji} {next.short || next.title}
          </div>
        </button>
      )}
    </nav>
  );
}

// 關卡下方的「延伸名詞」：連到名詞小教室對應卡片
function RelatedTerms({ ids, navigate }) {
  if (!ids || !ids.length) return null;
  return (
    <div className="card mt-5 flex flex-wrap items-center gap-2.5">
      <span className="font-extrabold text-ink text-sm">📇 延伸名詞小教室：</span>
      {ids.map((tid) => {
        const t = termById(tid);
        if (!t) return null;
        return (
          <button
            key={tid}
            type="button"
            onClick={() => navigate("#/terms/" + tid)}
            className="gh-btn gh-btn-sm"
          >
            {t.emoji} {t.name}
          </button>
        );
      })}
    </div>
  );
}
