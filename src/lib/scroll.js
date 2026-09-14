// 換頁、換步驟之後都要回到頂端，否則使用者會停在上一畫面的捲動位置，
// 還要自己往上找新內容（尤其步驟很長的關卡）。
// 有開「減少動態效果」的人直接跳，不做平滑捲動。
export function scrollToTop() {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}
