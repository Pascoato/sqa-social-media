// "page" e o navegador de verdade que o Playwright abre para cada teste
import { test, expect } from '@playwright/test';
import { SENHA_FORTE, emailNovo } from '../helpers';

// Teste E2E (ponta a ponta): abre o navegador de verdade e age como um usuario.
// Passa por frontend + API + banco ao mesmo tempo.
test.describe('E2E - cadastro', () => {
  // Requisito coberto: o usuario consegue criar uma conta pela tela
  test('cria uma conta nova e vai para a pagina principal ja logado', async ({ page }) => {
    // 1. Abre a home e clica em "Criar conta" no cabecalho
    //    goto('/') funciona porque o baseURL esta no playwright.config.ts
    await page.goto('/');
    //    getByRole acha o elemento como o usuario ve: um botao com esse nome.
    //    O /i ignora maiuscula/minuscula ("Criar Conta" ou "Criar conta")
    await page.getByRole('button', { name: /criar conta/i }).click();
    //    Confere que a URL mudou para /signup
    await expect(page).toHaveURL(/\/signup$/);

    // 2. Preenche o formulario (os dois campos de senha tem o mesmo placeholder)
    await page.getByPlaceholder('seu@email.com').fill(emailNovo());
    const campoSenha = page.getByPlaceholder('••••••••');
    await campoSenha.nth(0).fill(SENHA_FORTE); // nth(0) = primeiro campo (senha)
    await campoSenha.nth(1).fill(SENHA_FORTE); // nth(1) = segundo campo (confirmar senha)

    // 3. Envia o formulario (o botao de dentro do <form>, nao o do cabecalho,
    //    porque existem dois botoes "Criar conta" na pagina)
    await page.locator('form').getByRole('button', { name: /criar conta/i }).click();

    // 4. Vai para a home e aparece o botao "Sair", que so existe para quem esta logado.
    //    O expect do Playwright espera ate o elemento aparecer (auto-wait), sem sleep.
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });
});
