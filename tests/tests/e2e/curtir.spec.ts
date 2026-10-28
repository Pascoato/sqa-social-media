import { test, expect, request } from '@playwright/test';
import { API_URL, SENHA_FORTE, emailNovo } from '../helpers';

test.describe('E2E - curtir posts', () => {
  // Requisito coberto: quem nao esta logado nao pode curtir e recebe um aviso
  test('sem estar logado, curtir mostra um alert pedindo autenticacao', async ({ page }) => {
    await page.goto('/');
    // Cada post da lista e um "listitem"; first() pega o primeiro.
    // timeout de 15s porque os posts vem de um site externo (dummyjson.com).
    const primeiroPost = page.getByRole('listitem').first();
    await expect(primeiroPost).toBeVisible({ timeout: 15000 });

    // O alert e uma janela nativa do navegador (dialog). Precisamos "ouvir" ela ANTES do clique.
    // page.once = ouve so a proxima vez; guarda a mensagem e fecha a janela (accept).
    let mensagem = '';
    page.once('dialog', async (dialog) => {
      mensagem = dialog.message();
      await dialog.accept();
    });

    // Clica no botao de curtir dentro do primeiro post
    await primeiroPost.getByRole('button').click();

    // Agora conferimos o texto que o alert mostrou
    expect(mensagem).toBe('Você precisa estar autenticado para curtir posts!');
  });

  // Requisito coberto: usuario logado consegue curtir e o botao muda de "Curtir" para "Curtido"
  test('logado, curtir muda o botao do post para "Curtido"', async ({ page }) => {
    // Preparar: cria o usuario pela API (rapido) e faz login pela tela
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo();
    await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });

    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(SENHA_FORTE);
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/'); // espera o login terminar antes de seguir

    const primeiroPost = page.getByRole('listitem').first();
    await expect(primeiroPost).toBeVisible({ timeout: 15000 });
    // Antes do clique o botao diz "Curtir" (a regex /Curtir/ nao pega "Curtido")
    await expect(primeiroPost.getByRole('button', { name: /Curtir/ })).toBeVisible();

    // Agir: clica em curtir
    await primeiroPost.getByRole('button').click();

    // Conferir: o mesmo botao agora diz "Curtido"
    await expect(primeiroPost.getByRole('button', { name: /Curtido/ })).toBeVisible();
  });
});
