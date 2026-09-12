// 所有關卡的測驗題集中在這裡，方便老師整批檢視與調整文字。
// 每題：question 題目／options 選項（correct 標出正解）／explainOk 答對說明／explainNo 答錯提示。
export const QUIZZES = {
  intro: {
    question: "為什麼不能只把網頁放在「自己的筆電」上就好？",
    options: [
      { text: "因為筆電會關機、會睡眠，別人不一定連得到", correct: true },
      { text: "因為筆電不能開網頁", correct: false },
      { text: "因為 HTML 只能在伺服器打開", correct: false },
    ],
    explainOk:
      "沒錯！要「一直開著、有固定網址」，別人才隨時看得到 —— 這就是為什麼我們需要部署到伺服器 / 託管服務。",
    explainNo: "再想想：關鍵在於「別人能不能隨時連到你的電腦」。",
  },

  githubPages: {
    question: "GitHub Pages 最適合放哪一種網站？",
    options: [
      { text: "靜態網站：HTML / CSS / JS（例如市府活動公告頁、單頁看板）", correct: true },
      { text: "需要資料庫、後端運算的大型系統", correct: false },
      { text: "只有存在自己電腦裡的 Word 檔", correct: false },
    ],
    explainOk:
      "對！GitHub Pages 專門放「靜態網站」—— 純前端的頁面。要跑後端／資料庫就得用別的服務（之後的關會教）。",
    explainNo: "提示：GitHub Pages 不會幫你跑後端程式，它只負責把「檔案」原封不動送給瀏覽器。",
  },

  api: {
    question: "你在瀏覽器打開那個 YouBike 即時資訊的網址，看到一大包 JSON。這代表什麼？",
    options: [
      { text: "你送了一個 GET 請求，API 回傳了結構化資料（JSON）", correct: true },
      { text: "你把網站部署上線了", correct: false },
      { text: "你下載了一個網頁的完整 HTML 畫面", correct: false },
    ],
    explainOk:
      "正是如此！GET 一個 endpoint → 拿回 JSON 資料。而且注意：這份資料只有「哪一站現在剩幾台車」，沒有任何借車人的資料 —— 只到現況這一層才能公開，這是市府開放資料最安全的原因。",
    explainNo: "再想想：畫面上是純資料（key/value），不是排版好的網頁，也和「部署」是兩件事。",
  },

  gas: {
    question: "這條「GAS 自動推播」最關鍵的一步，是哪一段在做事？",
    options: [
      { text: "UrlFetchApp.fetch(...) —— 呼叫別人的 API 把訊息 POST 出去", correct: true },
      { text: "把程式碼存檔", correct: false },
      { text: "把網頁部署到 GitHub Pages", correct: false },
    ],
    explainOk:
      "沒錯！核心就是用 GAS 去『呼叫 API（POST）』。觸發只是決定「什麼時候跑」，真正把通知送出去的是那一行 fetch。",
    explainNo: "再看一次程式碼：真正把訊息送出去的，是呼叫 Webhook API 的那一行。",
  },

  huggingface: {
    question: "為什麼 AI App 常常用 Hugging Face Spaces，而不是放 GitHub Pages？",
    options: [
      { text: "因為 AI 要跑模型（後端運算），GitHub Pages 只能放純靜態網頁", correct: true },
      { text: "因為 GitHub Pages 要收費", correct: false },
      { text: "因為 AI App 不能有網址", correct: false },
    ],
    explainOk:
      "正解！GitHub Pages 只送靜態檔案，不會幫你跑程式；AI 需要後端運算，所以用會幫你跑模型的 Spaces。挑對『部署平台』要看你的 App 需不需要後端。",
    explainNo: "回想第 2 關：GitHub Pages 只送靜態檔案、不跑後端；而 AI 需要跑模型（運算）。",
  },

  selfhost: {
    question: "你的內部小工具在市府內網跑得好好的，長官說「乾脆開放給市民用」。你該怎麼回應？",
    options: [
      { text: "對外提供服務要先經資安評估與核准，並交由資訊單位在受管控環境提供", correct: true },
      { text: "直接把機關防火牆全部打開就好", correct: false },
      { text: "把電腦搬回家接網路，比較快", correct: false },
    ],
    explainOk:
      "正解！內網自用是你的權責範圍；一旦對外，就牽涉資安、個資、維運責任與長期維護 —— 那是機關層級的決定，要走正式程序、由資訊單位承接。",
    explainNo: "再想想：對外開放不是把防火牆打開就好，它牽涉資安責任與長期維運，屬於機關層級的決定。",
  },

  docker: {
    question: "Docker 最主要幫你解決什麼問題？",
    options: [
      { text: "把 App 和它需要的環境一起打包，避免「我電腦能跑、你那邊壞掉」", correct: true },
      { text: "讓網頁的顏色變好看", correct: false },
      { text: "自動幫你買一台伺服器", correct: false },
    ],
    explainOk:
      "正是！Docker 把環境一起帶著走，任何裝了 Docker 的機器都能跑出一致結果。這也是雲端部署超常用它的原因。",
    explainNo: "回想剛剛的互動：沒把環境打包，換台機器就壞了。Docker 就是要解決這個。",
  },

  exeQueue: {
    question: "什麼情況最適合用「工作佇列（Queue）」？",
    options: [
      { text: "任務很多或很耗時，想讓使用者不用站著等、系統也不會被塞爆", correct: true },
      { text: "想讓網站的字變大", correct: false },
      { text: "只有在部署到 GitHub Pages 時才需要", correct: false },
    ],
    explainOk:
      "正解！把耗時或大量的任務丟進佇列、由背景慢慢消化，使用者能馬上得到回應，系統也更穩、可重試。這一關你把 EXE 與 Queue 都學起來了 🎉",
    explainNo: "回想剛剛的模擬：佇列的重點是『排隊慢慢處理』，讓使用者不用等、系統不被瞬間塞爆。",
  },
};
