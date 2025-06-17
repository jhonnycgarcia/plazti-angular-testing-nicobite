import { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/src/app/shared/$1",
    "^@products/(.*)$": "<rootDir>/src/app/products/$1",
    "^@env/(.*)$": "<rootDir>/src/environments/$1"
  },
  collectCoverage: true,
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!<rootDir>/node_modules/",
    "!<rootDir>/test/",
  ],
  coverageReporters: ["html", "text-summary"],
};

export default config;