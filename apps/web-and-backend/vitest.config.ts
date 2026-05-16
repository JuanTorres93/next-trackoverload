/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';
// Allows importing of React not to be explicit in every file
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic', // suele ser por defecto, pero lo dejamos explícito
    }),
  ],
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
