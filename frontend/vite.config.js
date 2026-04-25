import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: true,
      allowedHosts: [
        "unporticoed-jayceon-unwebbing.ngrok-free.dev",
        "ariyah-infiltrative-thriftlessly.ngrok-free.dev",
      ],
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
