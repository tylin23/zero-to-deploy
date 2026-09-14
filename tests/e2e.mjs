import pkg from "playwright";
import fs from "node:fs";
import { STARTER_HTML } from "../src/content/starterCard.js";
import { DASHBOARD_HTML } from "../src/content/dashboardPage.js";
const { chromium } = pkg;
const base = process.env.BASE_URL || "http://localhost:4173";
const errs = [];
const b = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await b.newContext();
await ctx.addInitScript(() =>
  localStorage.setItem(
    "ztd_progress_v1",
    JSON.stringify({ completed: {}, badges: {}, theme: null, riskAck: true })
  )
);
const p = await ctx.newPage();
p.on("pageerror", (e) => errs.push("PAGEERR " + e.message));
p.on("console", (m) => {
  if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errs.push("CONSOLE " + m.text());
});
// goto 到「一模一樣的 hash」對 SPA 來說不算換頁，元件狀態會被保留，
// 所以先繞過地圖，確保每次都是乾淨地重新掛載這一關。
const go = async (id) => {
  await p.goto(`${base}/index.html#/map`, { waitUntil: "domcontentloaded" });
  await p.goto(`${base}/index.html#/level/${id}`, { waitUntil: "networkidle" });
};
const st = async (n, f) => {
  try {
    await f();
    console.log("✓", n);
  } catch (e) {
    console.log("✗", n, "—", e.message.split("\n")[0]);
    errs.push(n);
  }
};
const B = (t) => p.locator("button", { hasText: t });

await st("1 方法全景（含 AI 工具）", async () => {
  await go("landscape");
  // 步驟 1：三張 AI 工具卡都要點開
  await p.waitForSelector("text=在 AI 工具裡按下");
  // 一次只會展開一張，所以「入口在哪」要在各自展開的當下就檢查
  for (const [id, last] of [["claude", "Artifacts"], ["gemini", "Canvas"], ["chatgpt", "網站（Sites）"]]) {
    await p.click(`[data-tool=${id}] button`);
    await p.waitForSelector(`[data-tool=${id}] [aria-expanded=true]`, { timeout: 2500 });
    // 截圖是選配，文字路徑不能少
    await p.locator(`[data-tool=${id}] >> text=入口在哪`).first().waitFor({ state: "visible", timeout: 2000 });
    await p.locator(`[data-tool=${id}] >> text=${last}`).first().waitFor({ state: "visible", timeout: 2000 });
    // 截圖沒放時整塊不顯示，不能留破圖
    const bad = await p.evaluate(() =>
      [...document.querySelectorAll("figure img")].filter((i) => i.complete && i.naturalWidth === 0).length
    );
    if (bad) throw new Error(id + " 留了破圖");
  }
  await p.waitForSelector("text=三家做的其實是同樣三件事", { timeout: 2500 });
  await B("那為什麼還要學別的").click();

  // 步驟 2：四個情境都要判斷
  const answers = [
    ["meeting", "✅ 分享連結就夠用"],
    ["official", "⚠️ 不夠，要更正式的做法"],
    ["prototype", "✅ 分享連結就夠用"],
    ["pii", "⚠️ 不夠，要更正式的做法"],
  ];
  for (const [id, label] of answers) {
    await p.locator(`[data-case=${id}] button`, { hasText: label }).click();
    await p.waitForSelector(`[data-case=${id}] >> text=判斷正確`, { timeout: 2500 });
  }
  await B("看看全部的選項").click();

  // 步驟 3：全景清單 + 測驗
  await p.waitForSelector("[data-scope=ai]");
  const n = await p.locator("[data-scope]").count();
  if (n !== 9) throw new Error("全景清單應該有 9 項，實際 " + n);
  await p.click("[data-scope=github-pages] button");
  await p.waitForSelector("[data-scope=github-pages] >> text=第 3 關會教這個", { timeout: 2500 });
  await p.click("text=拿到那個連結的人都打得開");
  await p.waitForSelector("text=已發布的連結通常是", { timeout: 2500 });
  await B("完成這一關").click();
  await p.waitForSelector("text=全景視野達成", { timeout: 3000 });
});

await st("4 界線判斷", async () => {
  await go("boundary");
  await p.click("text=來判斷幾個實際情境");
  const ans = [
    "✅ 可以自己做",
    "⛔ 不該這樣做",
    "✅ 可以自己做",
    "⛔ 不該這樣做",
    "⚠️ 先問資訊單位",
    "✅ 可以自己做",
  ];
  for (let i = 0; i < 6; i++) {
    await p.click(`text=${ans[i]}`);
    await p.waitForSelector("text=判斷正確", { timeout: 2500 });
    await p.click(i === 5 ? "text=完成這一關" : "text=下一題");
  }
  await p.waitForSelector("text=界線意識達成", { timeout: 3000 });
});

