/* 選型決策計算機的規則。

   定位很重要：這不是「平台選擇器」，而是「界線檢查器，順便在安全的時候
   給你平台建議」。所以「資料類型」等維度是閘門（hard gate），不是加權項 ——
   踩到紅線就直接停下來指名是哪一條，不會吐出平台建議。

   五個閘門刻意跟第 4 關那五條紅線一對一對應，兩邊講的話才會一致：
     個資／機敏、對外正式服務、跨局處全市府、要分權限（登入）。
   （第 4 關的「機敏資料」併進 data.personal 一起處理） */

import { EVAL } from "./levels.js";

export const DIMS = [
  {
    id: "data",
    label: "你要處理的是什麼資料？",
    options: [
      { id: "public", label: "已核定、可以對外公開的內容" },
      { id: "internal", label: "內部參考用，但不含任何人的個資" },
      { id: "personal", label: "含個資、機敏或未公開資料" },
    ],
  },
  {
    id: "purpose",
    label: "這東西的定位是什麼？",
    options: [
      { id: "proto", label: "一次性的雛形，開會用一下" },
      { id: "page", label: "對外的公告或資訊頁（單向給人看）" },
      { id: "tool", label: "科室內要長期用的小工具" },
      { id: "official", label: "對外的正式服務（市民會當成市府系統在用）" },
    ],
  },
  {
    id: "who",
    label: "誰要用這個東西？",
    options: [
      { id: "me", label: "只有我自己" },
      { id: "team", label: "同科室的同仁" },
      { id: "cross", label: "跨局處／全市府" },
      { id: "citizen", label: "一般市民" },
    ],
  },
  {
    id: "ops",
    label: "它需要「存資料」嗎？",
    options: [
      { id: "show", label: "不用，只是顯示內容" },
      { id: "collect", label: "要收表單或回報" },
      { id: "store", label: "要存起來，之後還要查詢或修改" },
    ],
  },
  {
    id: "auth",
    label: "需要分「誰能看、誰能改」嗎？",
    options: [
      { id: "no", label: "不用，打得開的人都能看" },
      { id: "yes", label: "要，不同人有不同權限" },
    ],
  },
];

/* 紅線閘門。踩到任何一條就不給平台建議，只說「停下來」。
   safe 是「如果只是想先練習／做原型」時仍然安全的出口，
   對應第 4 關那句「停下來 ≠ 不能做」—— 不給就變成純拒絕，沒有教學價值。 */
const GATES = [
  {
    id: "personal",
    when: (a) => a.data === "personal",
    line: "個資／機敏資料",
    why: "這類資料一旦放到平台上（多半在境外），就離開機關了，事後刪掉也可能已經被索引或存檔。備份請用機關既有的空間。",
    safe: "想練習的話，把姓名電話等欄位換成假資料再做，流程完全一樣。",
  },
  {
    id: "official",
    when: (a) => a.purpose === "official",
    line: "市民會當成市府官方系統在用的服務",
    why: "對外的正式服務要有人長期維運、要能承擔錯誤，這已經超出個人自主開發的範圍 —— 你一調職，它就變成沒人會修的黑盒子。",
    safe: "如果只是「單向給市民看的公告或資訊頁」，那不算正式服務，把定位改成那一項再算一次。",
  },
  {
    /* 窮舉所有組合時發現的漏洞：使用者可能不把它標成「正式服務」，
       但「向一般市民收資料、存起來還要查詢」實質上就是對外正式服務，
       而且幾乎一定會碰到個資。這條要自己補上，不能等使用者自己承認。 */
    id: "citizen-store",
    when: (a) => a.who === "citizen" && a.ops === "store",
    line: "實質上是對外的正式服務",
    why: "向一般市民收資料、存起來還要查詢修改 —— 不管你怎麼稱呼它，這就是一套對外服務，而且收進來的東西幾乎一定含個資。",
    safe: "先確認機關有沒有現成的、已經核可的收件管道（例如市政信箱、既有報名系統）；那才是這件事該走的路。",
  },
  {
    id: "cross",
    when: (a) => a.who === "cross",
    line: "跨局處／全市府共用",
    why: "使用範圍一跨出自己科室，維運、權責和資安評估都不再是你一個人的事，應該先找資訊單位納管。",
    safe: "先做成「科室內自己用」的版本驗證流程，確定有用再帶著成果去找資訊單位談。",
  },
  {
    id: "auth",
    when: (a) => a.auth === "yes",
    line: "需要登入、要分誰能看誰能改",
    why: "權限一旦設錯就是資料外洩，而「設對」需要的知識遠比把網站放上線多得多。帳號與權限通常該由資訊單位處理。",
    safe: "想理解它怎麼運作的話，第 9 關 Firebase 會用假資料帶你做一次，也會示範規則沒設好的後果。",
  },
];

