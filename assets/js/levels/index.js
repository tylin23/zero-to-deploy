// =========================================================
// 關卡註冊表：地圖上顯示的所有關卡
// 目前可玩：intro、github-pages
// 其餘為「即將推出」，對應備課大綱，讓地圖看起來完整、也預留擴充位
// =========================================================
import intro from "./intro.js";
import githubPages from "./githubPages.js";

// 可玩的關卡（有 render 函式）
export const playable = {
  intro,
  "github-pages": githubPages,
};

// 地圖顯示順序（含尚未開放的關）
export const mapOrder = [
  { id: "intro", emoji: "🌐", title: "網站是怎麼被看到的？", tagline: "部署的核心概念", status: "ready" },
  { id: "github-pages", emoji: "📄", title: "GitHub Pages", tagline: "免費、純滑鼠，把靜態網站上線", status: "ready" },
  { id: "api", emoji: "🔌", title: "API 基礎", tagline: "前後端怎麼對話", status: "soon" },
  { id: "gas", emoji: "📬", title: "GAS + API 推送", tagline: "用 Google Apps Script 自動推播", status: "soon" },
  { id: "huggingface", emoji: "🤗", title: "AI 原生 + Hugging Face", tagline: "把 AI 應用一鍵部署", status: "soon" },
  { id: "selfhost", emoji: "🖥️", title: "Windows / Linux 自架", tagline: "用自己的電腦當伺服器", status: "soon" },
  { id: "docker", emoji: "🐳", title: "Docker", tagline: "把 App 和環境一起打包", status: "soon" },
  { id: "exe-queue", emoji: "📦", title: "EXE / Queue", tagline: "打包成程式、排隊處理任務", status: "soon" },
];

export const totalReady = mapOrder.filter((l) => l.status === "ready").length;
