import { totalReady } from "../data/levels.js";
import { TERMS } from "../data/terms.js";

// 全站四個主要區塊。首頁、地圖、指南、名詞小教室都要隨時切得動。
export const NAV_ITEMS = [
  { to: "#/", icon: "🏠", label: "首頁", short: "首頁", desc: "課程總覽" },
  { to: "#/map", icon: "🗺️", label: "闖關地圖", short: "闖關", desc: `${totalReady} 關動手做` },
  { to: "#/guide", icon: "🧭", label: "選型指南", short: "指南", desc: "我該用哪一種" },
  { to: "#/terms", icon: "📇", label: "名詞小教室", short: "名詞", desc: `${TERMS.length} 張概念卡` },
];

// 目前 hash 對應到哪一個分頁（關卡頁算在「闖關地圖」底下）
export function activeNav(hash) {
  if (hash.startsWith("#/map") || hash.startsWith("#/level/")) return "#/map";
  if (hash.startsWith("#/guide")) return "#/guide";
  if (hash.startsWith("#/terms")) return "#/terms";
  if (hash === "#/" || hash === "" || hash === "#") return "#/";
  return null; // 風險預告書等次要頁面：不高亮任何分頁
}

/* ---------- 桌機：頂端分頁列 ---------- */
export function NavTabs({ hash, navigate }) {
  const active = activeNav(hash);
  return (
    <nav aria-label="主要導覽" className="hidden md:flex items-center gap-1">
      {NAV_ITEMS.map((it) => {
        const on = active === it.to;
        return (
          <button
            key={it.to}
            type="button"
            onClick={() => navigate(it.to)}
            aria-current={on ? "page" : undefined}
            title={it.desc}
            className={`inline-flex items-center gap-1.5 px-2.5 lg:px-3.5 py-2 rounded-[14px] text-sm font-bold border-2 whitespace-nowrap transition-colors ${
              on
                ? "border-primary bg-primarySoft text-primary"
                : "border-transparent text-muted hover:text-ink hover:border-line"
            }`}
          >
            <span aria-hidden="true">{it.icon}</span>
            {/* 中等寬度用短標籤，才不會被擠到換行 */}
            <span className="lg:hidden">{it.short}</span>
            <span className="hidden lg:inline">{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---------- 手機：底部分頁列（拇指按得到） ---------- */
export function BottomNav({ hash, navigate }) {
  const active = activeNav(hash);
  return (
    <nav
      aria-label="主要導覽"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-line backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--surface) 92%, transparent)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="grid grid-cols-4">
        {NAV_ITEMS.map((it) => {
          const on = active === it.to;
          return (
            <button
              key={it.to}
              type="button"
              onClick={() => navigate(it.to)}
              aria-current={on ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-0.5 py-2 px-1 relative"
              style={{ color: on ? "var(--primary)" : "var(--muted)" }}
            >
              {/* 選取狀態除了顏色，另有頂部色條（不只用顏色表達狀態） */}
              <span
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full"
                style={{ background: on ? "var(--primary)" : "transparent" }}
              />
              <span className="text-[19px] leading-none" aria-hidden="true">
                {it.icon}
              </span>
              <span className={`text-[11px] ${on ? "font-extrabold" : "font-bold"}`}>{it.short}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