await st("2 網站怎麼被看到（含前端／後端）", async () => {
  await go("intro");
  // 第一步：本機 HTML vs 部署後的網址 —— 四個做法都要點過
  await p.waitForSelector("text=在我電腦上跑得好好的");
  for (const id of ["send", "share", "come", "deploy"]) {
    await p.click(`[data-try=${id}] button`);
  }
  await B("懂了，那網址是怎麼運作的？").click();

  // 第二步：request/response 動畫
  await p.waitForSelector("text=按「播放」看看資料怎麼跑");
  await B("▶ 播放").click();
  await p.waitForSelector("text=瀏覽器送出請求", { timeout: 4000 });
  await p.waitForSelector("text=瀏覽器把收到的檔案", { timeout: 12000 });
  await B("我懂了，下一步").click();

  // 第二步：前端／後端分類，六題都要答對
  await p.waitForSelector("text=市府的前台和後台");
  const rows = await p.$$("[data-fb-row]");
  if (rows.length !== 6) throw new Error("分類題數 " + rows.length);
  for (const r of rows) {
    const want = await r.getAttribute("data-fb-row");
    await r.$eval(`[data-fb-pick=${want}]`, (e) => e.click());
  }
  await B("六題都對了，下一步").click();

  // 第三步：小測驗
  await p.click("text=因為筆電會關機");
  // 第四步：把檔案放上伺服器
  await p.waitForSelector("text=把你的網頁「放上」伺服器", { timeout: 4000 });
  await p.click("text=📄 index.html");
  await p.click("text=把檔案放進來");
  await p.waitForSelector("text=本機與上線，分清楚了", { timeout: 4000 });
});

await st("第 2 關：本機 file:// 與上線 https:// 的對照", async () => {
  await go("intro");
  // 只點一個時不該放行
  await p.click("[data-try=send] button");
  if (await p.$("text=懂了，那網址是怎麼運作的？")) throw new Error("只點一個就出現下一步了");
  for (const id of ["share", "come", "deploy"]) {
    await p.click(`[data-try=${id}] button`);
  }
  // 兩條網址要同時出現，對照才成立
  await p.waitForSelector("text=file:///C:/Users/你的帳號/Desktop/公告/index.html");
  await p.waitForSelector("text=https://你的帳號.github.io/announce/");
});

// 場景圖是老師另外放進 public/images 的，沒有檔案時整塊不顯示（不會開天窗）
const hasScene = fs.existsSync("public/images/service-center.jpg");

await st(
  `前端/後端場景圖${hasScene ? "：5 個標記都能叫出說明" : "（public/images 還沒放圖，略過）"}`,
  async () => {
    if (!hasScene) return;
    await go("intro");
    for (const id of ["send", "share", "come", "deploy"]) await p.click(`[data-try=${id}] button`);
    await B("懂了，那網址是怎麼運作的？").click();
    await B("我懂了，下一步").click();
    await p.waitForSelector("figure img");

    const ms = await p.$$("figure button[aria-expanded]");
    if (ms.length !== 5) throw new Error("標記數量 " + ms.length);

    for (let i = 0; i < ms.length; i++) {
      await ms[i].hover();
      await p.waitForTimeout(200);
      // 說明框必須完整落在圖片範圍內，不能被切掉
      const out = await p.evaluate(() => {
        const fig = document.querySelector("figure > div").getBoundingClientRect();
        const tip = document.querySelector("figure [role=status]");
        if (!tip) return "沒有說明框";
        const t = tip.getBoundingClientRect();
        if (t.width < 120) return "說明框被擠成 " + Math.round(t.width) + "px";
        const over = Math.max(fig.left - t.left, t.right - fig.right, fig.top - t.top, t.bottom - fig.bottom);
        return over > 1 ? "超出圖片 " + Math.round(over) + "px" : null;
      });
      if (out) throw new Error(`標記 ${i + 1}：${out}`);
    }
    // 抽號碼牌要講到佇列、敬老櫃台要講到權限由後端把關
    await ms[1].hover();
    await p.waitForSelector("text=排隊（Queue）");
    await ms[3].hover();
    await p.waitForSelector("text=權限一定要由後端把關");
  }
);

