import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Modo verbose para indicar onde e qual teste está sendo executado
  verbose: true,
  // Setup files after env
  setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
  // Module name mapper for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Test patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  // Collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)

