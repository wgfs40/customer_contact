/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/security/rate-limit-node.test.js", // Excluir test legacy
  ],
  collectCoverageFrom: [
    "actions/**/*.{js,ts}",
    "Components/**/*.{js,jsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/tests/**",
  ],
  coverageDirectory: "tests/coverage",
  coverageReporters: ["text", "lcov"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  verbose: true,
  testTimeout: 30000,
  clearMocks: true,
  restoreMocks: true,
  // Transformar node_modules que usan ES modules
  transformIgnorePatterns: [
    "node_modules/(?!(node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)/)",
  ],
  // Mock para node-fetch
  moduleNameMapper: {
    "^node-fetch$": "<rootDir>/tests/__mocks__/node-fetch.js",
  },
};
