import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./setup-vitest.ts"],
      coverage: {
        provider: "v8",
        reporter: ["html"],
      },
    },
  })
);
