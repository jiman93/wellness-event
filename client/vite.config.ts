import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/wellness-events": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/event-types": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/vendors": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
