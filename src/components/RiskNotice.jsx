import { useState } from "react";
import { useProgress } from "../state/progress.jsx";

// 風險預告書：進入闖關前先閱讀並確認（公務／行政使用情境）
export default function RiskNotice({ navigate, next }) {
  const { ackRisk, riskAck } = useProgress();
  const [checked, setChecked] = useState(false);

  // next：被閘門擋下時記住原本要去的地方，確認後直接送過去
  const proceed = () => { ackRisk(); navigate(next || "#/map"); };

  return (
    <div className="max-w-[720px] mx-auto">
      <div className="text-center mb-5">
        <div className="text-5xl mb-2">📋</div>
        <span className="uppercase tracking-[2.5px] text-xs font-extrabold text-accent">開始之前</span>
        <h1 className="text-[clamp(24px,5vw,34px)] font-bold text-ink">風險預告書</h1>
        <p className="text-muted text-sm">請先閱讀，特別是在公務／行政情境使用時。</p>
        {next && <p className="text-accent text-sm font-bold m-0">要開始操作之前，請先看過這份說明 👇</p>}
      </div>

      <div className="card space-y-4">
        <div className="callout" style={{ borderLeftColor: "var(--sun)", background: "color-mix(in srgb, var(--sun) 14%, var(--surface))" }}>
          <b className="text-ink">每一種部署方式都有它的風險。</b>「部署」的本質，就是把你的檔案或資料，放到<b className="text-ink">你自己電腦以外的地方</b>（別人的平台、對外的網路）。在動手之前，請務必想清楚：<b className="text-ink">這份資料，真的可以上傳／對外嗎？</b>
        </div>

        <section>
          <h3 className="text-ink font-bold flex items-center gap-2">🔐 資料與資安，請特別留意</h3>
          <ul className="grid gap-2 list-disc pl-6 text-sm text-ink mt-2">
            <li><b>上傳前先確認可以上傳。</b>確認這份資料屬於可公開或可交付第三方的範圍，並符合機關的資訊公開與資安規範、必要時先取得長官核准。</li>
            <li><b>保護個人資料。</b>切勿把民眾個資（姓名、身分證號、電話、案件內容）或公務機密上傳到對外／第三方平台，以免違反《個人資料保護法》與相關規定。</li>
            <li><b>練習用假資料。</b>本教材與各平台練習，一律使用<b>假資料或去識別化資料</b>，不要用真實的公務或民眾資料。</li>
            <li><b>境外第三方服務。</b>GitHub、Hugging Face、Discord/Slack 等多為境外服務；上傳等於把資料交給第三方，可能被保存、索引或用於改善其服務。</li>
            <li><b>金鑰與密碼。</b>Webhook 網址、API 金鑰、憑證等同通行鑰匙，切勿寫進公開的原始碼或截圖分享。</li>
          </ul>
        </section>

        <div className="callout callout-info">
          每一關的最上方，都會附上<b className="text-ink">該部署方式的具體風險備注</b>，記得先看過再動手。本教材僅供學習，實際導入請依所屬機關的資安與個資規範辦理。
        </div>

        <label className="flex items-start gap-3 p-3.5 border-2 border-line rounded-[14px] bg-surface cursor-pointer">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} style={{ width: 22, height: 22, accentColor: "var(--primary)" }} className="mt-0.5 shrink-0" />
          <span className="text-sm text-ink font-bold">我已閱讀並了解上述風險，會留意自身資料與資安，並確保上傳的資料是可以公開／可上傳的。</span>
        </label>

        <div className="flex flex-wrap gap-3 justify-end">
          <button type="button" className="btn btn-ghost" onClick={() => navigate("#/")}>返回首頁</button>
          <button type="button" className="btn btn-primary" disabled={!checked} onClick={proceed}>
            {riskAck ? "我了解，前往地圖 →" : "我了解，開始闖關 →"}
          </button>
        </div>
      </div>
    </div>
  );
}