/* 每種部署方式的能力，用來篩掉「做不到」的選項。
   ops：none 只能顯示／collect 能收表單／store 能存能查
   who：適合給誰用（exe-queue 是單機執行檔，發給別人要簽章，所以只留自己）
   purpose：適合的定位
   難易度和 phase 直接沿用 EVAL，不另外維護一份。
   publicUrl：建出來的網址是任何人都打得開的。內部資料選到這種方式時要特別警告，
   因為 EVAL 裡它們本來就寫著「只放可公開內容」。
   needsAi：只有「要用 AI 處理文字」才用得上。我們的維度裡沒有這一項
   （加一個維度只為一個方式不划算），所以它不進建議名單，
   留給下面的完整比較清單和第 8 關自己去介紹。 */
const CAP = {
  "ai-tools": {
    ops: "none",
    who: ["me", "team", "citizen"],
    purpose: ["proto"],
    publicUrl: true,
    fit: "五分鐘就有一個能點的成品，最適合開會前臨時要一個東西。",
  },
  "github-pages": {
    ops: "none",
    who: ["me", "team", "citizen"],
    purpose: ["proto", "page"],
    publicUrl: true,
    fit: "靜態、免費、免顧，放一頁公告或看板最快。",
  },
  hosting: {
    ops: "collect",
    who: ["me", "team", "citizen"],
    purpose: ["proto", "page", "tool"],
    publicUrl: true,
    fit: "改完自動上線，還能用平台內建的表單收簡單的資料。",
  },
  api: {
    ops: "none",
    who: ["me", "team", "citizen"],
    purpose: ["page", "tool"],
    publicUrl: true,
    fit: "讀開放資料做成看板，資料會自己更新，也完全不碰個資。",
  },
  gas: {
    ops: "store",
    who: ["me", "team"],
    purpose: ["tool"],
    fit: "表單直接寫進 Google 試算表，等於免費後端，還能自動發通知。",
  },
  huggingface: {
    ops: "none",
    who: ["me", "team", "citizen"],
    purpose: ["proto"],
    publicUrl: true,
    needsAi: true,
    fit: "要用 AI 處理文字時才需要它；務必先去識別化。",
  },
  firebase: {
    ops: "store",
    who: ["me", "team"],
    purpose: ["proto", "tool"],
    fit: "不用自己寫後端就有資料庫；但安全規則一定要設對。",
  },
  flask: {
    ops: "store",
    who: ["me", "team"],
    purpose: ["proto", "tool"],
    fit: "已經有一支會跑的 Python 腳本時，把它變成同仁點得動的介面。",
  },
  selfhost: {
    ops: "store",
    who: ["me", "team"],
    purpose: ["tool"],
    fit: "資料要留在機關自己的機器上時；但要自己顧，維運責任在你身上。",
  },
  docker: {
    ops: "store",
    who: ["me", "team"],
    purpose: ["tool"],
    fit: "主要用在交接和正式環境，自己做小工具通常還用不到。",
  },
  "exe-queue": {
    ops: "store",
    who: ["me"],
    purpose: ["proto", "tool"],
    fit: "完全不上網、資料不離開你的電腦，批次處理檔案最適合。",
  },
};

const OPS_RANK = { none: 0, collect: 1, store: 2 };

/* 自相矛盾的組合。這不是紅線，是「你這兩個選項對不上」——
   窮舉組合時發現的，與其硬湊一個建議，不如直接講清楚哪裡矛盾。 */
