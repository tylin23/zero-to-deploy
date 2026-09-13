# 🚀 Zero to Deploy — 從零到部署

一個用**互動闖關**的方式，教「網頁部署概念」的教學網站。學生不是被動看投影片，而是在網頁上邊操作邊學，最後**真的把自己的網站部署上線**。

技術棧：**React + Vite + Tailwind CSS**，RWD 友善，色系以 `#26418F` 藍為主，字體 Noto Sans TC。

案例以**市政府業務情境**設計（市民健康講座公告、市府開放資料看板、市政信箱陳情自動通知、1999 民意情緒分析、局處內網工具等）。開始闖關前會先出現**風險預告書**（需勾選確認），每一關頂部也都附上該部署方式的**風險備注**，提醒留意個資、資安與「上傳前先確認資料可對外」。

> 這個網站本身就是用 **GitHub Pages** 部署的 —— 也就是它教你的第一件事。

---

## 課程結構（10 關，分成兩階段）

主線是一個小工具的生命週期：**你自己動手做 → 好用了就交給資訊單位納管**。

### 🙋 納管前：你可以自己做的

| 關卡                         | 主題                                             | 互動設計重點                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 · 上線的方法有哪些？       | **全景**：AI 工具的分享連結 → 機關正式系統       | 從學員已經有的經驗切入：**Claude Artifacts / Gemini Canvas / ChatGPT Sites** 三張卡點開看「它幫你做了什麼」→ 歸納出部署就是三件事（檔案放別的地方、機器一直開著、給你網址）→ 四個市政情境判斷「分享連結夠不夠用」→ 依「要自己顧多少」排序的全景清單，每項可跳到對應關卡 |
| 2 · 我做好了，怎麼給別人用？ | **本機 vs 上線** + 部署核心概念 + **前端／後端** | 從「AI 幫我寫好 HTML，雙擊能跑，然後呢」出發：四種土法煉鋼的做法各自會出什麼事 → **`file://` 與 `https://` 網址列對照** → 可單步的 request/response 動畫 → 用「市府前台 vs 後台」教前端／後端 + 六題分類 → 小測驗 → 把檔案「放上伺服器」的拖拉互動                                                                                                |
| 3 · **GitHub Pages**（旗艦） | 免費、純滑鼠部署靜態網站                         | 概念測驗 → **站內模擬 GitHub 介面**點一遍 → 去真的 GitHub 做並**貼網址驗證**（範本是一頁 **Portaly 風格的電子名片**，主角是臺北市吉祥物熊讚——頭像、聯絡方式 icon、連結按鈕，RWD、單一檔案無外部資源；學生做完不用刪 repo，改成自己的就能一直用。另附**「要傳自己做的檔案？先看這 5 個雷」**——首頁檔名、大小寫、絕對路徑、中文檔名、需不需要後端） |
| 4 · 這個我可以自己做嗎？     | 界線判斷                                         | 認五條紅線 + 6 題市政情境判斷（市民講座公告、名冊誤傳公開 repo、1999 陳情、跨局處系統…）（可自己做／先問資訊單位／不該這樣做）                                                                                                                                                                                                                    |
| 5 · API 基礎                 | 前後端怎麼對話                                   | 餐廳點餐比喻 + 可切換 endpoint 的 API 測試器（全部站點／只看大安區／只看還有車的站）+ 真的打 YouBike 即時資訊，做出一頁可上傳的即時看板                                                                                                                                                                                                                                                        |
| 6 · GAS + API 推送           | 市民向市政信箱陳情 → 自動通知承辦科室            | 設定訊息/觸發 → 看封包送達模擬群組 + 可複製的 GAS 程式碼                                                                                                                                                                                                                                                                                          |
| 7 · AI 原生 + Hugging Face   | 把 AI 應用一鍵部署                               | 模擬建立 Space → 可互動的「市政信箱意見情緒分析」Demo                                                                                                                                                                                                                                                                                             |

> **為什麼「界線判斷」排在第 4 關而不是最前面**：這一關要學生判斷「這件事我能不能自己做」，
> 而判斷的前提是先知道「放上網 = 全世界都看得到」。所以先讓他們在第 3 關親手把一頁公開上線，
> 第 4 關再回頭問「那什麼不該這樣放？」—— 此時「公開」是他剛剛親眼看到的事實，而不是一個名詞。
> 安全性由**風險預告書**（進入任何關卡前強制閱讀，內含五條紅線速查卡）與各關頂部的風險備注負責。

