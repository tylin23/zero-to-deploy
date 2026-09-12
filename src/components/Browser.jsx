// 模擬瀏覽器視窗外框（用於模擬 GitHub 介面）
export default function Browser({ url, children }) {
  return (
    <div
      className="border-2 border-line rounded-[22px] overflow-hidden bg-surface2 my-1.5"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-center gap-2 py-2.5 px-3.5 bg-surface border-b-2 border-line">
        <div className="flex gap-1.5">
          <i className="w-2.5 h-2.5 rounded-full block" style={{ background: "#ff5f57" }} />
          <i className="w-2.5 h-2.5 rounded-full block" style={{ background: "#febc2e" }} />
          <i className="w-2.5 h-2.5 rounded-full block" style={{ background: "#28c840" }} />
        </div>
        <div className="flex-1 font-mono text-xs text-muted bg-surface2 rounded-lg py-1 px-2.5 truncate">
          {url}
        </div>
      </div>
      <div className="p-4 sm:p-5 min-h-[180px]">{children}</div>
    </div>
  );
}
