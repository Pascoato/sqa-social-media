import { test, expect, request } from '@playwright/test';
import { API_URL, SENHA_FORTE, emailNovo } from '../helpers';

test.describe('E2E - curtir posts', () => {
  test('sem estar logado, curtir mostra um alert pedindo autenticacao', async ({ page }) => {
    await page.goto('/');
    const primeiroPost = page.getByRole('listitem').first();
    await expect(primeiroPost).toBeVisible({ timeout: 15000 });

    // O alert e uma janela nativa do navegador (dialog). Guardamos a mensagem dele.
    let mensagem = '';
    page.once('dialog', async (dialog) => {
      mensagem = dialog.message();
      await dialog.accept();
    });

    await primeiroPost.getByRole('button').click();

    expect(mensagem).toBe('Você precisa estar autenticado para curtir posts!');
  });

  test('logado, curtir muda o botao do post para "Curtido"', async ({ page }) => {
    // Prepara um usuario pela API e faz login pela tela
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo();
    await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });

    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(SENHA_FORTE);
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/');

    const primeiroPost = page.getByRole('listitem').first();
    await expect(primeiroPost).toBeVisible({ timeout: 15000 });
    await expect(primeiroPost.getByRole('button', { name: /Curtir/ })).toBeVisible();

    await primeiroPost.getByRole('button').click();

    await expect(primeiroPost.getByRole('button', { name: /Curtido/ })).toBeVisible();
  });
});
