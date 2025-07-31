/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/security/rate-limit-node.test.js", // Excluir test legacy
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  collectCoverageFrom: [
    "actions/**/*.{js,ts}",
    "components/**/*.{js,jsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/tests/**",
  ],
  coverageDirectory: "tests/coverage",
  coverageReporters: ["text", "lcov"],
  verbose: true,
  testTimeout: 30000,
  clearMocks: true,
  restoreMocks: true,
  // Configuración de Babel inline para Jest
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                node: "current",
              },
            },
          ],
          "@babel/preset-typescript",
          [
            "@babel/preset-react",
            {
              runtime: "automatic",
            },
          ],
        ],
      },
    ],
  },
  // Transformar node_modules que usan ES modules
  transformIgnorePatterns: [
    "node_modules/(?!(node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)/)",
  ],
  // Mock para node-fetch
  moduleNameMapper: {
    "^node-fetch$": "<rootDir>/tests/__mocks__/node-fetch.js",
  },
};
