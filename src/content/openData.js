// 第 4 關要用的「真的開放資料」設定集中在這裡，換資料集只要改這個檔。
//
// data.taipei 的 API 格式固定是：
//   https://data.taipei/api/v1/dataset/{rid}?scope=resourceAquire&limit=5&offset=0
// 回傳外層固定是：
//   { "result": { "limit":5, "offset":0, "count":123, "sort":"", "results":[ {…}, … ] } }
//
// 注意：說明頁網址用的 id，和 API 用的 rid 不是同一組。
export const OPEN_DATA = {
  name: "臺北市陳情系統類別資料",
  desc: "臺北市陳情系統各月份類別資料",
  owner: "臺北市政府研究發展考核委員會（研考會）",
  licence: "公開",
  updated: "每月更新",
  since: "2016-11",

  datasetUrl: "https://data.taipei/dataset/detail?id=cb423c17-88eb-4231-a725-f1b93247d1bf",
  apiUrl:
    "https://data.taipei/api/v1/dataset/7e5c4a52-b2ed-49c0-a103-caa72bda9d47?scope=resourceAquire&limit=5",
  portalUrl: "https://data.taipei/dataset",

  // 欄位取自資料集說明頁的「主要欄位說明」。
  // 這台機器連不到 data.taipei（組織 egress 政策回 403），沒辦法實際打一次核對
  // 真實 JSON 的 key 拼法；若平台實際回傳的 key 與這裡不同，改這一份就好。
  fields: [
    "案件編號",
    "案件主類別",
    "案件次類別",
    "受理機關",
    "受理科室",
    "受理日期",
    "送達日期",
    "結案日期",
  ],

  // 這份資料「有什麼、沒有什麼」正是本關最重要的教學點
  hasNot: ["陳情人姓名", "電話", "地址", "陳情內容原文"],
};
