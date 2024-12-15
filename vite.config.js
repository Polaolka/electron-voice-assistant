import { defineConfig } from "vite";
import { resolve } from "path";
import electron from "vite-plugin-electron";

export default defineConfig({
  root: resolve(__dirname, "src", "renderer"), // Указуємо рендер папку як кореневу для Vite
  plugins: [
    electron({
      entry: resolve(__dirname, "src/main/main.js"), // Основний процес Electron
    }),
  ],
  build: {
    outDir: resolve(__dirname, "dist", "renderer"), // Вихідна папка після білду
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/renderer"), // Alias для зручного імпорту
    },
  },
});
