/// <reference types="vitest" />
// Allows importing of React not to be explicit in every file
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    react({
      jsxRuntime: "automatic", // suele ser por defecto, pero lo dejamos explícito
    }),
  ],
  test: {
    globals: true, // use describe/it/expect without import
    environment: "jsdom", // for React
    setupFiles: ["tests/setup.ts"],
    include: [
      "src/**/__tests__/**/*.{spec,test}.{ts,tsx}",
      "tests/**/*.{spec,test}.{ts,tsx}",
    ],
  },
});
