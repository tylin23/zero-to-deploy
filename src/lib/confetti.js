// 過關慶祝彩帶：在畫面上灑下彩色紙片
export function celebrate() {
  const colors = ["#26418f", "#3b7dd8", "#2fce88", "#ffc93c", "#4aa8ff", "#ff6b9d"];
  const layer = document.createElement("div");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:100;overflow:hidden";
  document.body.append(layer);

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    const size = 6 + Math.random() * 8;
    piece.style.background = colors[i % colors.length];
    piece.style.left = Math.random() * 100 + "%";
    piece.style.top = "-20px";
    piece.style.width = size + "px";
    piece.style.height = size * 1.4 + "px";
    piece.style.borderRadius = Math.random() > 0.5 ? "2px" : "50%";
    layer.append(piece);

    const dx = (Math.random() - 0.5) * 260;
    const dy = window.innerHeight + 60;
    const rot = (Math.random() - 0.5) * 900;
    piece.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0.9 },
      ],
      { duration: 1600 + Math.random() * 1400, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" }
    );
  }
  setTimeout(() => layer.remove(), 3200);
}
