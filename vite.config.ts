import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import fs from 'fs';
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: isDev
        ? {
          https: {
            key: fs.readFileSync(path.resolve(__dirname, "cert/localhost-key.pem")),
            cert: fs.readFileSync(path.resolve(__dirname, "cert/localhost.pem")),
          },
          port: 3000,
        }
        : undefined,
  }
})
