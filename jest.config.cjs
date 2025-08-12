const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/domains/marketplace/services/__tests__/',
    '<rootDir>/tests/e2e/', // استبعاد اختبارات E2E من الاختبارات العادية
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/domains/(.*)$': '<rootDir>/src/domains/$1',
  },
  // إعدادات إضافية لاختبارات E2E
  projects: [
    {
      displayName: 'unit-tests',
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'jest-environment-jsdom',
      setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
    },
    {
      displayName: 'e2e-tests',
      testMatch: ['<rootDir>/tests/e2e/**/*.spec.{js,ts}'],
      testEnvironment: 'node',
  // Use setupFilesAfterEnv to control per-test timeout instead of testTimeout (which triggered a validation warning)
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/jest.e2e.setup.ts'],
      maxWorkers: 1, // تشغيل اختبارات E2E بشكل متسلسل
      globalSetup: '<rootDir>/tests/e2e/global-setup.js',
      globalTeardown: '<rootDir>/tests/e2e/global-teardown.js',
      preset: 'ts-jest/presets/default-esm',
      extensionsToTreatAsEsm: ['.ts'],
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: '<rootDir>/config/tsconfig.jest.json',
          },
        ],
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    },
  ],
}

module.exports = createJestConfig(customJestConfig)
