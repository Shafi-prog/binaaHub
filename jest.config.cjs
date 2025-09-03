const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
  '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid|@medusajs|@react-google-maps/api)/)',
  ],
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
    // Specific mappings first
    '^@/domains/marketplace/services/medusa$': '<rootDir>/src/lib/__mocks__/medusa-service.ts',
  '^@shared/(.*)$': '<rootDir>/src/core/shared/$1',
  // Platform adapters (mirror next.config.js/tsconfig)
  '^@platform/ui$': '<rootDir>/src/adapters/medusa/ui.tsx',
  '^@platform/icons$': '<rootDir>/src/adapters/medusa/icons.tsx',
  '^@platform/types$': '<rootDir>/src/adapters/medusa/types.ts',
  '^@platform/utils$': '<rootDir>/src/adapters/medusa/utils.ts',
  '^@platform/js-sdk$': '<rootDir>/src/adapters/medusa/js-sdk.ts',
  '^@platform/framework/types$': '<rootDir>/src/adapters/medusa/framework-types.ts',
  '^@platform/framework/utils$': '<rootDir>/src/lib/__mocks__/medusa-framework-utils.ts',
  '^@platform/framework/modules-sdk$': '<rootDir>/src/adapters/medusa/modules-sdk.ts',
  '^@platform/framework/orchestration$': '<rootDir>/src/adapters/medusa/orchestration.ts',
  '^@platform/workflows-sdk$': '<rootDir>/src/adapters/medusa/workflows-sdk.ts',
    '^@/components/ui$': '<rootDir>/src/components/ui/index.ts',
    '^@/components/ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@/lib/utils$': '<rootDir>/src/lib/utils.ts',
    '^@/lib/supabase/client$': '<rootDir>/src/lib/supabase/client.ts',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/domains/(.*)$': '<rootDir>/src/domains/$1',
    // Catch-all last
    '^@/(.*)$': '<rootDir>/src/$1',
  '^@supabase/auth-helpers-nextjs$': '<rootDir>/src/lib/__mocks__/supabase-auth-helpers-nextjs.ts',
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
      testPathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
        '<rootDir>/src/domains/marketplace/services/__tests__/',
  '<rootDir>/src/core/shared/components/__tests__/',
        '/__tests__/.*\\.d\\.ts$',
        '.*\\.d\\.ts$',
      ],
      transform: {
  '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(uuid|@medusajs|@react-google-maps/api)/)',
      ],
      moduleNameMapper: {
        // Specific mappings first
        '^@/domains/marketplace/services/medusa$': '<rootDir>/src/lib/__mocks__/medusa-service.ts',
  '^@shared/(.*)$': '<rootDir>/src/core/shared/$1',
  '^@medusajs/framework/utils$': '<rootDir>/src/lib/__mocks__/medusa-framework-utils.ts',
  '^@medusajs/framework/types$': '<rootDir>/src/lib/__mocks__/medusa-framework-types.ts',
  '^@supabase/auth-helpers-nextjs$': '<rootDir>/src/lib/__mocks__/supabase-auth-helpers-nextjs.ts',
  // Platform adapters (mirror next.config.js/tsconfig)
  '^@platform/ui$': '<rootDir>/src/adapters/medusa/ui.tsx',
  '^@platform/icons$': '<rootDir>/src/adapters/medusa/icons.tsx',
  '^@platform/types$': '<rootDir>/src/adapters/medusa/types.ts',
  '^@platform/utils$': '<rootDir>/src/adapters/medusa/utils.ts',
  '^@platform/js-sdk$': '<rootDir>/src/adapters/medusa/js-sdk.ts',
  '^@platform/framework/types$': '<rootDir>/src/adapters/medusa/framework-types.ts',
  '^@platform/framework/utils$': '<rootDir>/src/lib/__mocks__/medusa-framework-utils.ts',
  '^@platform/framework/modules-sdk$': '<rootDir>/src/adapters/medusa/modules-sdk.ts',
  '^@platform/framework/orchestration$': '<rootDir>/src/adapters/medusa/orchestration.ts',
  '^@platform/workflows-sdk$': '<rootDir>/src/adapters/medusa/workflows-sdk.ts',
        '^@/components/ui$': '<rootDir>/src/components/ui/index.ts',
        '^@/components/ui/(.*)$': '<rootDir>/src/components/ui/$1',
        '^@/lib/utils$': '<rootDir>/src/lib/utils.ts',
        '^@/lib/supabase/client$': '<rootDir>/src/lib/supabase/client.ts',
        '^@/core/(.*)$': '<rootDir>/src/core/$1',
        '^@/domains/(.*)$': '<rootDir>/src/domains/$1',
        '^@types$': '<rootDir>/src/types/index.ts',
        '^@models$': '<rootDir>/src/lib/__mocks__/models.ts',
        // Catch-all last
        '^@/(.*)$': '<rootDir>/src/$1',
      },
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
