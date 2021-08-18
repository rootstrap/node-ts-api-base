const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/utils/callbacks.ts',
    '<rootDir>/__tests__/utils/setup.ts'
  ],
  // necessary for resolving the paths in tsconfig:
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  }),
  testRegex: '/__tests__/.*.spec.(js|ts|tsx)?$',
  testResultsProcessor: 'jest-sonar-reporter',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/database/migrations/',
    '<rootDir>/src/swagger.ts',
    '<rootDir>/__tests__/'
  ]
};
