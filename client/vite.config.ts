import { defineConfig } from "vite";
import postcssNesting from "postcss-nesting";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
        plugins: [
            postcssNesting
        ],
    },
},
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
  preview: {
    port: 3000,
  },
});
