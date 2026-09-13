// 地圖上的所有關卡（含尚未開放的），對應備課大綱
// ⚠️ 調整這個陣列的順序＝所有「第 N 關」的編號都會跟著變。教材文案裡有寫死的編號，
//    改完請 `grep -rn "第 [0-9] 關" src` 一起更新（tests/e2e.mjs 也有斷言）。
// 順序原則：先給零前提的觀念 → 親手做一次真的部署 → 才問「我可以做到哪裡」。
// 「界線意識」需要學生已經體會過「公開到網路上」是什麼意思，所以排在 GitHub Pages 之後。
// 「方法全景」放最前面：從學員已經有的經驗（AI 工具按分享）接進「部署」這個詞，
// 它是一張地圖不是一堂課 —— 不要求看懂，只要知道等一下會走過哪些地方。
export const mapOrder = [
  {
    id: "landscape",
    emoji: "🔭",
    title: "上線的方法有哪些？",
    short: "方法全景",
    tagline: "先看全景：從 AI 工具的分享連結，到機關正式系統",
    status: "ready",
    phase: "pre",
  },
  {
    id: "intro",
    emoji: "🌐",
    title: "我做好了，怎麼給別人用？",
    short: "怎麼給別人用",
    tagline: "從本機 HTML 到市民打得開的網址",
    status: "ready",
    phase: "pre",
  },
  {
    id: "github-pages",
    emoji: "📄",
    title: "GitHub Pages",
    tagline: "免費、純滑鼠，把靜態網站上線",
    status: "ready",
    phase: "pre",
  },
  {
    id: "boundary",
    emoji: "🚦",
    title: "這個我可以自己做嗎？",
    short: "可以自己做嗎？",
    tagline: "剛剛上線的東西，全世界都看得到",
    status: "ready",
    phase: "pre",
  },
  { id: "api", emoji: "🔌", title: "API 基礎", tagline: "前後端怎麼對話", status: "ready", phase: "pre" },
  {
    id: "gas",
    emoji: "📬",
    title: "GAS + API 推送",
    short: "GAS 自動推送",
    tagline: "用 Google Apps Script 自動推播",
    status: "ready",
    phase: "pre",
  },
  {
    id: "huggingface",
    emoji: "🤗",
    title: "AI 原生 + Hugging Face",
    short: "Hugging Face",
    tagline: "把 AI 應用一鍵部署",
    status: "ready",
    phase: "pre",
  },
  {
    id: "selfhost",
    emoji: "🖥️",
    title: "Windows / Linux 自架",
    short: "自架伺服器",
    tagline: "內網自用與對外的差別",
    status: "ready",
    phase: "post",
  },
  {
    id: "docker",
    emoji: "🐳",
    title: "Docker",
    tagline: "把 App 和環境一起打包",
    status: "ready",
    phase: "post",
  },
  {
    id: "exe-queue",
    emoji: "📦",
    title: "EXE / Queue",
    tagline: "打包成程式、排隊處理任務",
    status: "ready",
    phase: "post",
  },
];

// 不是獨立關卡、但一定要放進選型比較表的部署方式。
// AI 服務內建的「發布／分享」本身就是一種託管，第 1 關會介紹，這裡要能跟其他方式並排比較。
export const EXTRA_METHODS = [
  {
    id: "ai-tools",
    emoji: "🤖",
    title: "AI 工具的分享連結",
    note: "Claude Artifacts · Gemini Canvas · ChatGPT Sites",
    goLevel: "landscape",
  },
];

// 兩階段：納管前（自己動手）→ 交給資訊單位納管 → 納管後（交接與正式環境）
export const PHASES = {
  pre: { label: "納管前：你可以自己做的", short: "納管前", icon: "🙋" },
  post: { label: "納管後：交接與正式環境", short: "納管後", icon: "🏛️" },
};

export const totalReady = mapOrder.filter((l) => l.status === "ready").length;

