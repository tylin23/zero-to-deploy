import { useMemo, useState } from "react";
import { DIMS, decide } from "../data/decide.js";
import { diffText } from "../data/levels.js";

/* 選型決策計算機。

   它不是「平台選擇器」，而是「界線檢查器，順便在安全的時候給你平台建議」。
   所以踩到紅線時畫面不是錯誤狀態，而是一個正式的答案 ——
   第 4 關那句「停下來 ≠ 不能做」就是這一頁的骨幹：
   知道什麼時候該停，本身就是這門課要教的判斷。

   也因此每個結果都會附上「為什麼」和「誰被排除、為什麼」，
   而不是只丟一個答案 —— 第 5 關說過「重點不是記住規格，
   是知道什麼情況該選誰」，只給答案的黑盒子會把那句話抵銷掉。 */
export default function DecideCalculator({ methodName, onGoLevel }) {
  const [ans, setAns] = useState({});
  const done = DIMS.every((d) => ans[d.id]);
  const result = useMemo(() => (done ? decide(ans) : null), [ans, done]);

  const answered = DIMS.filter((d) => ans[d.id]).length;

  return (
    <div className="card space-y-4 mb-6" data-calc>
      <div>
        <h3 className="text-ink font-bold m-0">🧮 選型決策計算機</h3>
        <p className="text-muted text-sm mt-1 mb-0">
          回答五個問題，它會告訴你能不能自己做、以及該用哪一種方式。
          <b className="text-ink">先講結論：很多情況它會叫你停下來找資訊單位</b>
          —— 那不是它壞了，那就是答案。
        </p>
      </div>

      <div className="grid gap-3.5">
        {DIMS.map((d, i) => (
          <fieldset key={d.id} data-dim={d.id} className="border-0 p-0 m-0">
            <legend className="text-[13px] font-extrabold text-ink mb-1.5 p-0">
              <span className="text-accentText">{i + 1}.</span> {d.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {d.options.map((o) => {
                const on = ans[d.id] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={on}
                    data-opt={o.id}
                    onClick={() => setAns((s) => ({ ...s, [d.id]: o.id }))}
                    className={`text-left px-3 py-2 rounded-[12px] border-2 text-[13.5px] leading-snug transition-all ${
                      on ? "border-primary bg-primarySoft text-ink font-bold" : "border-line bg-surface text-ink hover:border-primary"
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {!done && (
        <p className="text-xs text-muted m-0" data-progress>
          還有 {DIMS.length - answered} 題沒選（{answered} / {DIMS.length}）
        </p>
      )}

      {result && (
        <div className="space-y-3 animate-pop" data-result>
          {result.blocked ? (
            <Stopped gates={result.gates} />
          ) : result.contradiction ? (
            <div
              className="callout m-0"
              data-clash
              style={{
                borderLeftColor: "var(--sun)",
                background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
              }}
            >
              <b className="text-ink">這兩個選項對不上 🤔</b>
              <div className="mt-1.5 text-sm">{result.contradiction}</div>
            </div>
          ) : (
            <Suggestions result={result} methodName={methodName} onGoLevel={onGoLevel} />
          )}

          {result.warnings.map((w) => (
            <div
              key={w}
              data-warn
              className="callout m-0"
              style={{
                borderLeftColor: "var(--sun)",
                background: "color-mix(in srgb, var(--sun) 12%, var(--surface))",
              }}
            >
              <b className="text-ink">順便提醒：</b>
              <span className="text-sm">{w}</span>
            </div>
          ))}

          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAns({})}>
            ↺ 重新算一次
          </button>
        </div>
      )}
    </div>
  );
}

/* 踩到紅線 —— 這是一個正式答案，不是錯誤畫面。 */
function Stopped({ gates }) {
  return (
    <div
      className="callout m-0"
      data-stopped
      style={{
        borderLeftColor: "var(--danger)",
        background: "color-mix(in srgb, var(--danger) 8%, var(--surface))",
      }}
    >
      <b className="text-ink">判斷結果：先停下來，這件事該找資訊單位 🛑</b>
      <div className="mt-1.5 text-sm">
        你的情況踩到{gates.length > 1 ? `這 ${gates.length} 條紅線` : "這條紅線"}：
      </div>
      <div className="mt-2 grid gap-2">
        {gates.map((g) => (
          <div
            key={g.id}
            data-gate={g.id}
            className="border-2 border-line rounded-[12px] bg-surface p-3"
          >
            <div className="font-extrabold text-sm text-danger">🔴 {g.line}</div>
            <p className="text-sm text-ink mt-1 mb-0">{g.why}</p>
            {g.safe && (
              <p className="text-[13px] text-muted mt-1.5 mb-0">
                <b className="text-ink">還是想動手的話：</b>
                {g.safe}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2.5 text-sm text-ink">
        <b>停下來 ≠ 不能做。</b>
        只是代表這件事該由資訊單位評估、或由他們接手管理後再做 —— 對你也是保護。
      </div>
    </div>
  );
}

/* 沒踩紅線：給建議，但一定同時給「為什麼」和「誰被排除」。 */
function Suggestions({ result, methodName, onGoLevel }) {
  const { picks, formal, ruledOut } = result;
  const top = picks.slice(0, 2);
  const rest = picks.slice(2);

  return (
    <div className="space-y-2.5">
      {top.length ? (
        <>
          <div
            className="callout m-0"
            style={{
              borderLeftColor: "var(--mint)",
              background: "color-mix(in srgb, var(--mint) 12%, var(--surface))",
            }}
          >
            <b className="text-ink">判斷結果：這個範圍你可以自己做 ✅</b>
            <div className="mt-1 text-sm">
              照你選的條件，門檻最低的{top.length > 1 ? "兩個" : ""}做法是：
            </div>
          </div>

          <div className="grid gap-2.5">
            {top.map((p) => (
              <div
                key={p.id}
                data-pick={p.id}
                className="border-2 rounded-[14px] bg-surface p-3.5"
                style={{ borderColor: "var(--accent)" }}
              >
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <b className="text-ink">{methodName(p.id)}</b>
                  <span className="text-xs text-muted font-bold">{diffText(p.difficulty)}</span>
                </div>
                <p className="text-sm text-ink mt-1 mb-0">{p.fit}</p>
                {p.caveat && (
                  <p className="text-[13px] mt-1.5 mb-0 text-danger font-bold" data-caveat>
                    ⚠️ {p.caveat}
                  </p>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-sm mt-2.5"
                  onClick={() => onGoLevel(p.id)}
                >
                  去看這一關 →
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          className="callout m-0"
          style={{
            borderLeftColor: "var(--sun)",
            background: "color-mix(in srgb, var(--sun) 14%, var(--surface))",
          }}
        >
          <b className="text-ink">這個組合沒有「可以自己做」的現成方案。</b>
          <div className="mt-1 text-sm">
            下面那些偏正式系統的做法技術上做得到，但那通常是資訊單位的範圍 —— 建議帶著需求去跟他們談。
          </div>
        </div>
      )}

      {(rest.length > 0 || formal.length > 0 || ruledOut.length > 0) && (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted font-bold">
            看它是怎麼算出來的（其他選項、以及誰被排除）
          </summary>
          <div className="mt-2 space-y-2.5">
            {rest.length > 0 && (
              <div data-rest>
                <div className="text-xs font-extrabold text-muted mb-1">其他也可以，但門檻高一些</div>
                <ul className="list-none p-0 m-0 grid gap-1">
                  {rest.map((p) => (
                    <li key={p.id} className="text-sm text-ink">
                      · {methodName(p.id)}
                      <span className="text-muted">（{diffText(p.difficulty)}）</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {formal.length > 0 && (
              <div data-formal>
                <div className="text-xs font-extrabold text-muted mb-1">
                  偏正式系統的做法（了解即可，通常要找資訊單位）
                </div>
                <ul className="list-none p-0 m-0 grid gap-1">
                  {formal.map((p) => (
                    <li key={p.id} className="text-sm text-ink">
                      · {methodName(p.id)}
                      <span className="text-muted">（{diffText(p.difficulty)}）</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {ruledOut.length > 0 && (
              <div data-ruled>
                <div className="text-xs font-extrabold text-muted mb-1">被排除的，以及為什麼</div>
                <ul className="list-none p-0 m-0 grid gap-1">
                  {ruledOut.map((r) => (
                    <li key={r.id} className="text-sm text-muted">
                      · {methodName(r.id)}　—　{r.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </details>
      )}

      <p className="text-xs text-muted m-0">
        這台計算機只看得到你勾的那幾個格子。真正要上線前，還是回頭對一次
        <b className="text-ink">「這個我可以自己做嗎」</b>那一關的五條紅線。
      </p>
    </div>
  );
}
