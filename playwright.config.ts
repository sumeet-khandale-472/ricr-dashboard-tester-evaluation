import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5000/api',
    headless: true,
  },
  timeout: 30000,
});
