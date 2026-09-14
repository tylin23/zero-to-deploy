// 所有關卡的測驗題集中在這裡，方便老師整批檢視與調整文字。
// 每題：question 題目／options 選項（correct 標出正解）／explainOk 答對說明／explainNo 答錯提示。
export const QUIZZES = {
  landscape: {
    question:
      "同仁在 AI 工具裡做了一頁統計圖表，按「發布」拿到連結，貼進科內的 LINE 群組。下面哪一句最正確？",
    options: [
      { text: "拿到那個連結的人都打得開，被轉傳出去就收不回來了", correct: true },
      { text: "只有 LINE 群組裡的 8 個人看得到，群組外的人打不開", correct: false },
      { text: "沒有那個 AI 服務帳號的人打不開", correct: false },
    ],
    explainOk:
      "沒錯。已發布的連結通常是「有連結就能看」，不需要帳號、也不管你貼在哪個群組。所以決定要不要按發布之前，先問自己：這份內容被轉傳出去會怎樣？",
    explainNo:
      "再想想：連結本身就是通行證。貼在哪個群組、對方有沒有帳號，都擋不住有人把網址複製出去。",
  },

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

  hosting: {
    question:
      "你把同一個 repo 同時接上 GitHub Pages 和 Netlify，拿到兩個網址。這說明了什麼？",
    options: [
      { text: "檔案是你自己的，被綁住的只是那個網址 —— 換平台的成本很低", correct: true },
      { text: "你的網站現在有兩份，改了要記得改兩次", correct: false },
      { text: "同一個 repo 不能接兩家，一定會有一邊壞掉", correct: false },
    ],
    explainOk:
      "正解！兩家都是去你的 repo 抓同一份檔案，所以改一次、兩邊都會更新。這也是為什麼「把檔案放在自己的 repo 裡」比「東西留在某個平台裡」更有彈性 —— 第 1 關的全景就是照這條軸排的。",
    explainNo:
      "再想想：兩家都是「去你的 GitHub repo 抓檔案」，來源只有一份。所以不會有兩份要各改一次的問題，也不會互相打架。",
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
    explainNo: "回想第 3 關：GitHub Pages 只送靜態檔案、不跑後端；而 AI 需要跑模型（運算）。",
  },

  firebase: {
    question:
      "有人把 Firebase 的規則設成 allow read, write: if request.auth != null。這樣安全嗎？",
    options: [
      { text: "不安全 —— 任何人辦一個帳號登入，就能讀寫所有人的資料", correct: true },
      { text: "安全 —— 要登入才能用，等於只有自己人進得來", correct: false },
      { text: "安全 —— 因為 apiKey 沒有公開", correct: false },
    ],
    explainOk:
      "正解！它只檢查「有沒有登入」，沒檢查「是不是你的資料」。這是最常見的錯誤設定 —— 要連 request.auth.uid 和資料的擁有者一起比對才行。「你是誰」和「你能做什麼」是兩件事。",
    explainNo:
      "再想想：登入這件事誰都能做，辦個帳號就有。而且 Firebase 的 apiKey 本來就是公開放在網頁裡的，它是門牌不是鑰匙 —— 真正的門鎖只有安全規則那一道。",
  },

  flask: {
    question:
      "你在辦公室的電腦跑起 Flask，終端機印出 Running on http://127.0.0.1:5000。你把這個網址用 LINE 傳給隔壁同事，他說打不開。為什麼？",
    options: [
      {
        text: "127.0.0.1 的意思是「我自己這台電腦」—— 同事的瀏覽器是去找他自己的電腦，那上面根本沒有東西在跑",
        correct: true,
      },
      { text: "因為你沒有買網域，要先買了網域才連得到", correct: false },
      { text: "因為 Flask 一次只能有一個人連線，你已經佔用了", correct: false },
    ],
    explainOk:
      "正解！127.0.0.1（也叫 localhost）不是「你的電腦」的意思，是「我自己這台」的意思 —— 每台電腦講這個位址，指的都是它自己。所以同事打開它，等於叫他自己的電腦去找一個沒在跑的服務。要讓同事連得到，你得先改成 host=\"0.0.0.0\"，再給他你的內網位址（192.168.x.x），而且你們要在同一個網路上。",
    explainNo:
      "再想一次：問題不在網域，也不在連線人數。關鍵是 127.0.0.1 這個位址本身 —— 它永遠指「正在打開它的那台電腦」。同事的電腦上沒有跑 Flask，所以他找不到任何東西。",
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
    question: "你把月報表工具修好了一個匯出失敗的錯誤，要發 v1.2.1。更新說明怎麼寫最好？",
    options: [
      {
        text: "修正：承辦人欄位空白時，整份月報表會匯出失敗",
        correct: true,
      },
      { text: "fix: null check in exportReport()", correct: false },
      { text: "修正一些問題，建議更新", correct: false },
    ],
    explainOk:
      "正解！changelog 是寫給「使用的人」看的 —— 要讓他回答得出「這關我什麼事、我要不要更新」。同事看到這條，馬上知道上週那次匯不出來就是這個原因。",
    explainNo:
      "再想想：看的人是不會寫程式的同事。函式名稱他看不懂，「修正一些問題」則等於什麼都沒說 —— 他無從判斷要不要更新。",
  },
};