> **為什麼第 1 關從 AI 工具講起**：非資訊專業的同仁，第一次「上線」多半發生在 AI 對話框裡 ——
> 做好一頁東西、按一下分享，同事就打得開了。從這個他們已經有的經驗切進「部署」這個詞，
> 比先講伺服器容易得多；而它的限制（連結轉傳就收不回來、東西在平台手上、不能綁自己的網址）
> 正好就是後面每一關要解決的問題。
> ⚠️ 這三家平台的功能名稱與細節變動很快（相關文案集中在 `src/levels/LandscapeLevel.jsx` 的
> `AI_TOOLS`），上課前建議對照各平台當下的說明再確認一次。

### 🏛️ 交給資訊單位納管 → 納管後（偏正式系統，了解即可）

| 關卡                     | 主題                     | 互動設計重點                                                                      |
| ------------------------ | ------------------------ | --------------------------------------------------------------------------------- |
| 8 · Windows / Linux 自架 | **內網自用 vs 對外**     | 三個開關 + 分別測「同仁從市府內網連」與「市民從外網連」，帶出對外需資安評估與核准 |
| 9 · Docker               | 把 App 和環境一起打包    | 選擇是否打包環境 → 在別台機器 run，體會可攜性                                     |
| 10 · EXE / Queue         | 打包成程式、排隊處理任務 | 工作佇列模擬器 + EXE 打包示意                                                     |

**教學設計核心**：概念 → 站內模擬（零風險先練一次）→ 真實實作（去平台親手做）→ 驗證過關拿徽章。全程盡量走「GUI／點選」路線。

### 導覽

全站四個區塊都常駐在導覽列上：**首頁 · 闖關地圖 · 選型指南 · 名詞小教室**。
桌機是頂端分頁列，手機是底部分頁列（拇指按得到），目前所在分頁以顏色 + 色條 + `aria-current` 標示。
關卡頁另有麵包屑（第 N / 10 關、所屬階段）與底部的上一關／下一關。

### 另外兩個常駐資源

- **🧭 選型指南**（`#/guide`）：依難易度、靜態/動態、資料界線、開放範圍、費用、維護比較各種部署方式，附「幫我選」推薦。表裡也包含**沒有獨立關卡的「AI 工具的分享連結」**（定義在 `src/data/levels.js` 的 `EXTRA_METHODS`，點名稱會連到第 1 關）。
- **📇 名詞小教室**（`#/terms`）：11 張概念卡（快取、佇列、CDN、冪等、日誌監控、環境、備份、Rollback、登入vs權限、HTTPS、CORS 跨來源限制），其中快取與冪等有小互動。

進度與徽章存在瀏覽器 `localStorage`，不需登入、不需後端。

---

## 本機開發

```bash
npm install       # 安裝套件
npm run dev       # 開發伺服器（http://localhost:5173）
npm run build     # 產出正式版到 dist/
npm run preview   # 預覽 dist/
```

需要 Node.js 18 以上。

---

## 部署到 GitHub Pages

因為是 React（Vite）專案，需要「建置」後才能上線，本專案已附好自動化流程：

1. 把程式碼 push 到 GitHub 的預設分支（`main` 或 `master`）。
2. 到 repo 的 **Settings → Pages → Build and deployment → Source**，選 **GitHub Actions**。
3. 之後每次 push，`.github/workflows/deploy.yml` 會自動 `npm run build` 並部署，
   網站會出現在 `https://<你的帳號>.github.io/<repo 名稱>/`。

> `vite.config.js` 設了 `base: "./"`（相對路徑），所以不論部署在根網域或子路徑都能正確載入資源。

---

## 專案結構

