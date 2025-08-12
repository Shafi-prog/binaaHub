const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'babel-jest',
  { configFile: '<rootDir>/babel.config.js' },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(uuid|@medusajs|@react-google-maps/api)/)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/domains/marketplace/services/__tests__/',
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
  '^@/lib/utils$': '<rootDir>/src/lib/utils.ts',
  '^@/lib/supabase/client$': '<rootDir>/src/lib/supabase/client.ts',
  '^@/components/ui$': '<rootDir>/src/components/ui/index.ts',
  '^@/components/ui/(.*)$': '<rootDir>/src/components/ui/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
