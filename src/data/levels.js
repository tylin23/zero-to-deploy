// 地圖上的所有關卡（含尚未開放的），對應備課大綱
export const mapOrder = [
  { id: "intro", emoji: "🌐", title: "網站是怎麼被看到的？", tagline: "部署的核心概念", status: "ready" },
  { id: "github-pages", emoji: "📄", title: "GitHub Pages", tagline: "免費、純滑鼠，把靜態網站上線", status: "ready" },
  { id: "api", emoji: "🔌", title: "API 基礎", tagline: "前後端怎麼對話", status: "ready" },
  { id: "gas", emoji: "📬", title: "GAS + API 推送", tagline: "用 Google Apps Script 自動推播", status: "ready" },
  { id: "huggingface", emoji: "🤗", title: "AI 原生 + Hugging Face", tagline: "把 AI 應用一鍵部署", status: "ready" },
  { id: "selfhost", emoji: "🖥️", title: "Windows / Linux 自架", tagline: "用自己的電腦當伺服器", status: "ready" },
  { id: "docker", emoji: "🐳", title: "Docker", tagline: "把 App 和環境一起打包", status: "ready" },
  { id: "exe-queue", emoji: "📦", title: "EXE / Queue", tagline: "打包成程式、排隊處理任務", status: "ready" },
];

export const totalReady = mapOrder.filter((l) => l.status === "ready").length;

// 各部署方式的評估（給非資訊公務員的選型維度）
// phase: pre=納管前自己做 / post=偏正式系統（納管後、多由資訊單位）
// difficulty: 1~5 上手難易度
// kind: 靜態 / 動態 / 單機
// diy: green 可自己做 / yellow 要留意 / red 接近紅線（通常要問資訊單位）
export const EVAL = {
  "github-pages": {
    phase: "pre", difficulty: 2, kind: "靜態",
    diy: "red", diyLabel: "完全公開", risk: "只放可公開內容",
    openness: "對外公開", cost: "免費", maintain: "免顧",
    scenario: "活動公告頁、單頁看板",
  },
  api: {
    phase: "pre", difficulty: 3, kind: "靜態＋讀 API",
    diy: "green", diyLabel: "開放資料最安全", risk: "只用開放資料、不碰個資",
    openness: "內部 / 公開", cost: "免費", maintain: "低",
    scenario: "空品 / 垃圾車 / 場館看板",
  },
  gas: {
    phase: "pre", difficulty: 3, kind: "動態（Google 跑）",
    diy: "yellow", diyLabel: "留意個資", risk: "通知用案號、控管表單權限",
    openness: "內部流程", cost: "免費（有額度）", maintain: "低",
    scenario: "民眾申辦自動通知、每日彙整",
  },
  huggingface: {
    phase: "pre", difficulty: 4, kind: "動態（跑模型）",
    diy: "yellow", diyLabel: "界線邊緣", risk: "境外第三方、務必去識別化",
    openness: "對外公開", cost: "免費 CPU", maintain: "低",
    scenario: "問答小幫手、去識別化意見分析",
  },
  selfhost: {
    phase: "post", difficulty: 5, kind: "動態（自架）",
    diy: "red", diyLabel: "偏正式系統", risk: "對外需資安評估，多由資訊單位",
    openness: "內網 / 對外", cost: "免費（自負硬體）", maintain: "要一直顧",
    scenario: "機關內部工具、正式服務",
  },
  docker: {
    phase: "post", difficulty: 5, kind: "打包 / 動態",
    diy: "red", diyLabel: "偏正式系統", risk: "交接與正式環境會用到",
    openness: "依環境", cost: "依環境", maintain: "中",
    scenario: "正式環境交付、一致執行",
  },
  "exe-queue": {
    phase: "post", difficulty: 4, kind: "單機 / 後端",
    diy: "yellow", diyLabel: "小工具可自己做", risk: "執行檔信任、防毒；大量任務多屬正式系統",
    openness: "給特定同仁", cost: "免費", maintain: "中（更新要重發）",
    scenario: "批次改檔名、報表轉檔、大量通知",
  },
};

// 選型指南「幫我選」的情境 → 推薦方式
export const PICKER = [
  { q: "只是想放一頁可公開的公告或看板", to: "github-pages", why: "靜態、免費、免顧，最快上線" },
  { q: "想把政府開放資料變成一張看板", to: "api", why: "讀開放資料、不碰個資，最安全" },
  { q: "要收民眾報名/意見，並自動通知承辦", to: "gas", why: "表單＋GAS 自動化，貼近日常" },
  { q: "想用 AI 幫忙看文字（問答、意見分析）", to: "huggingface", why: "HF Spaces 一鍵部署；務必去識別化" },
];