```
index.html               # Vite 進入點
vite.config.js           # base: "./"（相對路徑，方便 Pages）
tailwind.config.js       # 顏色對應 CSS 變數、字體、動畫
postcss.config.js
.github/workflows/deploy.yml   # 自動建置並部署到 Pages
src/
  main.jsx               # React 進入點
  App.jsx                # 路由（首頁 / 地圖 / 關卡）與外框
  index.css              # Tailwind 指令 + 藍色調色盤（CSS 變數，深淺色）
  state/progress.jsx     # 進度／徽章／主題 Context（localStorage）
  hooks/useHashRoute.js  # 極簡 hash 路由
  data/levels.js         # 關卡地圖資料與徽章定義
  lib/confetti.js        # 過關彩帶
  content/quizzes.js     # 所有測驗題（集中管理，方便整批調整）
  content/levelCopy.js   # 各關過關畫面的文案
  content/starterCard.js # 第 3 關給學生下載的電子名片範本（單一 index.html）
  data/terms.js          # 名詞小教室的概念卡
  components/
    Nav.jsx              # 全站導覽（桌機頂端分頁列 / 手機底部分頁列）
    Level.jsx            # 關卡共用骨架（步驟、進度條、回上一步、過關畫面）
    TopBar / Home / MapView(兩階段蜿蜒地圖) / Guide / TermsPage
    RiskNotice / RiskNote / EvalBar / Quiz / StepBar / Browser / DoneScreen
  levels/                # 10 關各自一個檔案
    LandscapeLevel.jsx   BoundaryLevel.jsx     IntroLevel.jsx
    GitHubPagesLevel.jsx
    ApiLevel.jsx         GasLevel.jsx          HuggingFaceLevel.jsx
    SelfHostLevel.jsx    DockerLevel.jsx       ExeQueueLevel.jsx
```

---

## 怎麼新增一關

1. 在 `src/levels/` 新增 `YourLevel.jsx`，用共用的 `<Level>` 骨架：

   ```jsx
   import Level from "../components/Level.jsx";
   import { BADGES } from "../data/levels.js";

   export default function YourLevel({ ctx }) {
     return (
       <Level
         ctx={ctx}
         badge={BADGES.yourBadge}
         done={{
           icon: "🎉",
           title: "過關標題",
           text: "過關說明",
           secondary: { label: "回地圖", onClick: () => ctx.goMap() },
           primary: { label: "看看下一關 →", onClick: () => ctx.goMap() },
         }}
         steps={[({ next }) => <ConceptStep onNext={next} />, ({ finish }) => <RealStep onFinish={finish} />]}
       />
     );
   }
   ```

   `<Level>` 會處理步驟切換、進度條、「回上一步」、過關畫面與發徽章。

2. 在 `src/App.jsx` 的 `LEVELS` 對照表加入 `"your-id": YourLevel`。
3. 在 `src/data/levels.js`：
   - `mapOrder` 加一筆（含 `phase: "pre" | "post"`、可選 `short` 地圖短標題）
     ⚠️ 插在中間會讓所有「第 N 關」的編號位移，教材文案裡有寫死的編號 ——
     改完請 `grep -rn "第 [0-9] 關" src` 一起更新，`tests/e2e.mjs` 也有一條把順序釘住的斷言
   - `BADGES` 加徽章、`RISKS` 加該關的風險備注
   - 若是部署方式，`EVAL` 再加上難易度等評估維度
4. 測驗題寫在 `src/content/quizzes.js`（用 `<Quiz {...QUIZZES.yourKey} onCorrect={...} />`）；
   過關文案寫在 `src/content/levelCopy.js`（用 `done={{ ...DONE.yourKey }}`，
   按鈕若與預設的「回地圖／看看下一關」相同可省略）。

關卡就會自動出現在地圖上、可以點、也會算進進度。

---

## 授權

見 [LICENSE](./LICENSE)。

---

## 端對端測試

`tests/e2e.mjs` 會把 **10 關全部走完一遍**（含每關的互動、測驗與過關），並檢查「回上一步」與進度是否到 100%。用來確認改動沒有弄壞任何一關。

```bash
npm i -D playwright          # 僅測試需要，未列入 dependencies 以免拖慢部署
npx playwright install chromium
npm run build && npm run preview   # 另開一個終端機
npm run test:e2e                   # 預設連 http://localhost:4173
```

可用 `BASE_URL` 指定其他位址，例如 `BASE_URL=http://localhost:8000 npm run test:e2e`。
