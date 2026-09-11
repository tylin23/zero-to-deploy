# 🚀 Zero to Deploy — 從零到部署

一個用**互動闖關**的方式，教「網頁部署概念」的教學網站。學生不是被動看投影片，而是在網頁上邊操作邊學，最後**真的把自己的網站部署上線**。

> 這個網站本身就是用 **GitHub Pages** 部署的 —— 也就是它教你的第一件事。

---

## 目前內容

| 關卡 | 內容 | 互動設計 |
|------|------|----------|
| 第 1 關 · 網站是怎麼被看到的？ | 部署核心概念 | request/response 動畫、把檔案「放上伺服器」的拖拉互動 |
| 第 2 關 · **GitHub Pages**（旗艦） | 免費、純滑鼠部署靜態網站 | ① 概念小測驗 ② **站內模擬 GitHub 介面**點一遍 ③ 帶去真的 GitHub 做並**貼網址驗證過關** |
| 第 3～8 關 | API / GAS / Hugging Face / 自架 / Docker / EXE·Queue | 🔒 即將推出（已在地圖上預留位置） |

**教學設計核心**：概念 → 站內模擬（先在假介面練一次，零風險）→ 真實實作（去平台親手做）→ 驗證過關拿徽章。全程走「網頁 GUI」路線，新手不用打任何指令。

進度與徽章存在瀏覽器 `localStorage`，不需登入、不需後端。

---

## 本機預覽

因為用了 ES modules，請用一個本機伺服器打開（不要直接雙擊 `index.html`）：

```bash
# 任選一種
python3 -m http.server 8000
# 或
npx serve
```

然後打開 http://localhost:8000

---

## 部署到 GitHub Pages（用滑鼠點就好）

1. 把這個專案 push 到一個 **Public** 的 GitHub repository。
2. 到 repo 的 **Settings → Pages**。
3. **Source** 選 **Deploy from a branch**，Branch 選你的主分支（`main` 或 `master`）、資料夾選 `/ (root)`，按 **Save**。
4. 等 1～2 分鐘，網站就會出現在 `https://<你的帳號>.github.io/<repo 名稱>/`。

> 專案根目錄的 `.nojekyll` 會讓 GitHub Pages 原樣提供檔案，不經過 Jekyll 處理。

---

## 專案結構

```
index.html                  # 外殼：頂部列、進度條、主題切換
.nojekyll                   # 讓 Pages 不跑 Jekyll
assets/
  css/style.css             # 設計系統（含深淺色、RWD）
  js/
    app.js                  # 進入點：主題、進度、路由（首頁/地圖/關卡）
    state.js                # 進度與徽章（localStorage）
    ui.js                   # 小工具：DOM 建立、toast、過關彩帶
    levelkit.js             # 關卡共用元件：步驟條、測驗、過關畫面
    levels/
      index.js              # 關卡註冊表（地圖順序、可玩/即將推出）
      intro.js              # 第 1 關
      githubPages.js        # 第 2 關（旗艦）
```

---

## 怎麼新增一關（把大綱其他主題補上）

1. 在 `assets/js/levels/` 新增 `yourLevel.js`，`export default` 一個物件：

   ```js
   export default {
     id: "docker",
     emoji: "🐳",
     title: "Docker",
     tagline: "把 App 和環境一起打包",
     render(root, ctx) {
       // 用 ui.js / levelkit.js 的工具組出互動內容
       // 完成時：ctx.complete({ id, icon, name, desc })  ← 記錄過關並發徽章
       // 導覽：ctx.goMap() / ctx.navigate("#/level/xxx")
     },
   };
   ```

2. 在 `assets/js/levels/index.js`：
   - `import` 進來、加進 `playable`
   - 在 `mapOrder` 對應那一關把 `status` 從 `"soon"` 改成 `"ready"`

就會自動出現在地圖上、可以點、也會算進進度。

---

## 授權

見 [LICENSE](./LICENSE)。
