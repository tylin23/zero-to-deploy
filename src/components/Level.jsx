import { useState } from "react";
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

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const finish = (payload) => {
    setResult({ payload: payload === undefined ? true : payload });
    if (badge) ctx.complete(badge);
    else ctx.complete();
  };

  if (result) {
    const d = typeof done === "function" ? done(result.payload) : done;
    return <DoneScreen badge={badge} {...d} />;
  }

  return (
    <div>
      <StepBar current={step} total={total ?? steps.length} doneUntil={step - 1} />
      {step > 0 && (
        <button
          type="button"
          onClick={back}
          className="text-muted hover:text-ink text-sm font-bold mb-2 inline-flex items-center gap-1"
        >
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
