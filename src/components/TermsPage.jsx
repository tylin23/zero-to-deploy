import { useEffect, useRef, useState } from "react";
import { TERMS, TERM_CATS } from "../data/terms.js";
import { mapOrder } from "../data/levels.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const levelMeta = (id) => mapOrder.find((l) => l.id === id) || {};
const CAT = {
  perf: { label: "效能 · 穩定", color: "var(--accent)" },
  ops: { label: "部署 · 維運", color: "var(--sun)" },
  sec: { label: "安全 · 存取", color: "var(--mint)" },
};

export default function TermsPage({ navigate, focusId }) {
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState(() => new Set(focusId ? [focusId] : []));
  const refs = useRef({});

  useEffect(() => {
    if (focusId && refs.current[focusId]) {
      refs.current[focusId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusId]);

  const toggle = (id) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const shown = cat === "all" ? TERMS : TERMS.filter((t) => t.cat === cat);

  return (
    <div>
      <div className="text-center mb-5">
        <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">名詞小教室</span>
        <h1 className="text-[clamp(24px,5vw,34px)] font-bold text-ink">📇 看懂這些詞，就能跟系統對話</h1>
        <p className="text-muted text-sm">
          給剛接觸開發的你：不用會實作，但懂了這些「為什麼要這樣設計」，做事更順、也更能跟資訊單位溝通。
        </p>
      </div>

      {/* 分類篩選 */}
      <div className="flex flex-wrap gap-2 justify-center mb-5">
        {TERM_CATS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${cat === c.id ? "border-primary bg-primarySoft text-primary" : "border-line bg-surface text-muted hover:border-primary"}`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-start">
        {shown.map((t) => (
          <TermCard
            key={t.id}
            t={t}
            isOpen={open.has(t.id)}
            onToggle={() => toggle(t.id)}
            navigate={navigate}
            innerRef={(el) => (refs.current[t.id] = el)}
          />
        ))}
      </div>
    </div>
  );
}

function TermCard({ t, isOpen, onToggle, navigate, innerRef }) {
  const cat = CAT[t.cat];
  return (
    <div ref={innerRef} className="card card-flush overflow-hidden scroll-mt-24">
      <button type="button" onClick={onToggle} className="w-full text-left p-4 sm:p-5 flex gap-3 items-start">
        <span className="text-3xl leading-none">{t.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-ink text-lg">{t.name}</span>
            <span className="text-muted text-xs font-mono">{t.en}</span>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: "color-mix(in srgb, " + cat.color + " 16%, var(--surface))",
                color: "var(--ink)",
              }}
            >
              {cat.label}
            </span>
          </div>
          <p className="text-ink text-sm mt-1 mb-0 font-semibold">{t.oneLiner}</p>
        </div>
        <span className="text-muted text-lg mt-1">{isOpen ? "▴" : "▾"}</span>
      </button>

      {isOpen && (
        <div className="px-4 sm:px-5 pb-5 pt-0 space-y-3 border-t-2 border-line">
          <div className="mt-3">
            <div className="text-xs font-extrabold text-muted mb-1">🔎 用生活比喻</div>
            <p className="text-sm text-ink m-0">{t.analogy}</p>
          </div>
          <div>
            <div className="text-xs font-extrabold text-muted mb-1">🏢 這跟你有什麼關係</div>
            <p className="text-sm text-ink m-0">{t.relation}</p>
          </div>

          {t.demo === "cache" && <CacheDemo />}
          {t.demo === "idem" && <IdemDemo />}

          {(t.goLevel || t.related) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {t.goLevel && (
                <button type="button" className="gh-btn" onClick={() => navigate("#/level/" + t.goLevel)}>
                  🎮 去玩「{levelMeta(t.goLevel).title}」互動關 →
                </button>
              )}
              {(t.related || []).map((lid) => (
                <button key={lid} type="button" className="gh-btn" onClick={() => navigate("#/level/" + lid)}>
                  🔗 相關關卡：{levelMeta(lid).emoji} {levelMeta(lid).title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- 快取小互動：第一次慢、之後秒回、更新後又變慢 ---------- */
function CacheDemo() {
  const [cached, setCached] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [from, setFrom] = useState(null); // source | cache
  const [saved, setSaved] = useState(0);

  const query = async () => {
    if (status === "loading") return;
    if (cached) {
      setFrom("cache");
      setStatus("done");
      setSaved((s) => s + 1);
      return;
    }
    setStatus("loading");
    setFrom(null);
    await sleep(1100);
    setCached(true);
    setFrom("source");
    setStatus("done");
  };
  const invalidate = () => {
    setCached(false);
    setFrom(null);
    setStatus("idle");
  };

  return (
    <div className="border-2 border-line rounded-[14px] bg-surface2 p-3.5">
      <div className="text-xs font-extrabold text-muted mb-2">
        🧪 玩玩看：連按幾次「查詢」，再按「資料更新了」
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          className="btn btn-accent btn-sm"
          onClick={query}
          disabled={status === "loading"}
        >
          🔍 查詢 YouBike 站點
        </button>
        <button type="button" className="gh-btn" onClick={invalidate}>
          🔄 資料更新了（清快取）
        </button>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{
            background: cached ? "var(--success-soft)" : "var(--surface)",
            color: cached ? "var(--success)" : "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          快取：{cached ? "已存有" : "空的"}
        </span>
      </div>
      <div className="mt-2 text-sm font-bold min-h-[1.4em]">
        {status === "loading" && <span className="text-muted">⏳ 去資料源抓…（約 1.2 秒）</span>}
        {status === "done" && from === "source" && (
          <span style={{ color: "var(--danger)" }}>🐢 這次從資料源抓回（慢）</span>
        )}
        {status === "done" && from === "cache" && (
          <span style={{ color: "var(--success)" }}>⚡ 從快取直接回（幾乎 0 秒）</span>
        )}
      </div>
      {saved > 0 && <div className="text-xs text-muted mt-1">👍 快取已幫你省下 {saved} 次重抓資料源</div>}
    </div>
  );
}

/* ---------- 冪等小互動：連按送出會不會建立重複案件 ---------- */
function IdemDemo() {
  const [idem, setIdem] = useState(false);
  const [cases, setCases] = useState([]);

  const setMode = (v) => {
    setIdem(v);
    setCases([]);
  };
  const submit = () => {
    setCases((cs) => {
      if (idem) {
        if (cs.length > 0) return cs; // 用申請編號判斷，同一筆不再重複建立
        return [{ id: 1, dup: false }];
      }
      return [...cs, { id: cs.length + 1, dup: cs.length > 0 }];
    });
  };

  const dups = cases.filter((c) => c.dup).length;

  return (
    <div className="border-2 border-line rounded-[14px] bg-surface2 p-3.5">
      <div className="text-xs font-extrabold text-muted mb-2">🧪 玩玩看：把「送出」連按很多下</div>
      <label className="flex items-center gap-2 mb-2.5 text-sm font-bold cursor-pointer">
        <input
          type="checkbox"
          checked={idem}
          onChange={(e) => setMode(e.target.checked)}
          style={{ width: 20, height: 20, accentColor: "var(--mint)" }}
        />
        開啟冪等（用「申請編號」判斷是不是同一筆）
      </label>
      <button type="button" className="btn btn-accent btn-sm" onClick={submit}>
        📨 市民送出申請
      </button>

      <div className="mt-2.5 grid gap-1.5">
        {cases.length === 0 ? (
          <div className="text-muted text-sm">還沒有案件——連按上面的按鈕看看</div>
        ) : (
          cases.map((c) => (
            <div
              key={c.id}
              className={`text-sm px-3 py-1.5 rounded-lg border-2 ${c.dup ? "border-danger bg-dangerSoft text-danger font-bold" : "border-line bg-surface text-ink"}`}
            >
              案件 A-1130512 {c.dup ? "　← 重複！" : ""}
            </div>
          ))
        )}
      </div>
      {cases.length > 0 && (
        <div className="text-xs mt-2 font-bold" style={{ color: dups ? "var(--danger)" : "var(--success)" }}>
          {idem
            ? "✅ 不管按幾次，都只建立 1 筆案件"
            : dups
              ? `❌ 建立了 ${cases.length} 筆重複案件！`
              : "按第二次看看會怎樣…"}
        </div>
      )}
    </div>
  );
}
