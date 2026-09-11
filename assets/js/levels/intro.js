// =========================================================
// 關卡 0：網站是怎麼被看到的？（部署概念）
// 互動：request/response 動畫 + 把檔案「放上伺服器」的拖拉/點擊
// =========================================================
import { el, toast } from "../ui.js";
import { stepBar, quiz, doneScreen } from "../levelkit.js";

export default {
  id: "intro",
  emoji: "🌐",
  title: "網站是怎麼被看到的？",
  tagline: "先搞懂「部署」到底是把東西放去哪裡",
  badge: { id: "concept", icon: "🧭", name: "概念啟航", desc: "看懂前端、伺服器與部署" },

  render(root, ctx) {
    const TOTAL = 3;
    let step = 0;

    const stage = el("div");
    const wrap = el("div", { class: "card stack" });
    wrap.append(stage);
    root.append(el("div", { class: "step-count", id: "sc" }), wrap);

    const draw = () => {
      root.querySelector("#sc").replaceChildren(stepBar(step, TOTAL));
      stage.replaceChildren(views[step]());
    };

    const next = () => { step++; draw(); };

    const views = [
      // --- 0：概念 + 網路動畫 ---
      () => {
        const v = el("div", { class: "stack" });
        v.append(
          el("span", { class: "eyebrow" }, "第一步 · 概念"),
          el("h2", {}, "你打開一個網站時，發生了什麼事？"),
          el("p", { class: "hint" }, "點下面的按鈕，看一次「瀏覽器 ↔ 伺服器」的對話：")
        );

        const map = el("div", { class: "netmap" }, [
          el("div", { class: "netnode" }, [
            el("span", { class: "netnode__emoji" }, "💻"),
            el("div", { class: "netnode__label" }, "你的瀏覽器"),
            el("div", { class: "netnode__sub" }, "使用者 / 前端"),
          ]),
          (() => {
            const wire = el("div", { class: "netwire" }, [el("div", { class: "netwire__line" })]);
            const packet = el("div", { class: "packet", id: "pkt" }, "📨");
            wire.append(packet);
            return wire;
          })(),
          el("div", { class: "netnode" }, [
            el("span", { class: "netnode__emoji" }, "🖥️"),
            el("div", { class: "netnode__label" }, "伺服器"),
            el("div", { class: "netnode__sub" }, "一直開著的電腦"),
          ]),
        ]);
        v.append(map);

        const log = el("p", { class: "callout callout--info", style: "min-height:1.2em" }, "👉 按「播放」看看資料怎麼跑");
        const playBtn = el("button", { class: "btn btn--accent", type: "button" }, "▶ 播放");
        let playing = false;
        playBtn.addEventListener("click", async () => {
          if (playing) return;
          playing = true;
          const pkt = v.querySelector("#pkt");
          const send = (emoji, left, msg) => new Promise((res) => {
            pkt.textContent = emoji;
            pkt.style.opacity = "1";
            pkt.style.left = "0%";
            log.textContent = msg;
            requestAnimationFrame(() => (pkt.style.left = left));
            setTimeout(res, 1000);
          });
          await send("📨", "88%", "① 瀏覽器送出請求：「我要看這個網頁」");
          await send("📄", "0%", "② 伺服器回傳網頁檔案（HTML/CSS/JS）");
          pkt.style.opacity = "0";
          log.textContent = "③ 瀏覽器把檔案畫成畫面 → 你就看到網站了！🎉";
          playing = false;
        });
        v.append(playBtn, log);

        v.append(
          el("div", { class: "callout" }, [
            document.createTextNode("所以「"),
            el("b", {}, "部署（Deploy）"),
            document.createTextNode("」就是：把你做好的網頁檔案，放到一台「一直開著、全世界都連得到」的電腦（伺服器）上，別人才看得到。"),
          ])
        );
        v.append(el("button", { class: "btn btn--primary", type: "button", onClick: next }, "我懂了，下一步 →"));
        return v;
      },

      // --- 1：小測驗 ---
      () => {
        const v = el("div", { class: "stack" });
        v.append(el("span", { class: "eyebrow" }, "第二步 · 檢查一下"));
        v.append(
          quiz(
            {
              question: "為什麼不能只把網頁放在「自己的筆電」上就好？",
              options: [
                { text: "因為筆電會關機、會睡眠，別人不一定連得到", correct: true },
                { text: "因為筆電不能開網頁", correct: false },
                { text: "因為 HTML 只能在伺服器打開", correct: false },
              ],
              explainOk: "沒錯！要「一直開著、有固定網址」，別人才隨時看得到 —— 這就是為什麼我們需要部署到伺服器 / 託管服務。",
              explainNo: "再想想：關鍵在於「別人能不能隨時連到你的電腦」。",
            },
            () => setTimeout(next, 900)
          )
        );
        return v;
      },

      // --- 2：拖拉互動：把檔案放上伺服器 ---
      () => {
        const v = el("div", { class: "stack" });
        v.append(
          el("span", { class: "eyebrow" }, "第三步 · 動手試試"),
          el("h2", {}, "把你的網頁「放上」伺服器"),
          el("p", { class: "hint" }, "把 index.html 拖到伺服器上（手機可以用點的：先點檔案，再點伺服器）")
        );

        const file = el("div", { class: "draggable", draggable: "true", id: "file" }, ["📄 index.html"]);
        const zone = el("div", { class: "drop-zone", id: "zone" }, "🖥️  這是一台開著的伺服器 — 把檔案放進來");
        const fileWrap = el("div", { style: "text-align:center;margin-bottom:6px" }, file);

        let picked = false;
        const place = () => {
          if (zone.classList.contains("is-filled")) return;
          zone.classList.remove("is-over");
          zone.classList.add("is-filled");
          zone.innerHTML = "✅ 上線了！你的網站現在在：<br><code class='inline'>https://你的網站.example.com</code>";
          file.style.visibility = "hidden";
          toast("部署成功 🎉");
          setTimeout(() => {
            stage.replaceChildren(
              doneScreen({
                icon: "🧭",
                title: "第一關完成！",
                badge: this.badge,
                text: "你已經懂了核心概念：部署 = 把檔案放到別人連得到的電腦上。接下來，我們用真正的服務「GitHub Pages」把它做出來。",
                secondary: { label: "回地圖", onClick: () => ctx.goMap() },
                primary: { label: "前往 GitHub Pages 關 →", onClick: () => ctx.navigate("#/level/github-pages") },
              })
            );
            ctx.complete(this.badge);
          }, 900);
        };

        // 桌機：原生拖拉
        file.addEventListener("dragstart", (e) => {
          file.classList.add("is-dragging");
          e.dataTransfer.setData("text/plain", "file");
        });
        file.addEventListener("dragend", () => file.classList.remove("is-dragging"));
        zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("is-over"); });
        zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
        zone.addEventListener("drop", (e) => { e.preventDefault(); place(); });

        // 手機／點擊：先點檔案再點伺服器
        file.addEventListener("click", () => {
          picked = !picked;
          file.classList.toggle("point-here", picked);
          zone.classList.toggle("point-here", picked);
        });
        zone.addEventListener("click", () => { if (picked) place(); });

        v.append(fileWrap, zone);
        return v;
      },
    ];

    draw();
  },
};