// 各部署方式的評估（給非資訊公務員的選型維度）
// phase: pre=納管前自己做 / post=偏正式系統（納管後、多由資訊單位）
// difficulty: 1~5 上手難易度
// kind: 靜態 / 動態 / 單機
// diy: green 可自己做 / yellow 要留意 / red 接近紅線（通常要問資訊單位）
export const EVAL = {
  "ai-tools": {
    phase: "pre",
    difficulty: 1,
    kind: "靜態（平台代管）",
    diy: "yellow",
    diyLabel: "看你放什麼",
    risk: "有連結就能看；內容存在平台（多為境外）",
    openness: "拿到連結的人",
    cost: "免費 / 方案內",
    maintain: "免顧（但平台說了算）",
    scenario: "會議用的一次性圖表、點子原型",
  },
  "github-pages": {
    phase: "pre",
    difficulty: 2,
    kind: "靜態",
    diy: "red",
    diyLabel: "完全公開",
    risk: "只放可公開內容",
    openness: "對外公開",
    cost: "免費",
    maintain: "免顧",
    scenario: "市民講座公告、單頁看板",
  },
  api: {
    phase: "pre",
    difficulty: 3,
    kind: "靜態＋讀 API",
    diy: "green",
    diyLabel: "開放資料最安全",
    risk: "只用開放資料、不碰個資",
    openness: "內部 / 公開",
    cost: "免費",
    maintain: "低",
    scenario: "YouBike 即時看板、開放資料串接",
  },
  gas: {
    phase: "pre",
    difficulty: 3,
    kind: "動態（Google 跑）",
    diy: "yellow",
    diyLabel: "留意個資",
    risk: "通知用案號、控管表單權限",
    openness: "內部流程",
    cost: "免費（有額度）",
    maintain: "低",
    scenario: "市政信箱陳情通知、每日彙整",
  },
  huggingface: {
    phase: "pre",
    difficulty: 4,
    kind: "動態（跑模型）",
    diy: "yellow",
    diyLabel: "界線邊緣",
    risk: "境外第三方、務必去識別化",
    openness: "對外公開",
    cost: "免費 CPU",
    maintain: "低",
    scenario: "市民問答小幫手、民意分析",
  },
  selfhost: {
    phase: "post",
    difficulty: 5,
    kind: "動態（自架）",
    diy: "red",
    diyLabel: "偏正式系統",
    risk: "對外需資安評估，多由資訊單位",
    openness: "內網 / 對外",
    cost: "免費（自負硬體）",
    maintain: "要一直顧",
    scenario: "局處內部工具、市府正式服務",
  },
  docker: {
    phase: "post",
    difficulty: 5,
    kind: "打包 / 動態",
    diy: "red",
    diyLabel: "偏正式系統",
    risk: "交接與正式環境會用到",
    openness: "依環境",
    cost: "依環境",
    maintain: "中",
    scenario: "正式環境交付、一致執行",
  },
  "exe-queue": {
    phase: "post",
    difficulty: 4,
    kind: "單機 / 後端",
    diy: "yellow",
    diyLabel: "小工具可自己做",
    risk: "執行檔信任、防毒；大量任務多屬正式系統",
    openness: "給特定同仁",
    cost: "免費",
    maintain: "中（更新要重發）",
    scenario: "批次改檔名、月報表、大量通知",
  },
};

// 選型指南「幫我選」的情境 → 推薦方式
export const PICKER = [
  {
    q: "開會要用一次，或只是想先做個雛形看看長什麼樣",
    to: "ai-tools",
    why: "五分鐘就有一個能點的成品；但記得那個連結是「拿到的人都能開」",
  },
  { q: "只是想放一頁可公開的市府活動公告或看板", to: "github-pages", why: "靜態、免費、免顧，最快上線" },
  { q: "想把市府開放資料變成一張看板給同仁看", to: "api", why: "讀開放資料、不碰個資，最安全" },
  { q: "要收市民報名／陳情，並自動通知承辦科室", to: "gas", why: "表單＋GAS 自動化，貼近日常" },
  {
    q: "想用 AI 幫忙看文字（市民問答、民意分析）",
    to: "huggingface",
    why: "HF Spaces 一鍵部署；務必去識別化",
  },
];

const DIFF_LABEL = { 1: "很簡單", 2: "簡單", 3: "中等", 4: "稍難", 5: "偏難" };
export const diffText = (n) => "⭐".repeat(n) + "　" + (DIFF_LABEL[n] || "");
// 填色用（邊框、背景底色）
export const diyColor = { green: "var(--mint)", yellow: "var(--sun)", red: "var(--danger)" };
// 文字用（淺底上需加深才達 WCAG AA）
export const diyTextColor = {
  green: "var(--diy-green-text)",
  yellow: "var(--diy-yellow-text)",
  red: "var(--diy-red-text)",
};
export const diyText = { green: "🟢 可自己做", yellow: "🟡 要留意", red: "🔴 接近紅線" };

