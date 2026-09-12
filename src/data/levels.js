// 地圖上的所有關卡（含尚未開放的），對應備課大綱
export const mapOrder = [
  { id: "intro", emoji: "🌐", title: "網站是怎麼被看到的？", tagline: "部署的核心概念", status: "ready" },
  { id: "github-pages", emoji: "📄", title: "GitHub Pages", tagline: "免費、純滑鼠，把靜態網站上線", status: "ready" },
  { id: "api", emoji: "🔌", title: "API 基礎", tagline: "前後端怎麼對話", status: "ready" },
  { id: "gas", emoji: "📬", title: "GAS + API 推送", tagline: "用 Google Apps Script 自動推播", status: "ready" },
  { id: "huggingface", emoji: "🤗", title: "AI 原生 + Hugging Face", tagline: "把 AI 應用一鍵部署", status: "ready" },
  { id: "selfhost", emoji: "🖥️", title: "Windows / Linux 自架", tagline: "用自己的電腦當伺服器", status: "ready" },
  { id: "docker", emoji: "🐳", title: "Docker", tagline: "把 App 和環境一起打包", status: "ready" },
  { id: "exe-queue", emoji: "📦", title: "EXE / Queue", tagline: "打包成程式、排隊處理任務", status: "soon" },
];

export const totalReady = mapOrder.filter((l) => l.status === "ready").length;

export const BADGES = {
  concept: { id: "concept", icon: "🧭", name: "概念啟航", desc: "看懂前端、伺服器與部署" },
  firstDeploy: { id: "first-deploy", icon: "🚀", name: "首次部署", desc: "把第一個網站放上 GitHub Pages" },
  apiBasics: { id: "api-basics", icon: "🔌", name: "API 入門", desc: "看懂 request / response 與 JSON" },
  gasPush: { id: "gas-push", icon: "📬", name: "自動推播", desc: "用 GAS 呼叫 API 自動送通知" },
  hfSpace: { id: "hf-space", icon: "🤗", name: "AI 上線", desc: "用 Hugging Face Spaces 部署 AI 應用" },
  selfHost: { id: "self-host", icon: "🖥️", name: "自架伺服器", desc: "理解 port、防火牆與對外連線" },
  docker: { id: "docker", icon: "🐳", name: "打包貨櫃", desc: "用 Docker 把 App 和環境一起帶著走" },
};
