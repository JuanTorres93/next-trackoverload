/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true, // use describe/it/expect without import
    environment: 'jsdom', // for React
    setupFiles: ['tests/setup.ts'],
    include: [
      'src/**/__tests__/**/*.{spec,test}.{ts,tsx}',
      'tests/**/*.{spec,test}.{ts,tsx}',
    ],
  },
});
