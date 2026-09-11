/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      // 顏色統一對應 index.css 定義的 CSS 變數（藍色系 #26418F）
      colors: {
        ink: "var(--ink)",
        muted: "var(--muted)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        line: "var(--border)",
        primary: "var(--primary)",
        primaryDark: "var(--primary-dark)",
        primarySoft: "var(--primary-soft)",
        accent: "var(--accent)",
        accentDark: "var(--accent-dark)",
        accentSoft: "var(--accent-soft)",
        mint: "var(--mint)",
        mintDark: "var(--mint-dark)",
        success: "var(--success)",
        successSoft: "var(--success-soft)",
        sun: "var(--sun)",
        danger: "var(--danger)",
        dangerSoft: "var(--danger-soft)",
        track: "var(--track)",
      },
      fontFamily: {
        sans: [
          "Noto Sans TC", "PingFang TC", "Microsoft JhengHei",
          "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif",
        ],
        mono: ["SF Mono", "JetBrains Mono", "Fira Code", "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: { xl2: "22px" },
      keyframes: {
        pop: { "0%": { transform: "scale(.2)", opacity: 0 }, "100%": { transform: "scale(1)", opacity: 1 } },
        bob: { "0%,100%": { transform: "translateX(-50%) translateY(0)" }, "50%": { transform: "translateX(-50%) translateY(-4px)" } },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 color-mix(in srgb, var(--accent) 60%, transparent)" },
          "70%": { boxShadow: "0 0 0 12px transparent" },
          "100%": { boxShadow: "0 0 0 0 transparent" },
        },
      },
      animation: {
        pop: "pop .5s cubic-bezier(.2,1.4,.4,1)",
        bob: "bob 1.2s ease-in-out infinite",
        pulseRing: "pulseRing 1.6s infinite",
      },
    },
  },
  plugins: [],
};
