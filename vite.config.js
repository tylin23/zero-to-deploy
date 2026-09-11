import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" 使用相對路徑，讓 GitHub Pages 無論部署在根網域或
// 子路徑（username.github.io/repo/）都能正確載入資源。
export default defineConfig({
  base: "./",
  plugins: [react()],
});
