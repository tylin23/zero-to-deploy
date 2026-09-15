import { useEffect, useRef, useState } from "react";

/**
 * 可點擊放大的示意圖。
 *
 * 為什麼需要放大：資訊密度高的圖（例如前後端分工圖，底部還有六項圖例）
 * 縮到手機寬度就看不清楚了。點一下開全螢幕，手機上用原尺寸呈現、可左右滑動看細節。
 *
 * 圖若載不到就整塊不顯示 —— 跟 SceneMap 一樣，關卡本身的文字內容是完整的，
 * 不會出現破圖或空白區塊。所以圖還沒放進 public/images/ 也不影響上課。
 */
export default function ZoomFigure({ src, alt, caption }) {
  const [broken, setBroken] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // 放大時鎖住背景捲動，不然手指在圖上滑會連背後的頁面一起動
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      // 關閉後把焦點還給原本那顆按鈕，鍵盤使用者才不會跳回頁面最上面
      openerRef.current?.focus();
    };
  }, [open]);

  if (broken) return null;

  return (
    <>
      <figure className="m-0" data-zoomfig>
        <button
          type="button"
          ref={openerRef}
          onClick={() => setOpen(true)}
          aria-label={alt + "（點擊放大）"}
          className="block w-full rounded-[14px] border-2 border-line bg-surface overflow-hidden cursor-zoom-in hover:border-primary transition-colors"
        >
          <img
            src={src}
            alt={alt}
            onError={() => setBroken(true)}
            className="block w-full h-auto"
          />
        </button>
        <figcaption className="text-muted text-xs mt-1.5 flex items-center gap-1.5 flex-wrap">
          <span aria-hidden="true">🔍</span>
          <span>點圖可放大{caption ? " —— " + caption : ""}</span>
        </figcaption>
      </figure>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          data-zoomlightbox
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] flex flex-col animate-pop"
          style={{ background: "rgba(10,14,25,.92)" }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0">
            <span className="text-white/75 text-xs sm:hidden">左右滑動可以看細節</span>
            <span className="text-white/75 text-xs hidden sm:inline">按 Esc 或點背景關閉</span>
            <button
              type="button"
              ref={closeRef}
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-2 text-sm font-bold text-white border-2 border-white/30 hover:bg-white/15 transition-colors"
            >
              關閉 ✕
            </button>
          </div>
          <div className="zoom-stage flex-1 px-3 pb-4" onClick={(e) => e.stopPropagation()}>
            <img src={src} alt={alt} />
          </div>
        </div>
      )}
    </>
  );
}
