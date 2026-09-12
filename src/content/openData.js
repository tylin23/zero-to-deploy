// 第 4 關要用的「真的開放資料」設定集中在這裡，換資料集只要改這個檔。
//
// data.taipei 的 API 格式固定是：
//   https://data.taipei/api/v1/dataset/{rid}?scope=resourceAquire&limit=5&offset=0
// 回傳外層固定是：
//   { "result": { "limit":5, "offset":0, "count":123, "results":[ {…}, … ] } }
//
// 注意：說明頁網址用的 id，和 API 用的 rid 不是同一組。
export const OPEN_DATA = {
  // 資料集說明頁（欄位說明、更新頻率、授權方式都在這）
  datasetUrl: "https://data.taipei/dataset/detail?id=cb423c17-88eb-4231-a725-f1b93247d1bf",

  // 真正的 API。在瀏覽器貼上這串網址就會直接看到 JSON。
  apiUrl:
    "https://data.taipei/api/v1/dataset/7e5c4a52-b2ed-49c0-a103-caa72bda9d47?scope=resourceAquire&limit=5",

  // 平台首頁
  portalUrl: "https://data.taipei/dataset",

  // TODO（站內模擬器用）：資料集名稱、提供機關、以及回傳裡要示範的欄位。
  // 這台機器連不到 data.taipei（組織 egress 政策回 403，curl 與 WebFetch 皆然），
  // 沒辦法自己查欄位，填上之後才能把站內的假 API 換成這份資料的真實欄位。
  name: null,
  owner: null,
  sample: null,
};
