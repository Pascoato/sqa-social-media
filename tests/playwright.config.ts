import { defineConfig, devices } from '@playwright/test';

// Configuracao do Playwright (gerada pelo instalador e ajustada para este projeto).
export default defineConfig({
  testDir: './tests',

  // Os testes de cadastro criam usuarios no banco, entao rodamos um de cada vez
  // para evitar confusao nos dados.
  fullyParallel: false,
  workers: 1,

  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // Endereco do frontend: permite usar page.goto('/') nos testes
    baseURL: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