// 下載給學生的名片範本：學生會把它原封不動丟上 GitHub Pages，
// 所以它自己必須守住這一關教的規則（單檔、無外部資源、無絕對路徑）
await st("名片範本：自己就能跑，不依賴任何外部檔案", async () => {
  const page = await ctx.newPage();
  const errs2 = [];
  page.on("pageerror", (e) => errs2.push("PAGEERR " + e.message));
  await page.setContent(STARTER_HTML, { waitUntil: "networkidle" });
  const r = await page.evaluate(() => ({
    imgs: document.querySelectorAll("img").length,
    links: document.querySelectorAll("a").length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    // 不能有只有自己電腦才有的路徑。只看真正會被載入的 src/href ——
    // 註解裡那句「不要寫 C:\\Users\\…」是教學文字，不算。
    abs: [...document.querySelectorAll("[src],[href]")]
      .map((e) => e.getAttribute("src") || e.getAttribute("href") || "")
      .some((u) => /^(file:\/\/\/|[A-Za-z]:\\)/.test(u)),
    title: document.title,
  }));
  if (r.imgs !== 0) throw new Error("範本引用了外部圖片 " + r.imgs + " 張");
  if (r.links < 8) throw new Error("連結按鈕只有 " + r.links + " 個");
  if (r.abs) throw new Error("範本裡有本機絕對路徑");
  if (!r.title.includes("電子名片")) throw new Error("標題是 " + r.title);
  // 手機寬度不能橫向捲動
  await page.setViewportSize({ width: 360, height: 800 });
  await page.waitForTimeout(200);
  const ovf = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  if (ovf > 1) throw new Error("360px 橫向溢出 " + ovf + "px");
  if (errs2.length) throw new Error(errs2.join(" | "));
  await page.close();
});

// 儀表板範本：學生會直接上傳，所以它自己要單檔可跑；而且 data.taipei 打不通時
// 必須退回內建資料而不是開天窗（這台機器連不到 data.taipei，兩條路都要驗）
await st("儀表板範本：連不到 API 時退回內建資料，畫面不空白", async () => {
  const page = await ctx.newPage();
  const errs2 = [];
  page.on("pageerror", (e) => errs2.push("PAGEERR " + e.message));
  await page.setContent(DASHBOARD_HTML);
  await page.waitForFunction(() => !document.getElementById("reload").disabled, null, { timeout: 8000 });
  const r = await page.evaluate(() => ({
    cls: document.getElementById("status").className,
    bars: document.querySelectorAll("#bars .bar").length,
    widths: [...document.querySelectorAll("#bars .fill")].map((e) =>
      Math.round(e.getBoundingClientRect().width)
    ),
    rows: document.querySelectorAll("#rows tr").length,
    imgs: document.querySelectorAll("img").length,
    total: document.getElementById("kStations").textContent,
  }));
  if (!r.cls.includes("fallback")) throw new Error("狀態列不是 fallback：" + r.cls);
  if (r.bars < 3) throw new Error("長條只有 " + r.bars + " 條");
  if (Math.min(...r.widths) < 2) throw new Error("有長條寬度是 0（span 沒有 display:block？）");
  if (r.rows < 5) throw new Error("表格只有 " + r.rows + " 列");
  if (r.imgs !== 0) throw new Error("引用了外部圖片");
  if (r.total === "—") throw new Error("站點數沒算出來");
  if (errs2.length) throw new Error(errs2.join(" | "));
  await page.close();
});

await st("儀表板範本：API 通的時候顯示即時資料", async () => {
  const page = await ctx.newPage();
  // YouBike 的回傳是「一個陣列」，每站一個物件
  await page.route("**youbike_immediate.json*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          sna: "YouBike2.0_甲站",
          sarea: "大安區",
          available_rent_bikes: 10,
          available_return_bikes: 5,
          Quantity: 15,
          mday: "2026-09-13 03:03:03",
        },
        {
          sna: "YouBike2.0_乙站",
          sarea: "大安區",
          available_rent_bikes: 0,
          available_return_bikes: 20,
          Quantity: 20,
          mday: "2026-09-13 03:03:03",
        },
        {
          sna: "YouBike2.0_丙站",
          sarea: "信義區",
          available_rent_bikes: 7,
          available_return_bikes: 3,
          Quantity: 10,
          mday: "2026-09-13 03:03:03",
        },
      ]),
    })
  );
  await page.setContent(DASHBOARD_HTML);
  await page.waitForFunction(() => document.getElementById("status").className.includes("live"), null, {
    timeout: 8000,
  });
  const r = await page.evaluate(() => ({
    stations: document.getElementById("kStations").textContent,
    bikes: document.getElementById("kBikes").textContent,
    docks: document.getElementById("kDocks").textContent,
    empty: document.getElementById("kEmpty").textContent,
    topArea: document.querySelector("#bars .bar span").textContent,
    firstRow: document.querySelector("#rows td").textContent,
  }));
  if (r.stations !== "3") throw new Error("站點數 " + r.stations);
  if (r.bikes !== "17") throw new Error("可借總數 " + r.bikes);
  if (r.docks !== "28") throw new Error("可還總數 " + r.docks);
  if (r.empty !== "1") throw new Error("無車站數 " + r.empty);
  if (r.topArea !== "大安區") throw new Error("站數最多的區 " + r.topArea);
  // 站名前綴要被拿掉才好讀
  if (r.firstRow !== "甲站") throw new Error("第一列站名 " + r.firstRow);
  await page.close();
});

