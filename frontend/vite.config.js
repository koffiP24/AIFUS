import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // En développement: localhost:5000 | En production: URL déployée
  const isDev = mode === "development";
  const apiTarget = isDev
    ? "http://localhost:5000"
    : env.VITE_API_BASE_URL || "https://aifus.onrender.com/api";

  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: [
        "unporticoed-jayceon-unwebbing.ngrok-free.dev",
        "ariyah-infiltrative-thriftlessly.ngrok-free.dev",
        "aifus.onrender.com",
      ],
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: !isDev,
        },
      },
    },
  };
});
