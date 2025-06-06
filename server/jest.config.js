const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  globalSetup: '<rootDir>/test/integration/bootstrap.ts',
  globalTeardown: '<rootDir>/test/integration/teardown.ts',
  testTimeout: 30000,
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>/src` }),
    '@shared/constants': '<rootDir>/../packages/constants/src/index.ts'
  },
  coveragePathIgnorePatterns: ['<rootDir>/test', '<rootDir>/src/database/migrations', '<rootDir>/src/database/seeds']
};
