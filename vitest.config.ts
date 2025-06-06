import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      include: ["src/**"],
      provider: "v8",
    },
    include: ["./test/**.test.ts"],
    mockReset: true,
    restoreMocks: true,
    testTimeout: 20000,
  },
})
