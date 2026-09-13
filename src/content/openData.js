// 第 5 關要用的「真的開放資料」設定集中在這裡，換資料集只要改這個檔。
//
// 為什麼選 YouBike：
//  1. 它「真的即時」—— 按重新整理數字就會變，「為什麼不手動複製貼上」立刻有答案。
//  2. 市民每天在用，一看就懂。
//  3. 已實測這個端點允許跨來源讀取（CORS），所以學生的網頁可以直接 fetch，
//     不會卡在「Failed to fetch」。data.taipei 的 API 則會被擋。
//
// 注意：那個 CORS 設定不在我們手上。萬一哪天被關掉，儀表板會自動退回內建的
// 範例資料並在畫面上說明，不會開天窗。
export const OPEN_DATA = {
  name: "YouBike2.0 臺北市公共自行車即時資訊",
  short: "YouBike 即時資訊",
  owner: "臺北市政府",
  updated: "每分鐘更新",

  apiUrl: "https://tcgbusfs.blob.core.windows.net/dotapp/youbike/v2/youbike_immediate.json",
  portalUrl: "https://data.taipei/dataset",

  // 回傳是一個「陣列」，每一站一個物件（不是 data.taipei 那種 result.results 包法）
  fields: [
    ["sna", "站名"],
    ["sarea", "行政區"],
    ["ar", "地址"],
    ["available_rent_bikes", "可借車輛數"],
    ["available_return_bikes", "可還空位數"],
    ["Quantity", "總車位數"],
    ["mday", "資料時間"],
  ],

  // 這份資料「有什麼、沒有什麼」是本關最重要的教學點
  hasNot: ["誰借了車", "借車人姓名", "會員編號", "個人騎乘紀錄"],
};
