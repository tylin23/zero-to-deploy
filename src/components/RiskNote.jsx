// 每一關頂部顯示的「部署風險備注」（公務／行政情境）
// 用原生 <details> 讓它可收合、且無障礙友善
export default function RiskNote({ risk }) {
  if (!risk) return null;
  return (
    <details
      open
      className="rounded-[14px] border-2 mb-4 overflow-hidden"
      style={{ borderColor: "color-mix(in srgb, var(--sun) 55%, var(--border))", background: "color-mix(in srgb, var(--sun) 14%, var(--surface))" }}
    >
      <summary className="cursor-pointer select-none list-none px-4 py-3 font-extrabold text-ink flex items-center gap-2">
        <span className="text-lg">⚠️</span>
        <span>部署風險備注</span>
        <span className="pill ml-1" style={{ background: "color-mix(in srgb, var(--sun) 30%, transparent)", color: "var(--ink)" }}>
          風險等級：{risk.level}
        </span>
        <span className="ml-auto text-muted text-xs font-normal">點此收合／展開</span>
      </summary>
      <ul className="px-4 pb-3.5 pt-0 m-0 grid gap-1.5 list-disc pl-9 text-sm text-ink">
        {risk.points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </details>
  );
}
