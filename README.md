# 🚀 Zero to Deploy — 從零到部署

一個用**互動闖關**的方式，教「網頁部署概念」的教學網站。學生不是被動看投影片，而是在網頁上邊操作邊學，最後**真的把自己的網站部署上線**。

技術棧：**React + Vite + Tailwind CSS**，RWD 友善，色系以 `#26418F` 藍為主，字體 Noto Sans TC。

案例以**公務／行政情境**設計（活動公告、政府開放資料、民眾申辦通知、民意情緒分析、機關內網工具等）。開始闖關前會先出現**風險預告書**（需勾選確認），每一關頂部也都附上該部署方式的**風險備注**，提醒留意個資、資安與「上傳前先確認資料可對外」。

> 這個網站本身就是用 **GitHub Pages** 部署的 —— 也就是它教你的第一件事。

---

## 課程結構（9 關，分成兩階段）

主線是一個小工具的生命週期：**你自己動手做 → 好用了就交給資訊單位納管**。

### 🙋 納管前：你可以自己做的
| 關卡 | 主題 | 互動設計重點 |
|------|------|----------|
| 1 · 網站是怎麼被看到的？ | 部署核心概念 + **前端／後端** | 可單步的 request/response 動畫（有方向箭頭與標示封包）→ 用「公所前台 vs 後台」教前端／後端 + 六題分類 → 小測驗 → 把檔案「放上伺服器」的拖拉互動 |
| 2 · **GitHub Pages**（旗艦） | 免費、純滑鼠部署靜態網站 | 概念測驗 → **站內模擬 GitHub 介面**點一遍 → 去真的 GitHub 做並**貼網址驗證** |
| 3 · 這個我可以自己做嗎？ | 界線判斷 | 認五條紅線 + 6 題公務情境判斷（可自己做／先問資訊單位／不該這樣做） |
| 4 · API 基礎 | 前後端怎麼對話 | 餐廳點餐比喻 + 可切換 endpoint 的 API 測試器 + 真的打政府開放資料 |
| 5 · GAS + API 推送 | 民眾申辦自動通知承辦 | 設定訊息/觸發 → 看封包送達模擬群組 + 可複製的 GAS 程式碼 |
| 6 · AI 原生 + Hugging Face | 把 AI 應用一鍵部署 | 模擬建立 Space → 可互動的民意情緒分析 Demo |

> **為什麼「界線判斷」排在第 3 關而不是第 1 關**：這一關要學生判斷「這件事我能不能自己做」，
> 而判斷的前提是先知道「放上網 = 全世界都看得到」。所以先讓他們在第 2 關親手把一頁公開上線，
> 第 3 關再回頭問「那什麼不該這樣放？」—— 此時「公開」是他剛剛親眼看到的事實，而不是一個名詞。
> 安全性由**風險預告書**（進入任何關卡前強制閱讀，內含五條紅線速查卡）與各關頂部的風險備注負責。

### 🏛️ 交給資訊單位納管 → 納管後（偏正式系統，了解即可）
| 關卡 | 主題 | 互動設計重點 |
|------|------|----------|
| 7 · Windows / Linux 自架 | **內網自用 vs 對外** | 三個開關 + 分別測「同仁從內網連」與「民眾從外網連」，帶出對外需資安評估與核准 |
| 8 · Docker | 把 App 和環境一起打包 | 選擇是否打包環境 → 在別台機器 run，體會可攜性 |
| 9 · EXE / Queue | 打包成程式、排隊處理任務 | 工作佇列模擬器 + EXE 打包示意 |

**教學設計核心**：概念 → 站內模擬（零風險先練一次）→ 真實實作（去平台親手做）→ 驗證過關拿徽章。全程盡量走「GUI／點選」路線。

### 導覽
全站四個區塊都常駐在導覽列上：**首頁 · 闖關地圖 · 選型指南 · 名詞小教室**。
桌機是頂端分頁列，手機是底部分頁列（拇指按得到），目前所在分頁以顏色 + 色條 + `aria-current` 標示。
關卡頁另有麵包屑（第 N / 9 關、所屬階段）與底部的上一關／下一關。

### 另外兩個常駐資源
- **🧭 選型指南**（`#/guide`）：依難易度、靜態/動態、資料界線、開放範圍、費用、維護比較各種部署方式，附「幫我選」推薦。
- **📇 名詞小教室**（`#/terms`）：10 張概念卡（快取、佇列、CDN、冪等、日誌監控、環境、備份、Rollback、登入vs權限、HTTPS），其中快取與冪等有小互動。

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
  data/terms.js          # 名詞小教室的概念卡
  components/
    Nav.jsx              # 全站導覽（桌機頂端分頁列 / 手機底部分頁列）
    Level.jsx            # 關卡共用骨架（步驟、進度條、回上一步、過關畫面）
    TopBar / Home / MapView(兩階段蜿蜒地圖) / Guide / TermsPage
    RiskNotice / RiskNote / EvalBar / Quiz / StepBar / Browser / DoneScreen
  levels/                # 9 關各自一個檔案
    BoundaryLevel.jsx    IntroLevel.jsx        GitHubPagesLevel.jsx
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
       <Level ctx={ctx} badge={BADGES.yourBadge}
         done={{
           icon: "🎉", title: "過關標題", text: "過關說明",
           secondary: { label: "回地圖", onClick: () => ctx.goMap() },
           primary: { label: "看看下一關 →", onClick: () => ctx.goMap() },
         }}
         steps={[
           ({ next })   => <ConceptStep onNext={next} />,
           ({ finish }) => <RealStep onFinish={finish} />,
         ]}
       />
     );
   }
   ```

   `<Level>` 會處理步驟切換、進度條、「回上一步」、過關畫面與發徽章。

2. 在 `src/App.jsx` 的 `LEVELS` 對照表加入 `"your-id": YourLevel`。
3. 在 `src/data/levels.js`：
   - `mapOrder` 加一筆（含 `phase: "pre" | "post"`、可選 `short` 地圖短標題）
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

`tests/e2e.mjs` 會把 **9 關全部走完一遍**（含每關的互動、測驗與過關），並檢查「回上一步」與進度是否到 100%。用來確認改動沒有弄壞任何一關。

```bash
npm i -D playwright          # 僅測試需要，未列入 dependencies 以免拖慢部署
npx playwright install chromium
npm run build && npm run preview   # 另開一個終端機
npm run test:e2e                   # 預設連 http://localhost:4173
```

可用 `BASE_URL` 指定其他位址，例如 `BASE_URL=http://localhost:8000 npm run test:e2e`。
