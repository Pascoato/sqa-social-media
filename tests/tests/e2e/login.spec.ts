import { test, expect, request } from '@playwright/test';
import { API_URL, SENHA_FORTE, emailNovo } from '../helpers';

// Cria um usuario direto pela API, para o teste de login ja ter uma conta pronta.
async function criarUsuarioPelaApi(): Promise<string> {
  const api = await request.newContext({ baseURL: API_URL });
  const email = emailNovo();
  await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });
  return email;
}

test.describe('E2E - login', () => {
  test('entra com e-mail e senha corretos e vai para a pagina principal', async ({ page }) => {
    const email = await criarUsuarioPelaApi();

    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(SENHA_FORTE);
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Posts Curtidos' })).toBeVisible();
  });

  test('mostra "Credenciais inválidas" quando a senha esta errada', async ({ page }) => {
    const email = await criarUsuarioPelaApi();

    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('••••••••').fill('Outra123@');
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Credenciais inválidas')).toBeVisible();
    await expect(page).toHaveURL(/\/signin$/); // continua na tela de login
  });
});