// 各部署方式的風險備注（公務／行政情境）。每一關頂部都會顯示。
export const RISKS = {
  boundary: {
    level: "必讀",
    points: [
      "這一關不會上傳任何東西，但它決定了剩下每一關你能做到哪裡。",
      "口訣：碰到「個資／機敏／對外正式服務／跨局處或全市府／帳號權限」→ 停，先找資訊單位。",
    ],
  },
  landscape: {
    level: "觀念",
    points: [
      "這一關只認識選項、不上傳任何東西，但先記住一件事：AI 工具的「發布／分享連結」多半是「拿到連結的人都能開」，轉傳一次就收不回來。",
      "那些內容會存在平台（多為境外）的伺服器上。示範請用假資料或去識別化資料，真實市民個資一律不要放上去。",
    ],
  },
  intro: {
    level: "觀念",
    points: [
      "這關只教觀念（本機 vs 上線、前端／後端、部署），不會上傳任何東西。",
      "但請記得：只要「部署到網路上」，就等於把資料交到你電腦以外的地方，之後每一關都要想清楚『這份資料可以外流嗎？』",
    ],
  },
  "github-pages": {
    level: "高（完全公開）",
    points: [
      "GitHub Pages 內容會「完全公開」到網際網路，任何人都看得到，還會被搜尋引擎索引、被第三方存檔；日後刪除也可能已被備份。",
      "只放「可對外公開」的資訊（如市府活動公告、開放資料）。切勿放市民個資、內部檔案、未公開公文。",
      "Repository 設為 Public 等於連原始檔一起公開。上傳前請確認符合機關資訊公開規範。",
    ],
  },
  api: {
    level: "中",
    points: [
      "呼叫外部 API 會把你的查詢參數送到第三方伺服器（可能位於境外）。",
      "查詢字串若含個資（身分證、姓名、陳情內容）等於外洩。本關示範用的是 YouBike 即時資訊 —— 只有「哪一站現在剩幾台車」，沒有任何借車人的資料。",
    ],
  },
  gas: {
    level: "中高",
    points: [
      "推播訊息會送到第三方聊天平台（Discord/Slack/LINE，多為境外服務）。",
      "Webhook 網址等同通行密鑰，外洩會被人冒發訊息，切勿寫進公開的 repo 或截圖。",
      "推播內容避免含市民個資；通知承辦科室時用案號代替姓名電話。",
    ],
  },
  huggingface: {
    level: "高（境外第三方）",
    points: [
      "上傳的文字、資料或模型會交給境外第三方平台處理，且可能被用於改善其服務。",
      "切勿上傳真實市民個資或機敏公務資料。示範請用去識別化或假資料。",
      "正式導入 AI 服務前，應先確認符合機關個資與資安規範並取得核准。",
    ],
  },
  selfhost: {
    level: "中（自行負責）",
    points: [
      "只在機關內網／localhost 執行時，資料不出機關、相對可控，適合「不可公開」的內部工具。",
      "一旦要讓市民從外面連進來，就必須先經機關資安評估與核准，並由資訊單位在受管控環境（機房／DMZ）提供、負責更新修補與監控 —— 這是機關層級的決定，不是個人可以自行開放的。",
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
      "工作佇列與系統日誌可能保存到市民個資，注意存取權限與保存期限，符合個資保存規範。",
    ],
  },
};

export const BADGES = {
  boundary: { id: "boundary", icon: "🚦", name: "界線意識", desc: "分得清自己做與該找資訊單位" },
  landscape: { id: "landscape", icon: "🔭", name: "全景視野", desc: "知道上線有哪些選項、各自差在哪" },
  concept: { id: "concept", icon: "🧭", name: "概念啟航", desc: "看懂前端、伺服器與部署" },
  firstDeploy: { id: "first-deploy", icon: "🚀", name: "首次部署", desc: "把第一個網站放上 GitHub Pages" },
  apiBasics: { id: "api-basics", icon: "🔌", name: "API 入門", desc: "看懂 request / response 與 JSON" },
  gasPush: { id: "gas-push", icon: "📬", name: "自動推播", desc: "用 GAS 呼叫 API 自動送通知" },
  hfSpace: { id: "hf-space", icon: "🤗", name: "AI 上線", desc: "用 Hugging Face Spaces 部署 AI 應用" },
  selfHost: { id: "self-host", icon: "🖥️", name: "自架伺服器", desc: "分得清內網自用與對外服務" },
  docker: { id: "docker", icon: "🐳", name: "打包貨櫃", desc: "用 Docker 把 App 和環境一起帶著走" },
  exeQueue: { id: "exe-queue", icon: "📦", name: "打包與佇列", desc: "認識 EXE 執行檔與工作佇列" },
};
