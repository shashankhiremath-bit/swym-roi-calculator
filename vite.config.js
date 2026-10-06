import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so the built assets resolve correctly under a GitHub Pages project URL
  // (https://<user>.github.io/<repo>/), not just at a domain root.
  base: "./",
  // Local dev only: Intent Yield does not send cross-origin headers for this site yet, so the
  // browser calls /iy here and Vite forwards it. Set VITE_IY_BASE=/iy in .env.development.
  server: {
    proxy: {
      "/iy": { target: "https://score.getswym.com", changeOrigin: true, rewrite: (p) => p.replace(/^\/iy/, "/intent-yield") },
    },
  },
});