await st("第 3 關：自己做的檔案有 6 個雷的提醒", async () => {
  await go("github-pages");
  await p.click("text=靜態網站：HTML");
  await B("先在模擬介面練一次").click();
  await B("我真的做一次").click();
  await p.waitForSelector("text=要傳自己做的檔案？先看這 6 個雷");
  await p.click("text=要傳自己做的檔案？先看這 6 個雷");
  await p.waitForSelector("text=首頁檔名一定要是 index.html");
  // 雷的數量寫在標題裡，清單長度變了標題就得跟著改
  const n = await p.locator("details", { hasText: "先看這 6 個雷" }).locator("ol > li").count();
  if (n !== 6) throw new Error("標題說 6 個雷，清單其實有 " + n + " 個");
  await p.waitForSelector("text=金鑰、密碼、.env 一個都不能傳");
});

await st("第 2 關動畫：三個階段可以自己點、方向箭頭會跟著換", async () => {
  await go("intro");
  for (const id of ["send", "share", "come", "deploy"]) {
    await p.click(`[data-try=${id}] button`);
  }
  await B("懂了，那網址是怎麼運作的？").click();
  await p.click("text=② 回傳檔案");
  await p.waitForSelector("text=伺服器 → 瀏覽器");
  await p.click("text=① 送出請求");
  await p.waitForSelector("text=瀏覽器 → 伺服器");
  // 封包身上要有看得懂的標籤，不能只有一顆 emoji
  await p.waitForSelector("text=請求");
});

await st("3 GitHub Pages", async () => {
  await go("github-pages");
  await p.click("text=靜態網站：HTML");
  await B("先在模擬介面練一次").click();
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=Create a new repository");
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=拖曳檔案到這裡上傳");
  await p.click("text=📄 index.html");
  await p.click("text=拖曳檔案到這裡上傳");
  await p.waitForFunction(() => {
    const x = document.querySelector(".gh-btn-green");
    return x && !x.disabled;
  });
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=Branch");
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=Your site is live");
  await p.click("text=我真的做一次");
  for (const c of await p.$$("input[type=checkbox]")) await c.check();
  await p.fill("input[type=url]", "https://me.github.io/site/");
  await p.click("text=驗證我的網站");
  await p.waitForSelector("text=你把網站部署上線了", { timeout: 4000 });
});

await st("5 Netlify / Cloudflare Pages", async () => {
  await go("hosting");
  // 步驟 1：勾起來才會看到「平台幫你做」的那三格
  await p.waitForSelector("text=同一類，但它會幫你做更多事");
  const before = await p.locator("[data-flow]").innerText();
  if (before.includes("自動 build")) throw new Error("沒勾就出現自動建置流程了");
  await p.locator('input[type=checkbox]').first().check();
  await p.waitForFunction(
    () => /自動 build/.test(document.querySelector("[data-flow]").innerText),
    null,
    { timeout: 2500 }
  );
  await B("三家比一比").click();

  // 步驟 2：三張都要點開才放行
  await p.waitForSelector("text=三家比一比");
  for (const id of ["ghp", "netlify", "cfp"]) {
    await p.click(`[data-host=${id}] button`);
    await p.waitForSelector(`[data-host=${id}] [aria-expanded=true]`, { timeout: 2500 });
  }
  await p.locator("text=被綁住的不是你的檔案").first().waitFor({ state: "visible", timeout: 2500 });
  await B("真的接一次").click();

  // 步驟 3：網址驗證只收 netlify.app / pages.dev
  await p.waitForSelector("text=把同一個 repo 再接上一家");
  for (const c of await p.$$("input[type=checkbox]")) await c.check();
  await p.fill("input[type=url]", "https://me.github.io/site/");
  await B("驗證 ✅").click();
  await p.waitForSelector("text=格式不太對", { timeout: 2500 });
  await p.fill("input[type=url]", "https://bravo-card.netlify.app");
  await B("驗證 ✅").click();
  await p.waitForSelector("text=同一份檔案，你現在有兩個網址了", { timeout: 2500 });

  // 表單那段：能收 ≠ 該收
  await p.locator("summary", { hasText: "不用後端也能收表單" }).click();
  for (const [id, pick, expect] of [
    ["poll", "✅ 可以用", "✅ 可以用"],
    ["signup", "✅ 可以用", "⛔ 不該這樣做"],
    ["feedback", "✅ 可以用", "⚠️ 先問資訊單位"],
  ]) {
    await p.locator(`[data-form=${id}] button`, { hasText: pick }).click();
    await p.locator(`[data-form=${id}] >> text=${expect}`).first().waitFor({ state: "visible", timeout: 2500 });
  }
  await p.locator("text=自由填寫的欄位，你擋不住別人填個資進去").first().waitFor({ state: "visible", timeout: 2500 });

  await p.locator("button", { hasText: "檔案是你自己的，被綁住的只是那個網址" }).first().click();
  await B("完成這一關").click();
  await p.waitForSelector("text=自動上線達成", { timeout: 3000 });
});

