import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ["**/*.node"],
  css: {
    transformer: "postcss",
  },
  optimizeDeps: {
    exclude: ["lightningcss", "@tailwindcss/oxide-darwin-arm64"],
  },
  build: {
    rollupOptions: {
      external: [/\.node$/],
    },
  },
});
