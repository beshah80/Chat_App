module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
    moduleNameMapper: {
      "^@/components/(.*)$": "<rootDir>/components/$1",
    },
  };