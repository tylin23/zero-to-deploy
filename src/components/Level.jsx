import { useEffect, useRef, useState } from "react";
import { scrollToTop } from "../lib/scroll.js";
import StepBar from "./StepBar.jsx";
import DoneScreen from "./DoneScreen.jsx";

/**
 * 關卡共用骨架：管步驟、進度條、卡片外框、過關畫面。
 * 各關只要專心寫「每一步的內容」。
 *
 *   <Level ctx={ctx} badge={BADGES.x}
 *     done={{ icon, title, text, secondary, primary }}   // 或 (payload) => ({...})
 *     steps={[
 *       ({ next })   => <ConceptStep onNext={next} />,
 *       ({ finish }) => <RealStep onFinish={finish} />,
 *     ]} />
 */
export default function Level({ ctx, badge, steps, done, total }) {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null); // null = 尚未過關

  // 換步驟（和進到過關畫面）時回到頂端。這裡沒有換網址，所以路由那層的
  // 捲動不會觸發 —— 不補這一段，使用者會停在上一步的捲動位置。
  // 第一次進來不用捲，那在路由換頁時已經做過了。
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    scrollToTop();
  }, [step, result]);

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const finish = (payload) => {
    setResult({ payload: payload === undefined ? true : payload });
    if (badge) ctx.complete(badge);
    else ctx.complete();
  };

  if (result) {
    const d = typeof done === "function" ? done(result.payload) : done;
    // 多數關卡的過關按鈕都一樣，這裡給預設值，關卡只在不同時才覆寫。
    // 主按鈕直接送去「真的下一關」，不用再繞回地圖找。
    const buttons = {
      secondary: { label: "回地圖", onClick: () => ctx.goMap() },
      primary: ctx.next
        ? { label: `下一關：${ctx.next.short || ctx.next.title} →`, onClick: () => ctx.goNext() }
        : { label: "回地圖看成果 🏆", onClick: () => ctx.goMap() },
    };
    return <DoneScreen badge={badge} {...buttons} {...d} />;
  }

  return (
    <div>
      <StepBar current={step} total={total ?? steps.length} doneUntil={step - 1} />
      {step > 0 && (
        // 原本是一行小字的連結，很容易被上面的步驟標題蓋過去，看起來像「只有下一步」。
        // 改成跟「下一步」同一套按鈕樣式（只是用 ghost 當次要動作），讓它讀起來就是一顆按鈕。
        <button type="button" onClick={back} className="btn btn-ghost btn-sm mb-3">
          ← 回上一步
        </button>
      )}
      <div className="card">{steps[step]({ next, back, finish, step })}</div>
    </div>
  );
}

// 每一步開頭的小標（取代各關重複的 uppercase tracking 字串）
export function Eyebrow({ children }) {
  return (
    <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accentText">{children}</span>
  );
}
