import { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/app/domains/shared/$1',
    '^@products/(.*)$': '<rootDir>/src/app/domains/products/$1',
    '^@info/(.*)$': '<rootDir>/src/app/domains/info/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!<rootDir>/node_modules/',
    '!<rootDir>/test/',
  ],
};

export default config;
