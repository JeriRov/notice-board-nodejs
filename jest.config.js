/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/setupFiles.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupFilesAfterEnv.ts'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
