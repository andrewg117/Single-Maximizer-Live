import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { CssModuleTypes } from "./watching_css_modules";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), CssModuleTypes()],
  server: {
    open: "http://localhost:3000/",
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000/",
        changeOrigin: true,
      },
    },
  },
});
