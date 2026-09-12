# 🚀 Zero to Deploy — 從零到部署

一個用**互動闖關**的方式，教「網頁部署概念」的教學網站。學生不是被動看投影片，而是在網頁上邊操作邊學，最後**真的把自己的網站部署上線**。

技術棧：**React + Vite + Tailwind CSS**，RWD 友善，色系以 `#26418F` 藍為主，字體 Noto Sans TC。

> 這個網站本身就是用 **GitHub Pages** 部署的 —— 也就是它教你的第一件事。

---

## 目前內容（8 關全數完成）

| 關卡 | 主題 | 互動設計重點 |
|------|------|----------|
| 1 · 網站是怎麼被看到的？ | 部署核心概念 | request/response 動畫、把檔案「放上伺服器」的拖拉互動 |
| 2 · **GitHub Pages**（旗艦） | 免費、純滑鼠部署靜態網站 | 概念測驗 → **站內模擬 GitHub 介面**點一遍 → 去真的 GitHub 做並**貼網址驗證** |
| 3 · API 基礎 | 前後端怎麼對話 | 餐廳點餐比喻 + 可切換 endpoint 的 API 測試器 + 真的打公開 API |
| 4 · GAS + API 推送 | 用 Google Apps Script 自動推播 | 設定訊息/觸發 → 看封包送達模擬聊天室 + 可複製的 GAS 程式碼 |
| 5 · AI 原生 + Hugging Face | 把 AI 應用一鍵部署 | 模擬建立 Space → 可互動的情感分析 AI Demo + 真的逛 HF Spaces |
| 6 · Windows / Linux 自架 | 用自己的電腦當伺服器 | server/防火牆/port forwarding 三開關挑戰（分階段錯誤教學）+ `python -m http.server` |
| 7 · Docker | 把 App 和環境一起打包 | 選擇是否打包環境 → 在別台機器 run，體會可攜性 + Dockerfile 範例 |
| 8 · EXE / Queue | 打包成程式、排隊處理任務 | 工作佇列模擬器（送任務→worker 消化）+ EXE 打包示意 |

**教學設計核心**：概念 → 站內模擬（先在互動介面練一次，零風險）→ 真實實作（去平台親手做）→ 驗證過關拿徽章。全程盡量走「GUI／點選」路線，新手友善。完成 8 關即點亮整張地圖與所有徽章。

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
  components/            # TopBar / Home / MapView(蜿蜒地圖) / Quiz / StepBar / Browser / DoneScreen
  levels/                # 8 關各自一個檔案
    IntroLevel.jsx       GitHubPagesLevel.jsx  ApiLevel.jsx
    GasLevel.jsx         HuggingFaceLevel.jsx  SelfHostLevel.jsx
    DockerLevel.jsx      ExeQueueLevel.jsx
```

---

## 怎麼新增一關（把大綱其他主題補上）

1. 在 `src/levels/` 新增 `YourLevel.jsx`，元件接收 `ctx` prop：

   ```jsx
   export default function DockerLevel({ ctx }) {
     // 用 components/ 裡的 Quiz、StepBar、DoneScreen、Browser 組互動內容
     // 完成時：ctx.complete({ id, icon, name, desc })  ← 記錄過關並發徽章
     // 導覽：ctx.goMap() / ctx.navigate("#/level/xxx")
   }
   ```

2. 在 `src/App.jsx` 的 `LEVELS` 對照表加入 `"docker": DockerLevel`。
3. 在 `src/data/levels.js` 把該關的 `status` 從 `"soon"` 改成 `"ready"`。

關卡就會自動出現在地圖上、可以點、也會算進進度。

---

## 授權

見 [LICENSE](./LICENSE)。