await st("6 API 基礎", async () => {
  await go("api");
  await p.click("text=自己送一個 request");
  // 只有一支端點，不該再有「自己篩」那種選單按鈕
  if (await p.locator("button", { hasText: "自己篩" }).count()) throw new Error("端點選單又跑回來了");
  await B("送出 Send").click();
  await p.waitForSelector("text=200 OK", { timeout: 3000 });
  // 回傳要是 YouBike 的真實欄位
  await p.waitForSelector("text=available_rent_bikes");
  await p.waitForSelector("text=sarea");
  // key / value 這兩個詞在這裡第一次出現，要有解釋 —— 而且要切乾淨跟「API 金鑰」的關係
  await p.locator("text=key（鍵 / 欄位名）").first().waitFor({ state: "visible", timeout: 2500 });
  await p.locator("text=value（值）").first().waitFor({ state: "visible", timeout: 2500 });
  await p.locator("text=跟「API 金鑰（API key）」沒有關係").first().waitFor({ state: "visible", timeout: 2500 });
  await p.click("text=試試真的 API");
  await p.click("text=你送了一個 GET 請求");
  await B("完成這一關").click();
  await p.waitForSelector("text=API 入門達成", { timeout: 3000 });
});

await st("7 GAS 推送", async () => {
  await go("gas");
  await p.click("text=讓它跑一次給你看");
  await p.click("text=定時觸發");
  await B("執行 GAS").click();
  await p.waitForSelector("text=市政信箱通知機器人", { timeout: 3000 });
  await B("看看真的怎麼設").click();
  await B("把訊息 POST 出去").click();
  await B("完成這一關").click();
  await p.waitForSelector("text=自動推播達成", { timeout: 3000 });
});

await st("8 Hugging Face", async () => {
  await go("huggingface");
  await p.click("text=部署一個 AI Demo 來玩");
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=市政信箱意見情緒分析 Demo", { timeout: 4000 });
  await B("分析 Analyze").click();
  await p.waitForSelector("text=信心", { timeout: 3000 });
  await B("看看真的怎麼做").click();
  await B("GitHub Pages 只能放純靜態網頁").click();
  await B("完成這一關").click();
  await p.waitForSelector("text=AI 應用上線達成", { timeout: 3000 });
});

await st("9 自架（內網/對外）", async () => {
  await go("selfhost");
  await p.click("text=試試看誰連得上");
  const sw = await p.$$("[role=switch]");
  await sw[0].click();
  await sw[1].click();
  await p.click("text=同仁從市府內網連線");
  await p.waitForSelector("text=資料完全沒有離開機關", { timeout: 3000 });
  await B("在自己電腦實際跑一個").click();
  await B("對外提供服務要先經資安評估與核准").click();
  await B("完成這一關").click();
  await p.waitForSelector("text=內網與對外的差別", { timeout: 3000 });
});

await st("10 Docker", async () => {
  await go("docker");
  await p.click("text=自己打包一個來跑");
  await B("docker build").click();
  await p.waitForSelector("text=Image 打包完成", { timeout: 3000 });
  await B("docker run").click();
  await p.waitForSelector("text=同事那台乾淨電腦沒裝 Node", { timeout: 3000 });
  await p.click("text=把「環境」也打包進去");
  await B("docker build").click();
  await p.waitForSelector("text=已含環境", { timeout: 3000 });
  await B("docker run").click();
  await p.waitForSelector("text=結果一模一樣", { timeout: 3000 });
  await B("看看真的怎麼寫").click();
  await B("避免「我電腦能跑").click();
  await B("完成這一關").click();
  await p.waitForSelector("text=打包貨櫃達成", { timeout: 3000 });
});

await st("11 EXE 執行檔（全線通關）", async () => {
  await go("exe-queue");
  // 步驟 1：四題「做網頁還是做 EXE」
  for (const [id, pick, expect] of [
    ["form", "🌐 做成網頁", "🌐 做成網頁"],
    ["localfile", "🌐 做成網頁", "📦 做成 EXE"],
    ["offline", "📦 做成 EXE", "📦 做成 EXE"],
    ["share", "🌐 做成網頁", "🌐 做成網頁"],
  ]) {
    await p.locator(`[data-which=${id}] button`, { hasText: pick }).click();
    await p.locator(`[data-which=${id}] >> text=${expect}`).first().waitFor({ state: "visible", timeout: 2500 });
  }
  await B("打包成 EXE →").click();

  // 步驟 2：打包後要冒出防毒那段
  await B("🔨 打包成 EXE").click();
  await p.waitForSelector("text=打包完成", { timeout: 3000 });
  await p.locator("text=然後你會遇到第一道牆：防毒軟體").first().waitFor({ state: "visible", timeout: 2500 });
  await B("那要怎麼發新版本").click();

  // 步驟 3：版本號 + changelog 分類 + 寫給誰看 + 更新成本
  await p.waitForSelector("text=先看懂版本號", { timeout: 3000 });
  // 六個分類要齊 —— 在那個區塊裡面比對，不然「資安」這種字全頁到處都是
  const kinds = await p.locator("[data-changekinds]").innerText();
  for (const t of ["新增", "Added", "變更", "Changed", "修正", "Fixed", "移除", "Removed", "即將移除", "Deprecated", "資安", "Security"]) {
    if (!kinds.includes(t)) throw new Error("changelog 分類少了 " + t);
  }
  await p.click("[data-rewrite=null] button");
  await p.locator("[data-rewrite=null] >> text=承辦人欄位空白").first().waitFor({ state: "visible", timeout: 2500 });
  // 更新的成本：網頁 vs EXE（修正過的說法 —— EXE 做得到自動更新，只是要自己做）
  await p.locator("text=PyInstaller 沒有內建").first().waitFor({ state: "visible", timeout: 2000 });
  await p.locator("text=它不會主動通知使用者").first().waitFor({ state: "visible", timeout: 2000 });

  // 這句話在頁面上出現三次（測驗選項、改寫對照、changelog 範本）——只點測驗那顆按鈕
  await p.locator("button", { hasText: "修正：承辦人欄位空白時" }).first().click();
  await B("完成整張地圖").click();
  await p.waitForSelector("text=全線通關", { timeout: 3000 });
});

