// 名詞小教室：給剛接觸開發的公務員「看懂就好」的軟工/部署概念卡
// category: perf 效能·穩定 / ops 部署·維運 / sec 安全·存取
// demo: 有小互動的卡（cache / idem）
// goLevel: 有對應可玩關卡就連過去；related: 掛在哪些關卡下方當延伸閱讀

export const TERM_CATS = [
  { id: "all", label: "全部", icon: "📇" },
  { id: "perf", label: "效能 · 穩定", icon: "⚡" },
  { id: "ops", label: "部署 · 維運", icon: "🚦" },
  { id: "sec", label: "安全 · 存取", icon: "🔐" },
];

export const TERMS = [
  {
    id: "cache",
    emoji: "⚡",
    name: "快取",
    en: "Cache",
    cat: "perf",
    demo: "cache",
    oneLiner: "把常用的結果先存起來，下次直接給，不用重算、重抓。",
    analogy: "像櫃台把最常被問的表格先印一疊放手邊，不用每次都跑回檔案室拿。",
    relation:
      "YouBike 即時看板這種很多人同時開的頁面，用快取讓大家秒回、資料源也不會被一直打爆。但要注意：資料更新了，快取可能還是舊的——所以要處理「什麼時候該更新快取」。",
  },
  {
    id: "queue",
    emoji: "🎢",
    name: "佇列 / 排隊",
    en: "Queue",
    cat: "perf",
    goLevel: "exe-queue",
    oneLiner: "任務先排隊，背景一個一個慢慢處理，使用者不用站著等。",
    analogy: "郵局抽號碼牌：你抽完就能去做別的，輪到你再處理。",
    relation:
      "要一次寄幾千封市民講座通知、產各局處月報表時，把任務丟進佇列排隊，使用者馬上得到回應、系統不被瞬間塞爆、失敗還能重試。",
  },
  {
    id: "cdn",
    emoji: "🌐",
    name: "內容傳遞網路",
    en: "CDN",
    cat: "perf",
    related: ["github-pages"],
    oneLiner: "把檔案複製到離使用者最近的節點，載入更快、更穩。",
    analogy: "連鎖超商在各地都有分店，就近取貨最快，不用大老遠跑總倉。",
    relation: "你在第 2 關用的 GitHub Pages，背後就是 CDN——所以全市各區的市民開你的公告頁都一樣快。",
  },
  {
    id: "idem",
    emoji: "🔁",
    name: "冪等",
    en: "Idempotency",
    cat: "perf",
    demo: "idem",
    related: ["gas"],
    oneLiner: "同一個動作做很多次，結果跟只做一次一樣。",
    analogy: "電梯按鈕按十下，電梯也只來一次。",
    relation:
      "市民陳情表單網路卡、連按兩次「送出」，市政信箱不應該就建立兩筆一模一樣的案件。用「案號」判斷是不是同一筆，就能避免重複。",
  },
  {
    id: "logmon",
    emoji: "📈",
    name: "日誌與監控",
    en: "Log / Monitoring",
    cat: "ops",
    oneLiner: "系統的行車紀錄器，加上「出事會自動通知你」的儀表板。",
    analogy: "行車紀錄器（回頭查發生什麼）＋ 儀表板警示燈（出事馬上亮）。",
    relation:
      "服務掛了、出錯了要能馬上知道，事後也能回頭查原因。交接給資訊局時，他們一定會問「怎麼監控、出事怎麼通知」。",
  },
  {
    id: "env",
    emoji: "🚦",
    name: "開發 / 測試 / 正式環境",
    en: "dev / staging / prod",
    cat: "ops",
    oneLiner: "有「練習場」和「正式場」，改東西先在練習場試，別直接動正式的。",
    analogy: "彩排場地 vs 正式演出舞台——不會有人直接在正式演出上試新橋段。",
    relation:
      "要改線上的市政公告或系統，先在測試環境試好再上正式，避免市民看到壞掉的畫面。這是最重要、也最常被忽略的維運觀念。",
  },
  {
    id: "backup",
    emoji: "💾",
    name: "備份與還原",
    en: "Backup / Restore",
    cat: "ops",
    oneLiner: "定期存副本，出錯、誤刪、被攻擊都能還原。",
    analogy: "重要文件影印一份鎖進抽屜；出事至少救得回昨天的版本。",
    relation:
      "報名名冊、陳情案件資料要定期備份，而且要「真的試過還原得回來」。「刪掉了能不能救」是納管一定會被問的。",
  },
  {
    id: "rollback",
    emoji: "↩️",
    name: "回復 / 版本退回",
    en: "Rollback",
    cat: "ops",
    oneLiner: "新版改壞了，一鍵退回上一個正常版本先止血。",
    analogy: "文件的「復原（Ctrl+Z）」，但是對整個系統或網站。",
    relation:
      "上線後發現改壞了，先退回昨天的版本讓服務正常，再慢慢查問題。這也是為什麼要做版本控制（納管後會用到）。",
  },
  {
    id: "authz",
    emoji: "🪪",
    name: "登入 vs 權限",
    en: "Authentication / Authorization",
    cat: "sec",
    oneLiner: "「你是誰」和「你能做什麼」是兩件事。",
    analogy: "進大樓要刷證件（證明你是誰）；但不是每張證件都能進機房（你能做什麼）。",
    relation:
      "系統不只要能登入，更要控管「哪個科室能看、誰能改哪些資料」——尤其一碰到市民個資，權限就是重點。",
  },
  {
    id: "https",
    emoji: "🔒",
    name: "HTTPS 與憑證",
    en: "HTTPS / TLS",
    cat: "sec",
    related: ["github-pages"],
    oneLiner: "網址列的那個鎖頭，代表你和網站之間的傳輸有加密。",
    analogy: "寄限時掛號＋彌封信封，而不是一張誰都看得到的明信片。",
    relation: "只要有讓市民填表、登入的頁面，一定要用 https，避免資料在路上被偷看或竄改。",
  },
  {
    id: "cors",
    emoji: "🚧",
    name: "跨來源限制",
    en: "CORS",
    cat: "sec",
    related: ["api"],
    oneLiner: "瀏覽器不准 A 網站的程式偷讀 B 網站的回應 —— 除非 B 網站說「這份誰都能讀」。",
    analogy:
      "你身上有機關的識別證。別的網站不能拿你的證去幫它調資料 —— 除非那個機關公告「這份資料誰都可以調」。",
    relation:
      "第 4 關的儀表板如果出現「抓不到即時資料」，通常就是這個。三個重點：① 擋你的是你自己的瀏覽器，請求其實送出去了、對方也回了，是瀏覽器不讓你的程式讀；② 要不要開放是資料提供方決定，你改自己的網頁沒用；③ 只有「網頁裡的程式去讀」會被擋 —— 網址列直接打開永遠看得到。它存在的理由是保護你：不然你點開的任何網站，都能用你的登入狀態去讀你的內部系統。",
  },
];

// 關卡 → 延伸名詞（顯示在關卡下方）
export const LEVEL_TERMS = {
  "github-pages": ["cdn", "https"],
  api: ["cache", "cors"],
  gas: ["idem"],
  "exe-queue": ["queue", "logmon"],
};

export const termById = (id) => TERMS.find((t) => t.id === id);
