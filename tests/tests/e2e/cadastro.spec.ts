import { test, expect } from '@playwright/test';
import { SENHA_FORTE, emailNovo } from '../helpers';

// Teste E2E: abre o navegador de verdade e age como um usuario.
test.describe('E2E - cadastro', () => {
  test('cria uma conta nova e vai para a pagina principal ja logado', async ({ page }) => {
    // 1. Abre a home e clica em "Criar conta" no cabecalho
    await page.goto('/');
    await page.getByRole('button', { name: /criar conta/i }).click();
    await expect(page).toHaveURL(/\/signup$/);

    // 2. Preenche o formulario (os dois campos de senha tem o mesmo placeholder)
    await page.getByPlaceholder('seu@email.com').fill(emailNovo());
    const campoSenha = page.getByPlaceholder('••••••••');
    await campoSenha.nth(0).fill(SENHA_FORTE);
    await campoSenha.nth(1).fill(SENHA_FORTE);

    // 3. Envia o formulario (o botao de dentro do <form>, nao o do cabecalho)
    await page.locator('form').getByRole('button', { name: /criar conta/i }).click();

    // 4. Vai para a home e aparece o botao "Sair", que so existe para quem esta logado
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });
});
