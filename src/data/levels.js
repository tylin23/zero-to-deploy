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
  {
    // 排在界線之後：這一關會教「不用後端也能收表單」，正好要用剛學的界線去判斷。
    id: "hosting",
    emoji: "🚀",
    title: "Netlify / Cloudflare Pages",
    short: "自動建置上線",
    tagline: "推上去就自動建置，還能收表單",
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
    // 納管前的最後一關：第一次有真的資料庫和登入，也是界線最吃緊的一關。
    id: "firebase",
    emoji: "🔥",
    title: "Firebase",
    short: "資料庫與登入",
    tagline: "第一次有真的資料庫 —— 也是界線最吃緊的一關",
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
    // id 沿用 exe-queue：佇列已經搬到名詞小教室，但改 id 會讓完成過這一關的人進度歸零。
    id: "exe-queue",
    emoji: "📦",
    title: "EXE 執行檔",
    tagline: "不上網的那一種「給別人用」，以及怎麼發新版本",
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
  hosting: {
    phase: "pre",
    difficulty: 2,
    kind: "靜態＋自動建置",
    diy: "red",
    diyLabel: "完全公開",
    risk: "內容全公開；表單資料存在境外平台",
    openness: "對外公開",
    cost: "免費（有額度）",
    maintain: "免顧",
    scenario: "改完自動上線、框架做的網站、簡單表單",
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
  firebase: {
    phase: "pre",
    difficulty: 4,
    kind: "動態（資料庫＋登入）",
    diy: "red",
    diyLabel: "接近紅線",
    risk: "規則沒設好＝資料庫全世界可讀寫；碰個資先問資訊單位",
    openness: "看安全規則怎麼設",
    cost: "免費（有額度）",
    maintain: "中",
    scenario: "內部小工具原型、假資料展示",
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
    kind: "單機（不上網）",
    diy: "yellow",
    diyLabel: "小工具可自己做",
    risk: "防毒誤判、執行檔信任；發給多人要簽章",
    openness: "給特定同仁",
    cost: "免費",
    maintain: "中（更新要自己做）",
    scenario: "批次改檔名、離線整理資料",
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
  {
    q: "網站想改完就自動上線，或它是用 React 這類框架做的",
    to: "hosting",
    why: "Netlify / Cloudflare Pages 會自動建置，推上去就更新",
  },
  { q: "想把市府開放資料變成一張看板給同仁看", to: "api", why: "讀開放資料、不碰個資，最安全" },
  { q: "要收市民報名／陳情，並自動通知承辦科室", to: "gas", why: "表單＋GAS 自動化，貼近日常" },
  {
    q: "想做一個要登入、還要存資料的小工具（先用假資料試）",
    to: "firebase",
    why: "不用自己寫後端就有資料庫和登入；但安全規則一定要設對",
  },
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
  hosting: {
    level: "高（完全公開）",
    points: [
      "跟 GitHub Pages 一樣，放上去的內容會完全公開到網際網路，還會被搜尋引擎索引。",
      "平台內建的表單很方便，但送出的資料會存在平台（多為境外）的伺服器上 —— 收市民個資請走機關既有、經過核可的管道。",
      "自由填寫的欄位擋不住別人把姓名電話寫進去；設計表單時能少開一個就少一個。",
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
  firebase: {
    level: "高（資料庫直接對外）",
    points: [
      "Firebase 的資料庫是「從網頁直接連」的，門鎖只有一道：安全規則。規則設錯（例如 allow read, write: if true）等於把整個資料庫公開，任何人都能讀走或清空。",
      "只檢查「有沒有登入」是不夠的 —— 任何人都能辦帳號。要連「是不是這筆資料的主人」一起比對。",
      "切勿存放真實市民個資；練習一律用假資料。要做會持續使用的系統，先問資訊單位。",
      "上線前去 Console 的「規則」頁親眼確認一次 —— 很多外洩不是不知道要設，是以為自己設過了。",
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
      "自己打包的 EXE 很常被防毒誤判，也可能被有心人植入惡意程式；只從可信來源取得，要發給比較多人前先問資訊單位（並留意程式碼簽章）。",
      "切勿在群組裡叫同仁「忽略防毒警告直接執行」—— 那等於在訓練大家對資安警告無感。",
      "EXE 在使用者自己的電腦上跑，會碰到本機檔案；處理到市民個資時，一樣受個資規範約束。",
    ],
  },
};

export const BADGES = {
  boundary: { id: "boundary", icon: "🚦", name: "界線意識", desc: "分得清自己做與該找資訊單位" },
  landscape: { id: "landscape", icon: "🔭", name: "全景視野", desc: "知道上線有哪些選項、各自差在哪" },
  concept: { id: "concept", icon: "🧭", name: "概念啟航", desc: "看懂前端、伺服器與部署" },
  firstDeploy: { id: "first-deploy", icon: "🚀", name: "首次部署", desc: "把第一個網站放上 GitHub Pages" },
  hosting: { id: "hosting", icon: "🚀", name: "自動上線", desc: "推上去就自動建置，同一個 repo 兩個網址" },
  apiBasics: { id: "api-basics", icon: "🔌", name: "API 入門", desc: "看懂 request / response 與 JSON" },
  gasPush: { id: "gas-push", icon: "📬", name: "自動推播", desc: "用 GAS 呼叫 API 自動送通知" },
  hfSpace: { id: "hf-space", icon: "🤗", name: "AI 上線", desc: "用 Hugging Face Spaces 部署 AI 應用" },
  firebase: { id: "firebase", icon: "🔥", name: "資料庫入門", desc: "看懂安全規則：誰能讀、誰能寫" },
  selfHost: { id: "self-host", icon: "🖥️", name: "自架伺服器", desc: "分得清內網自用與對外服務" },
  docker: { id: "docker", icon: "🐳", name: "打包貨櫃", desc: "用 Docker 把 App 和環境一起帶著走" },
  exeQueue: { id: "exe-queue", icon: "📦", name: "打包發版", desc: "把工具打包成 EXE，並發出有版本號的新版" },
};
