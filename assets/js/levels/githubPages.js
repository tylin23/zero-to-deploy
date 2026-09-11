// =========================================================
// 關卡：GitHub Pages（旗艦關）
// 走「網頁 GUI」路線 —— 全程滑鼠點，不用打 git 指令
// 三段式：① 概念  ② 站內模擬 GitHub 介面練一次  ③ 去真的 GitHub 做並貼網址驗證
// =========================================================
import { el, toast } from "../ui.js";
import { stepBar, quiz, doneScreen } from "../levelkit.js";

const BADGE = { id: "first-deploy", icon: "🚀", name: "首次部署", desc: "把第一個網站放上 GitHub Pages" };

// 範本 index.html —— 讓學生可以直接下載去上傳
const STARTER_HTML = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的第一個網站</title>
  <style>
    body { font-family: system-ui, sans-serif; display: grid; place-items: center;
           min-height: 100vh; margin: 0; background: linear-gradient(120deg,#5b5bf0,#f97316); color:#fff; text-align:center; }
    h1 { font-size: 3rem; }
  </style>
</head>
<body>
  <div>
    <h1>🎉 我的網站上線了！</h1>
    <p>這是我用 GitHub Pages 部署的第一個網頁。</p>
  </div>
</body>
</html>`;

function downloadStarter() {
  const blob = new Blob([STARTER_HTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: "index.html" });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("已下載 index.html");
}

// 迷你「瀏覽器視窗」外框
function browser(urlText, bodyNode) {
  return el("div", { class: "mock" }, [
    el("div", { class: "mock__bar" }, [
      el("div", { class: "mock__dots" }, [el("i"), el("i"), el("i")]),
      el("div", { class: "mock__url" }, urlText),
    ]),
    el("div", { class: "mock__body" }, bodyNode),
  ]);
}

export default {
  id: "github-pages",
  emoji: "📄",
  title: "GitHub Pages 部署",
  tagline: "免費、用滑鼠點就好，把靜態網站放上網",
  badge: BADGE,

  render(root, ctx) {
    const TOTAL = 3;
    let step = 0;

    const scBar = el("div", { class: "step-count" });
    const stage = el("div", { class: "card" });
    root.append(scBar, stage);

    const draw = () => {
      scBar.replaceChildren(stepBar(step, TOTAL, step - 1));
      stage.replaceChildren(views[step]());
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const next = () => { step++; draw(); };

    // ---------------------------------------------------------
    const views = [
      // ========== 步驟 1：概念 ==========
      () => {
        const v = el("div", { class: "stack" });
        v.append(
          el("span", { class: "eyebrow" }, "步驟 1 / 3 · 這是什麼"),
          el("h2", {}, "GitHub Pages 是什麼？"),
          el("div", { class: "callout callout--info" }, [
            document.createTextNode("GitHub Pages 是 GitHub 提供的"),
            el("b", {}, "免費網站託管服務"),
            document.createTextNode("。你把網頁檔案（HTML/CSS/JS）放進一個 repository，打開開關，它就給你一個網址、幫你放上網。全程可以在網站上用滑鼠點完。"),
          ])
        );

        const points = el("div", { class: "map-grid" }, [
          el("div", { class: "card" }, [el("div", { style: "font-size:30px" }, "💸"), el("b", {}, "免費"), el("p", { class: "hint" }, "個人專案不用付錢")]),
          el("div", { class: "card" }, [el("div", { style: "font-size:30px" }, "🖱️"), el("b", {}, "純 GUI"), el("p", { class: "hint" }, "用網頁點一點就好")]),
          el("div", { class: "card" }, [el("div", { style: "font-size:30px" }, "🔗"), el("b", {}, "有網址"), el("p", { class: "hint" }, "username.github.io")]),
        ]);
        v.append(points);

        v.append(
          quiz(
            {
              question: "GitHub Pages 最適合放哪一種網站？",
              options: [
                { text: "靜態網站：HTML / CSS / JS（例如作品集、活動頁）", correct: true },
                { text: "需要資料庫、後端運算的大型系統", correct: false },
                { text: "只有存在自己電腦裡的 Word 檔", correct: false },
              ],
              explainOk: "對！GitHub Pages 專門放「靜態網站」—— 純前端的頁面。要跑後端／資料庫就得用別的服務（之後的關會教）。",
              explainNo: "提示：GitHub Pages 不會幫你跑後端程式，它只負責把「檔案」原封不動送給瀏覽器。",
            },
            () => {
              const btn = v.querySelector("#to2");
              if (btn) btn.disabled = false;
            }
          )
        );
        v.append(el("button", { class: "btn btn--primary", type: "button", id: "to2", disabled: "true", onClick: next }, "下一步：先在模擬介面練一次 →"));
        return v;
      },

      // ========== 步驟 2：站內模擬 GitHub 介面 ==========
      () => {
        const v = el("div", { class: "stack" });
        v.append(
          el("span", { class: "eyebrow" }, "步驟 2 / 3 · 先練一次"),
          el("h2", {}, "在「模擬的 GitHub」點一遍"),
          el("p", { class: "hint" }, "下面是模仿真的 GitHub 畫面。跟著發亮的按鈕點 —— 等一下去真的網站就會很眼熟。")
        );

        const simHost = el("div");
        v.append(simHost);

        let sim = 0;
        const repoName = "my-first-site";

        const renderSim = () => {
          simHost.replaceChildren(simScreens[sim]());
        };

        const simScreens = [
          // 2-0：GitHub 首頁，點 New
          () => browser("github.com", el("div", {}, [
            el("div", { class: "gh-topnav" }, [
              el("span", { class: "gh-topnav__logo" }, "🐙"),
              el("span", { style: "font-weight:800" }, "GitHub"),
              el("span", { style: "flex:1" }),
              el("button", { class: "gh-btn gh-btn--green point-here", type: "button", onClick: () => { sim = 1; renderSim(); } }, "＋ New"),
            ]),
            el("div", { class: "tip-tag" }, "👉 點右上角綠色的「New」建立一個 repository"),
            el("p", { class: "hint" }, "repository（倉庫）就是放你這個專案所有檔案的地方。"),
          ])),

          // 2-1：建立 repository 表單
          () => {
            const body = el("div", {});
            body.append(el("h3", { style: "margin-top:0" }, "Create a new repository"));
            body.append(el("div", { class: "gh-field" }, [
              el("label", { class: "gh-label" }, "Repository name"),
              el("input", { class: "gh-input", value: repoName, readonly: "true" }),
              el("small", { class: "hint" }, "取一個名字就好（這裡先幫你填好）"),
            ]));
            const pub = el("label", { class: "gh-radio is-picked" }, [
              el("input", { type: "radio", checked: "true", disabled: "true" }),
              el("div", {}, [el("b", {}, "Public"), el("small", {}, "公開 —— 這樣別人才連得到你的網站（要用 Pages 通常選這個）")]),
            ]);
            body.append(pub);
            body.append(el("div", { class: "tip-tag" }, "👉 確認選了 Public，然後按綠色「Create repository」"));
            body.append(el("button", { class: "gh-btn gh-btn--green point-here", type: "button", onClick: () => { sim = 2; renderSim(); } }, "Create repository"));
            return browser("github.com/new", body);
          },

          // 2-2：上傳 index.html
          () => {
            const body = el("div", {});
            body.append(el("div", { style: "display:flex;align-items:center;gap:8px;margin-bottom:12px" }, [
              el("span", { style: "font-size:18px" }, "🐙"),
              el("b", {}, `你的帳號 / ${repoName}`),
              el("span", { class: "pill pill--muted" }, "Public"),
            ]));
            body.append(el("div", { class: "tip-tag" }, "👉 把 index.html 拖進來（或點一下），再按 Commit"));

            const file = el("div", { class: "draggable", draggable: "true" }, "📄 index.html");
            const zone = el("div", { class: "drop-zone", style: "margin-top:10px" }, "拖曳檔案到這裡上傳");
            const commitBtn = el("button", { class: "gh-btn gh-btn--green", type: "button", disabled: "true", style: "margin-top:12px" }, "Commit changes");

            let picked = false;
            const fill = () => {
              if (zone.classList.contains("is-filled")) return;
              zone.classList.remove("is-over"); zone.classList.add("is-filled");
              zone.textContent = "✅ index.html 已加入";
              file.style.display = "none";
              commitBtn.disabled = false;
              commitBtn.classList.add("point-here");
            };
            file.addEventListener("dragstart", (e) => e.dataTransfer.setData("t", "1"));
            zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("is-over"); });
            zone.addEventListener("dragleave", () => zone.classList.remove("is-over"));
            zone.addEventListener("drop", (e) => { e.preventDefault(); fill(); });
            file.addEventListener("click", () => { picked = !picked; file.classList.toggle("point-here", picked); zone.classList.toggle("point-here", picked); });
            zone.addEventListener("click", () => { if (picked) fill(); });
            commitBtn.addEventListener("click", () => { if (!commitBtn.disabled) { sim = 3; renderSim(); } });

            body.append(el("div", { style: "text-align:center;margin:6px 0" }, file), zone, commitBtn);
            return browser(`github.com/你/${repoName}`, body);
          },

          // 2-3：Settings → Pages
          () => {
            const body = el("div", {});
            body.append(el("div", { style: "display:flex;gap:8px;align-items:center;margin-bottom:12px" }, [
              el("span", { style: "font-weight:800" }, "⚙️ Settings"),
              el("span", { class: "hint" }, "›  Pages"),
            ]));
            body.append(el("p", { class: "hint" }, "這裡是打開網站的開關。選好「哪個分支」當網站來源，按 Save。"));
            body.append(el("div", { class: "gh-field" }, [
              el("label", { class: "gh-label" }, "Branch"),
              el("select", { class: "gh-input" }, [el("option", {}, "main"), el("option", {}, "None")]),
            ]));
            body.append(el("div", { class: "tip-tag" }, "👉 分支選 main，按 Save"));
            body.append(el("button", { class: "gh-btn gh-btn--green point-here", type: "button", onClick: () => { sim = 4; renderSim(); } }, "Save"));
            return browser(`github.com/你/${repoName}/settings/pages`, body);
          },

          // 2-4：上線成功
          () => {
            const body = el("div", {});
            body.append(el("div", { class: "callout", style: "border-color:#2da44e;background:var(--success-soft);color:var(--success)" }, [
              el("b", {}, "✅ Your site is live!  "),
              document.createTextNode("網站已上線："),
              el("br"),
              el("code", { class: "inline" }, "https://你的帳號.github.io/my-first-site/"),
            ]));
            body.append(el("p", { class: "hint" }, "（真的操作時，第一次可能要等 1～2 分鐘才會出現。）"));
            return browser(`github.com/你/${repoName}/settings/pages`, body);
          },
        ];

        renderSim();

        const proceed = el("button", { class: "btn btn--primary", type: "button", onClick: next }, "我練會了，換我真的做一次 →");
        v.append(el("div", { style: "margin-top:10px" }, proceed));
        return v;
      },

      // ========== 步驟 3：真的做一次 + 驗證 ==========
      () => {
        const v = el("div", { class: "stack" });
        v.append(
          el("span", { class: "eyebrow" }, "步驟 3 / 3 · 真的動手"),
          el("h2", {}, "換你在真的 GitHub 上部署 🚀"),
          el("div", { class: "callout" }, [
            document.createTextNode("跟著清單一步步做。每做完一項就打勾。需要一個檔案的話，先"),
            el("b", {}, "下載我們準備好的 index.html"),
            document.createTextNode("去上傳就好。"),
          ])
        );

        v.append(el("button", { class: "btn btn--accent", type: "button", onClick: downloadStarter }, "⬇ 下載範本 index.html"));

        const items = [
          { t: "登入 / 註冊 GitHub 帳號", d: "還沒有帳號？免費註冊。", href: "https://github.com/signup" },
          { t: "建立一個新的 Public repository", d: "打開建立頁面，取名字、選 Public、Create。", href: "https://github.com/new" },
          { t: "上傳 index.html 並 Commit", d: "在 repo 裡：Add file → Upload files → 拖檔案 → Commit changes。" },
          { t: "打開 Pages 開關", d: "Settings → Pages → Branch 選 main → Save。" },
          { t: "等 1～2 分鐘，打開你的網址看看", d: "網址長得像 https://你的帳號.github.io/repo名稱/" },
        ];

        const checkState = new Array(items.length).fill(false);
        const list = el("ul", { class: "checklist" });
        const verifyBox = el("div");

        items.forEach((it, i) => {
          const cb = el("input", { type: "checkbox", id: "ck" + i });
          const li = el("li", {}, [
            cb,
            el("div", { class: "ci-body" }, [
              el("div", { class: "ci-title" }, it.href
                ? [el("a", { href: it.href, target: "_blank", rel: "noopener" }, it.t + " ↗")]
                : it.t),
              el("div", { class: "ci-desc" }, it.d),
            ]),
          ]);
          cb.addEventListener("change", () => {
            checkState[i] = cb.checked;
            li.classList.toggle("is-checked", cb.checked);
            const all = checkState.every(Boolean);
            verifyBox.style.display = all ? "block" : "none";
            if (all) { verifyBox.scrollIntoView({ behavior: "smooth", block: "center" }); }
          });
          list.append(li);
        });
        v.append(list);

        // 驗證網址
        verifyBox.style.display = "none";
        const input = el("input", { class: "gh-input", type: "url", placeholder: "https://你的帳號.github.io/..." });
        const msg = el("div", { class: "verify__msg" });
        const checkBtn = el("button", { class: "btn btn--primary", type: "button" }, "驗證我的網站 ✅");

        const finish = (url) => {
          stage.replaceChildren(
            doneScreen({
              icon: "🚀",
              title: "你把網站部署上線了！",
              badge: BADGE,
              text: "這正是這個教學網站本身的做法。你已經完成整條主線：概念 → 模擬 → 真的部署。",
              secondary: {
                label: "打開我的網站 ↗",
                onClick: () => window.open(url, "_blank", "noopener"),
              },
              primary: { label: "回地圖看看下一關 →", onClick: () => ctx.goMap() },
            })
          );
          ctx.complete(BADGE);
        };

        const validate = () => {
          const val = input.value.trim();
          const ok = /^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.github\.io(\/\S*)?$/i.test(val);
          if (ok) {
            msg.className = "verify__msg ok";
            msg.textContent = "網址格式正確，看起來就是 GitHub Pages！🎉";
            setTimeout(() => finish(val), 700);
          } else if (!val) {
            msg.className = "verify__msg no";
            msg.textContent = "先把你的網址貼上來吧。";
          } else {
            msg.className = "verify__msg no";
            msg.textContent = "格式不太對喔～應該長得像 https://你的帳號.github.io/repo名稱/";
          }
        };
        checkBtn.addEventListener("click", validate);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter") validate(); });

        verifyBox.append(
          el("hr", { style: "border:none;border-top:1px solid var(--border);margin:18px 0" }),
          el("h3", {}, "全部打勾了！貼上你的網址驗證過關"),
          el("div", { class: "verify__row" }, [input, checkBtn]),
          msg,
          el("p", { class: "hint", style: "margin-top:10px" }, "（還沒真的做完也沒關係 —— 之後回來貼上網址就能拿到徽章。）")
        );
        v.append(verifyBox);
        return v;
      },
    ];

    draw();
  },
};
