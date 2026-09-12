import { useEffect, useRef } from "react";
import { ProgressProvider, useProgress } from "./state/progress.jsx";
import { useHashRoute } from "./hooks/useHashRoute.js";
import { mapOrder, RISKS, EVAL } from "./data/levels.js";
import TopBar from "./components/TopBar.jsx";
import Home from "./components/Home.jsx";
import MapView from "./components/MapView.jsx";
import RiskNotice from "./components/RiskNotice.jsx";
import RiskNote from "./components/RiskNote.jsx";
import EvalBar from "./components/EvalBar.jsx";
import Guide from "./components/Guide.jsx";
import TermsPage from "./components/TermsPage.jsx";
import { LEVEL_TERMS, termById } from "./data/terms.js";
import BoundaryLevel from "./levels/BoundaryLevel.jsx";
import IntroLevel from "./levels/IntroLevel.jsx";
import GitHubPagesLevel from "./levels/GitHubPagesLevel.jsx";
import ApiLevel from "./levels/ApiLevel.jsx";
import GasLevel from "./levels/GasLevel.jsx";
import HuggingFaceLevel from "./levels/HuggingFaceLevel.jsx";
import SelfHostLevel from "./levels/SelfHostLevel.jsx";
import DockerLevel from "./levels/DockerLevel.jsx";
import ExeQueueLevel from "./levels/ExeQueueLevel.jsx";

const LEVELS = {
  boundary: BoundaryLevel,
  intro: IntroLevel,
  "github-pages": GitHubPagesLevel,
  api: ApiLevel,
  gas: GasLevel,
  huggingface: HuggingFaceLevel,
  selfhost: SelfHostLevel,
  docker: DockerLevel,
  "exe-queue": ExeQueueLevel,
};

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
      <TopBar navigate={navigate} />
      <main ref={mainRef} tabIndex={-1} className="flex-1 w-full max-w-[940px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 outline-none">{view}</main>
      <footer className="flex flex-wrap gap-x-5 gap-y-1.5 justify-center py-5 px-4 text-muted text-[13px] text-center">
        <span>Zero to Deploy · 一個用來教「網頁部署」的互動教材</span>
        <button type="button" onClick={() => navigate("#/guide")} className="text-ink font-bold underline underline-offset-2">🧭 選型指南</button>
        <button type="button" onClick={() => navigate("#/terms")} className="text-ink font-bold underline underline-offset-2">📇 名詞小教室</button>
        <button type="button" onClick={() => navigate("#/risk")} className="text-ink font-bold underline underline-offset-2">⚠️ 風險預告書</button>
        <span className="text-accent font-bold">這個網站本身，就是用 GitHub Pages 部署的 ✨</span>
      </footer>
    </div>
  );
}

function LevelPage({ id, navigate }) {
  const { markComplete, awardBadge } = useProgress();
  const meta = mapOrder.find((l) => l.id === id);
  const LevelComp = LEVELS[id];
  if (!meta || !LevelComp) { navigate("#/map"); return null; }

  const ctx = {
    complete: (badge) => { markComplete(id); if (badge) awardBadge(badge); },
    goMap: () => navigate("#/map"),
    navigate,
  };

  return (
    <div>
      <button type="button" onClick={() => navigate("#/map")}
        className="inline-flex items-center gap-1.5 bg-surface border-2 border-line text-muted font-bold text-sm py-2 px-4 rounded-full mb-4 active:translate-y-1 transition-transform"
        style={{ boxShadow: "0 4px 0 var(--border)" }}>← 回地圖</button>
      <div className="flex items-center gap-3.5 mb-2">
        <span className="text-[44px]" style={{ filter: "drop-shadow(0 3px 3px rgba(0,0,0,.12))" }}>{meta.emoji}</span>
        <div>
          <h1 className="text-[clamp(22px,4vw,30px)] font-bold text-ink m-0">{meta.title}</h1>
          <p className="text-muted text-sm m-0">{meta.tagline}</p>
        </div>
      </div>
      <EvalBar ev={EVAL[id]} />
      <RiskNote risk={RISKS[id]} />
      <LevelComp ctx={ctx} />
      <RelatedTerms ids={LEVEL_TERMS[id]} navigate={navigate} />
    </div>
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
          <button key={tid} type="button" onClick={() => navigate("#/terms/" + tid)}
            className="gh-btn !py-1.5">{t.emoji} {t.name}</button>
        );
      })}
    </div>
  );
}