await st("「回上一步」可用（新增功能）", async () => {
  await go("api");
  await p.click("text=自己送一個 request");
  await p.waitForSelector("text=送出一個 API 請求");
  await p.click("text=回上一步");
  await p.waitForSelector("text=API 是什麼", { timeout: 2500 });
});

await st("地圖：11 關全完成", async () => {
  await p.goto(base + "/index.html#/map", { waitUntil: "networkidle" });
  await p.waitForSelector("text=我的徽章");
  const prog = (await p.$eval("[data-testid=progress]", (e) => e.textContent)).trim();
  if (prog !== "11/11") throw new Error("進度 " + prog);
  console.log("   進度：", prog);
});

// 教材文案裡有寫死的「第 N 關」，順序一動就會對不上，所以這裡把整條順序釘住。
await st("關卡順序：全景 → 觀念 → 動手 → 界線", async () => {
  for (const [id, no] of [
    ["landscape", 1],
    ["intro", 2],
    ["github-pages", 3],
    ["boundary", 4],
    ["hosting", 5],
    ["api", 6],
    ["gas", 7],
    ["huggingface", 8],
    ["selfhost", 9],
    ["docker", 10],
    ["exe-queue", 11],
  ]) {
    await go(id);
    await p.waitForSelector(`text=第 ${no} / 11 關`);
  }
});

await st("導覽：桌機分頁列四個入口都會切換", async () => {
  await p.setViewportSize({ width: 1100, height: 900 });
  await p.goto(base + "/index.html#/", { waitUntil: "networkidle" });
  for (const [label, expect] of [
    ["選型指南", "#/guide"],
    ["名詞小教室", "#/terms"],
    ["闖關地圖", "#/map"],
    ["首頁", "#/"],
  ]) {
    await p.locator("header nav button", { hasText: label }).click();
    await p.waitForFunction((h) => location.hash === h, expect, { timeout: 2500 });
  }
  // 目前分頁要標記 aria-current
  await p.locator("header nav button", { hasText: "選型指南" }).click();
  await p.waitForFunction(() => location.hash === "#/guide", null, { timeout: 2500 });
  // 等到 aria-current 真的落在「選型指南」再斷言：hash 是同步改的，
  // 但 React 重繪是非同步的，直接讀會抓到上一個分頁的舊值
  await p.waitForFunction(
    () => {
      const el = document.querySelector("header nav button[aria-current=page]");
      return el && el.innerText.includes("選型指南");
    },
    null,
    { timeout: 2500 }
  );
  // innerText 只取看得見的標籤（窄螢幕短標籤、寬螢幕全名，兩個都在 DOM 裡）
  const cur = await p.$$eval("header nav button[aria-current=page]", (els) => els.map((e) => e.innerText));
  if (cur.length !== 1) throw new Error("aria-current 有 " + cur.length + " 個：" + cur.join(","));
});

await st("導覽：手機底部分頁列可見且可切換", async () => {
  await p.setViewportSize({ width: 390, height: 780 });
  await p.goto(base + "/index.html#/", { waitUntil: "networkidle" });
  const bottom = p.locator("nav.fixed");
  if (!(await bottom.isVisible())) throw new Error("底部分頁列沒出現");
  await bottom.locator("button", { hasText: "名詞" }).click();
  await p.waitForFunction(() => location.hash === "#/terms", null, { timeout: 2500 });
  // 捲到頁面最底時，底部分頁列不可以蓋住頁尾內容。
  // 內容還在排版時高度會變，所以捲到「捲不動為止」再量。
  await p.evaluate(async () => {
    for (let i = 0; i < 20; i++) {
      const before = window.scrollY;
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((r) => setTimeout(r, 100));
      if (Math.abs(window.scrollY - before) < 1) break;
    }
  });
  await p.waitForTimeout(200);
  const gap = await p.evaluate(() => {
    const nav = document.querySelector("nav.fixed").getBoundingClientRect();
    const foot = document.querySelector("footer").getBoundingClientRect();
    return Math.round(nav.top - foot.bottom);
  });
  if (gap < 0) throw new Error("底部分頁列蓋住頁尾 " + -gap + "px");
  await p.setViewportSize({ width: 1100, height: 900 });
});

