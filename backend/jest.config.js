/** @type {import('ts-jest').JestConfigWithTsJest} **/
// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  globalSetup: './__test__/globalSetup.ts',
  globalTeardown: './__test__/globalTeardown.ts',
  setupFiles: ['./__test__/setupEnvVars.ts'],
  setupFilesAfterEnv: ['./__test__/setupFile.ts'],
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  testPathIgnorePatterns: ['/dist/'],
};
