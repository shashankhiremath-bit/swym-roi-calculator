import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so the built assets resolve correctly under a GitHub Pages project URL
  // (https://<user>.github.io/<repo>/), not just at a domain root.
  base: "./",
});