const DIFF_LABEL = { 1: "很簡單", 2: "簡單", 3: "中等", 4: "稍難", 5: "偏難" };
export const diffText = (n) => "⭐".repeat(n) + "　" + (DIFF_LABEL[n] || "");
export const diyColor = { green: "var(--mint)", yellow: "var(--sun)", red: "var(--danger)" };
export const diyText = { green: "🟢 可自己做", yellow: "🟡 要留意", red: "🔴 接近紅線" };

// 各部署方式的風險備注（公務／行政情境）。每一關頂部都會顯示。
export const RISKS = {
  intro: {
    level: "觀念",
    points: ["這關只教觀念，不會上傳任何東西。", "但請記得：只要「部署到網路上」，就等於把資料交到你電腦以外的地方，之後每一關都要想清楚『這份資料可以外流嗎？』"],
  },
  "github-pages": {
    level: "高（完全公開）",
    points: [
      "GitHub Pages 內容會「完全公開」到網際網路，任何人都看得到，還會被搜尋引擎索引、被第三方存檔；日後刪除也可能已被備份。",
      "只放「可對外公開」的資訊（如活動公告、開放資料）。切勿放民眾個資、內部檔案、未公開公文。",
      "Repository 設為 Public 等於連原始檔一起公開。上傳前請確認符合機關資訊公開規範。",
    ],
  },
  api: {
    level: "中",
    points: [
      "呼叫外部 API 會把你的查詢參數送到第三方伺服器（可能位於境外）。",
      "查詢字串若含個資（身分證、姓名、案號）等於外洩。示範一律使用「政府開放資料」等公開資訊。",
    ],
  },
  gas: {
    level: "中高",
    points: [
      "推播訊息會送到第三方聊天平台（Discord/Slack/LINE，多為境外服務）。",
      "Webhook 網址等同通行密鑰，外洩會被人冒發訊息，切勿寫進公開的 repo 或截圖。",
      "推播內容避免含民眾個資；通知承辦時用案號代替姓名電話。",
    ],
  },
  huggingface: {
    level: "高（境外第三方）",
    points: [
      "上傳的文字、資料或模型會交給境外第三方平台處理，且可能被用於改善其服務。",
      "切勿上傳真實民眾個資或機敏公務資料。示範請用去識別化或假資料。",
      "正式導入 AI 服務前，應先確認符合機關個資與資安規範並取得核准。",
    ],
  },
  selfhost: {
    level: "中（自行負責）",
    points: [
      "只在機關內網／localhost 執行時，資料不出機關、相對可控，適合「不可公開」的內部工具。",
      "一旦對外開放（public IP／port forwarding），就要自行負責更新修補、HTTPS 憑證、存取控制，並先經機關資安評估與核准。",
    ],
  },
  docker: {
    level: "中",
    points: [
      "打包的 image 可能夾帶機敏設定、金鑰或憑證，切勿推送到公開的 registry。",
      "務必使用官方／可信來源的 base image，避免供應鏈（被植入惡意程式）風險。",
    ],
  },
  "exe-queue": {
    level: "中",
    points: [
      "EXE 執行檔可能被防毒誤判，也可能被有心人植入惡意程式；只從可信來源取得，散布給同仁前先確認安全（並留意簽章）。",
      "工作佇列與系統日誌可能保存到民眾個資，注意存取權限與保存期限，符合個資保存規範。",
    ],
  },
};

export const BADGES = {
  concept: { id: "concept", icon: "🧭", name: "概念啟航", desc: "看懂前端、伺服器與部署" },
  firstDeploy: { id: "first-deploy", icon: "🚀", name: "首次部署", desc: "把第一個網站放上 GitHub Pages" },
  apiBasics: { id: "api-basics", icon: "🔌", name: "API 入門", desc: "看懂 request / response 與 JSON" },
  gasPush: { id: "gas-push", icon: "📬", name: "自動推播", desc: "用 GAS 呼叫 API 自動送通知" },
  hfSpace: { id: "hf-space", icon: "🤗", name: "AI 上線", desc: "用 Hugging Face Spaces 部署 AI 應用" },
  selfHost: { id: "self-host", icon: "🖥️", name: "自架伺服器", desc: "理解 port、防火牆與對外連線" },
  docker: { id: "docker", icon: "🐳", name: "打包貨櫃", desc: "用 Docker 把 App 和環境一起帶著走" },
  exeQueue: { id: "exe-queue", icon: "📦", name: "打包與佇列", desc: "認識 EXE 執行檔與工作佇列" },
};
