import { ProgressProvider, useProgress } from "./state/progress.jsx";
import { useHashRoute } from "./hooks/useHashRoute.js";
import { mapOrder } from "./data/levels.js";
import TopBar from "./components/TopBar.jsx";
import Home from "./components/Home.jsx";
import MapView from "./components/MapView.jsx";
import IntroLevel from "./levels/IntroLevel.jsx";
import GitHubPagesLevel from "./levels/GitHubPagesLevel.jsx";
import ApiLevel from "./levels/ApiLevel.jsx";
import GasLevel from "./levels/GasLevel.jsx";
import HuggingFaceLevel from "./levels/HuggingFaceLevel.jsx";
import SelfHostLevel from "./levels/SelfHostLevel.jsx";
import DockerLevel from "./levels/DockerLevel.jsx";
import ExeQueueLevel from "./levels/ExeQueueLevel.jsx";

const LEVELS = {
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

  let view;
  const levelMatch = hash.match(/^#\/level\/(.+)$/);
  if (hash === "#/" || hash === "") view = <Home navigate={navigate} />;
  else if (hash === "#/map") view = <MapView navigate={navigate} />;
  else if (levelMatch) view = <LevelPage id={levelMatch[1]} navigate={navigate} />;
  else view = <Home navigate={navigate} />;

  return (
    <div className="min-h-full flex flex-col">
      <TopBar navigate={navigate} />
      <main className="flex-1 w-full max-w-[940px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16">{view}</main>
      <footer className="flex flex-wrap gap-x-5 gap-y-1.5 justify-center py-5 px-4 text-muted text-[13px] text-center">
        <span>Zero to Deploy · 一個用來教「網頁部署」的互動教材</span>
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
      <LevelComp ctx={ctx} />
    </div>
  );
}