await st("關卡頁：上一關／下一關可用", async () => {
  await go("github-pages");
  await p.locator("nav[aria-label=關卡導覽] button", { hasText: "下一關" }).click();
  await p.waitForFunction(() => location.hash === "#/level/boundary", null, { timeout: 2500 });
  await p.locator("nav[aria-label=關卡導覽] button", { hasText: "上一關" }).click();
  await p.waitForFunction(() => location.hash === "#/level/github-pages", null, { timeout: 2500 });
});

await st("名詞小教室：CORS 卡有「被擋住怎麼辦」的三條路", async () => {
  await p.goto(`${base}/index.html#/map`, { waitUntil: "domcontentloaded" });
  await p.goto(`${base}/index.html#/terms/cors`, { waitUntil: "networkidle" });
  const card = p.locator("div.card", { has: p.locator("text=跨來源限制") }).first();
  for (const h of ["換一個有開放的資料源", "不要讓瀏覽器去抓", "請資料提供方開放"]) {
    await card.locator(`text=${h}`).first().waitFor({ state: "visible", timeout: 3000 });
  }
  // 不要教學員用來路不明的 proxy —— 這句一定要在
  await card.locator("text=第三方伺服器").first().waitFor({ state: "visible", timeout: 3000 });
});

await st("選型指南：AI 工具也在比較表裡，且連得到第 1 關", async () => {
  await p.goto(`${base}/index.html#/map`, { waitUntil: "domcontentloaded" });
  await p.goto(`${base}/index.html#/guide`, { waitUntil: "networkidle" });
  // 納管前那張表要多一列「AI 工具的分享連結」，而且不是關卡 —— 點名稱要連到介紹它的第 1 關
  const row = p.locator("table tbody tr", { hasText: "AI 工具的分享連結" }).first();
  await row.waitFor({ state: "visible", timeout: 3000 });
  await row.locator("text=Claude Artifacts").first().waitFor({ state: "visible", timeout: 2000 });
  await row.locator("button", { hasText: "AI 工具的分享連結" }).click();
  await p.waitForFunction(() => location.hash === "#/level/landscape", null, { timeout: 2500 });

  // 「幫我選」挑到 AI 工具時，按鈕一樣要送到第 1 關（它沒有自己的關卡）
  await p.goto(`${base}/index.html#/map`, { waitUntil: "domcontentloaded" });
  await p.goto(`${base}/index.html#/guide`, { waitUntil: "networkidle" });
  await p.locator("button", { hasText: "開會要用一次" }).click();
  await p.locator("button", { hasText: "前往這一關" }).click();
  await p.waitForFunction(() => location.hash === "#/level/landscape", null, { timeout: 2500 });
});

await st("第 3 關：教怎麼在網頁裡放圖片（四個寫法的判斷）", async () => {
  await go("github-pages");
  // 走到步驟 3（圖片教學掛在「真的動手」那一步）
  await p.click("text=靜態網站：HTML");
  await B("先在模擬介面練一次").click();
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=Create a new repository");
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=拖曳檔案到這裡上傳");
  await p.click("text=📄 index.html");
  await p.click("text=拖曳檔案到這裡上傳");
  await p.waitForFunction(() => {
    const x = document.querySelector(".gh-btn-green");
    return x && !x.disabled;
  });
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=Branch");
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=Your site is live");
  await p.click("text=我真的做一次");

  const sum = p.locator("summary", { hasText: "想放自己的照片或圖片" });
  await sum.waitFor({ state: "visible", timeout: 4000 });
  await sum.click();
  // 相對路徑 vs 本機絕對路徑 vs 大小寫 vs 子資料夾
  for (const [id, pickOk, expect] of [
    ["same", "🖼️ 會顯示", "🖼️ 會顯示"],
    ["abs", "🖼️ 會顯示", "💔 會破圖"],
    ["case", "💔 會破圖", "💔 會破圖"],
    ["folder", "🖼️ 會顯示", "🖼️ 會顯示"],
  ]) {
    await p.locator(`[data-img=${id}] button`, { hasText: pickOk }).click();
    await p.locator(`[data-img=${id}] >> text=${expect}`).first().waitFor({ state: "visible", timeout: 2500 });
  }
  await p.locator("text=不要直接貼別人網站的圖片網址").first().waitFor({ state: "visible", timeout: 2000 });
});

