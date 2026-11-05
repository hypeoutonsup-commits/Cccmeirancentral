import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import netlify from "@netlify/vite-plugin";

export default defineConfig({
  base: "/",
  plugins: [react({ jsxRuntime: "automatic" }), netlify()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
