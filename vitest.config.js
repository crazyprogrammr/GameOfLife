/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { configDefaults, defineConfig } from "vitest/config";

process.env.TZ = "UTC";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    testTimeout: 10000,
    deps: {
      optimizer: { web: { include: ["vitest-canvas-mock"] } },
    },
    exclude: [...configDefaults.exclude],
    include: ["src/**/__tests__/**/*.{js,jsx,ts,tsx}", "src/**/*.{spec,test}.{js,jsx,ts,tsx}"],
    setupFiles: ["src/TestSetup.ts"],
    globals: true,
    environment: "jsdom",
    clearMocks: true,
    restoreMocks: true,
    reporters: "verbose",
  },
});