const CONTRADICTIONS = [
  {
    when: (a) => a.purpose === "page" && a.ops === "store",
    text: "你把定位選成「單向給人看的公告或資訊頁」，但又要存資料、之後還要查詢修改 —— 這兩件事對不上。會存資料、能查能改的東西已經是「工具」了，把定位改成「科室內長期用的小工具」再算一次。",
  },
];

/* 軟性提醒：不到紅線，但值得先想一下的組合。 */
const WARNINGS = [
  {
    when: (a) => a.data === "internal" && a.who === "citizen",
    text: "你選的是「內部參考資料」，但要給一般市民看 —— 先確認這份資料是否已經核定可以對外公開，再往下做。",
  },
  {
    when: (a) => a.data === "public" && a.ops !== "show",
    text: "內容可公開，但「收進來的資料」是另一回事：民眾填進表單的東西通常不可公開，而且自由填寫的欄位你擋不住別人寫進姓名電話。",
  },
  {
    when: (a) => a.purpose === "proto" && a.who === "citizen",
    text: "雛形給市民看的話，記得那個連結轉傳出去就收不回來了；先想清楚要給誰。",
  },
];

/**
 * 算出建議。
 * @param {{data:string,purpose:string,who:string,ops:string,auth:string}} answers
 * @returns {{ blocked: boolean, gates: object[], contradiction: string|null,
 *             picks: object[], formal: object[], ruledOut: object[], warnings: string[] }}
 */
export function decide(answers) {
  const gates = GATES.filter((g) => g.when(answers));
  const warnings = WARNINGS.filter((w) => w.when(answers)).map((w) => w.text);
  const base = { gates: [], contradiction: null, picks: [], formal: [], ruledOut: [], warnings };

  // 踩到紅線就不給平台建議 —— 這是刻意的，不是還沒做完。
  // 紅線優先於「選項矛盾」：該停的還是要停，不能讓它變成「你選錯了」。
  if (gates.length) return { ...base, blocked: true, gates };

  const clash = CONTRADICTIONS.find((c) => c.when(answers));
  if (clash) return { ...base, blocked: false, contradiction: clash.text };

  const need = OPS_RANK[answers.ops];
  const picks = [];
  const formal = [];
  const ruledOut = [];

  for (const [id, cap] of Object.entries(CAP)) {
    const ev = EVAL[id];
    if (!ev) continue;
    // 需要 AI 才用得上的方式不進建議名單（維度裡沒有這一項，見上面說明）
    if (cap.needsAi) continue;
    if (OPS_RANK[cap.ops] < need) {
      ruledOut.push({ id, reason: cap.ops === "none" ? "只能顯示內容，不能收或存資料" : "只能收表單，不能存起來再查" });
      continue;
    }
    if (!cap.who.includes(answers.who)) {
      ruledOut.push({ id, reason: "不適合給你選的這些人用" });
      continue;
    }
    if (!cap.purpose.includes(answers.purpose)) {
      ruledOut.push({ id, reason: "跟你選的定位不合" });
      continue;
    }
    const hit = {
      id,
      fit: cap.fit,
      difficulty: ev.difficulty,
      // 內部參考資料放在「網址誰都打得開」的方式上，等於對外公開 ——
      // 這是讓「資料類型」在非紅線路徑上也真的起作用的地方
      caveat: cap.publicUrl && answers.data === "internal" ? "這個方式的網址任何人都打得開，內部參考資料放上去等於對外公開" : null,
    };
    // 選型指南自己就寫「偏正式系統這些不是自己動手的範圍」，
    // 所以它們不能跟自助方案混在一起排，要分開講
    (ev.phase === "post" ? formal : picks).push(hit);
  }

  // 這個受眾要的是「門檻最低的可行解」，所以難易度低的排前面
  const byDiff = (a, b) => a.difficulty - b.difficulty;
  picks.sort(byDiff);
  formal.sort(byDiff);

  return { ...base, blocked: false, picks, formal, ruledOut, warnings };
}

/** 窮舉所有維度組合（給測試和自我檢查用）。 */
export function allCombos() {
  const out = [];
  const walk = (i, acc) => {
    if (i === DIMS.length) return out.push({ ...acc });
    for (const o of DIMS[i].options) walk(i + 1, { ...acc, [DIMS[i].id]: o.id });
  };
  walk(0, {});
  return out;
}