await st("名片範本：頭像換成 <img> 照片時不會被拉扁", async () => {
  // 範本註解教學生「把整個 <svg class=avatar> 換成一行 <img class=avatar>」，
  // 這裡照著做一次，確認教學步驟跟實際標籤對得上、而且圓形裁切正常。
  const PHOTO =
    "data:image/svg+xml;utf8," +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#f2a03d"/></svg>');
  const swapped = STARTER_HTML.replace(
    /<svg class="avatar"[\s\S]*?<\/svg>/,
    `<img class="avatar" src="${PHOTO}" alt="測試大頭照">`
  );
  if (swapped === STARTER_HTML) throw new Error("註解教的 <svg class=\"avatar\"> 在範本裡找不到");
  const page = await ctx.newPage();
  await page.setContent(swapped, { waitUntil: "networkidle" });
  const r = await page.evaluate(() => {
    const el = document.querySelector("img.avatar");
    const b = el.getBoundingClientRect();
    return {
      loaded: el.complete && el.naturalWidth > 0,
      w: Math.round(b.width),
      h: Math.round(b.height),
      fit: getComputedStyle(el).objectFit,
    };
  });
  if (!r.loaded) throw new Error("照片沒載入");
  if (r.w !== r.h) throw new Error(`頭像不是正方形 ${r.w}x${r.h}`);
  if (r.fit !== "cover") throw new Error("object-fit 是 " + r.fit + "，3:2 的照片會被拉扁");
  await page.close();
});

await st("第 3 關：金鑰 / .env / .gitignore 與 README", async () => {
  await go("github-pages");
  await p.click("text=靜態網站：HTML");
  await B("先在模擬介面練一次").click();
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=Create a new repository");
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=拖曳檔案到這裡上傳");
  await p.click("text=📄 index.html");
  await p.click("text=拖曳檔案到這裡上傳");
  await p.waitForFunction(() => {
    const x = document.querySelector(".gh-btn-green");
    return x && !x.disabled;
  });
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=Branch");
  await p.click(".gh-btn-green");
  await p.waitForSelector("text=Your site is live");
  await p.click("text=我真的做一次");

  // 金鑰：四個檔案的判斷（含最容易漏的「截圖也算外洩」）
  await p.locator("summary", { hasText: "金鑰、.env 與 .gitignore" }).click();
  for (const [id, pick, expect] of [
    ["html", "✅ 可以上傳", "✅ 可以上傳"],
    ["env", "✅ 可以上傳", "🚫 不能上傳"],
    ["example", "✅ 可以上傳", "✅ 可以上傳"],
    ["shot", "✅ 可以上傳", "🚫 不能上傳"],
  ]) {
    await p.locator(`[data-sec=${id}] button`, { hasText: pick }).click();
    await p.locator(`[data-sec=${id}] >> text=${expect}`).first().waitFor({ state: "visible", timeout: 2500 });
  }
  // 外洩後的正確動作是撤銷重發，不是刪掉那一行
  await p.locator("text=撤銷／重新產生").first().waitFor({ state: "visible", timeout: 2000 });
  await p.locator("text=前端藏不住金鑰").first().waitFor({ state: "visible", timeout: 2000 });

  // README：交接觀點 + 可複製範本 + 「也是公開的」提醒
  await p.locator("summary", { hasText: "幫你的 repo 寫一份 README" }).click();
  await p.locator("text=README 就是交接文件").first().waitFor({ state: "visible", timeout: 2500 });
  await p.locator("text=可以直接拿去改的範本").first().waitFor({ state: "visible", timeout: 2000 });
  await p.locator("text=README 也是公開的").first().waitFor({ state: "visible", timeout: 2000 });
});

await st("名詞小教室：佇列卡帶著模擬器（從第 10 關搬過來的）", async () => {
  await p.goto(`${base}/index.html#/map`, { waitUntil: "domcontentloaded" });
  await p.goto(`${base}/index.html#/terms/queue`, { waitUntil: "networkidle" });
  const card = p.locator("div.card", { has: p.locator("text=佇列 / 排隊") }).first();
  await card.locator("text=玩玩看").first().waitFor({ state: "visible", timeout: 3000 });
  const sub = card.locator("button", { hasText: "送出任務" });
  for (let i = 0; i < 4; i++) {
    await sub.click();
    await p.waitForTimeout(110);
  }
  // 背景 worker 會一個一個消化掉
  await p.waitForFunction(
    () => /幫你|背景慢慢做完/.test(document.body.innerText) || /已完成/.test(document.body.innerText),
    null,
    { timeout: 9000 }
  );
  await card.locator("text=這 ").first().waitFor({ state: "visible", timeout: 9000 });
  // 佇列不再是某一關的內容，所以不該再有「去玩互動關」的按鈕
  if (await card.locator("button", { hasText: "去玩" }).count()) throw new Error("佇列卡還連著關卡");
});

console.log("\n錯誤：", errs.length ? errs.join(" | ") : "（無）");
await b.close();
process.exit(errs.length ? 1 : 0);
