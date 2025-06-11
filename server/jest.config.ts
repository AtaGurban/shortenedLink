// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/js-with-ts', // ESM-поддержка
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
    }],
  },
};

export default config;
