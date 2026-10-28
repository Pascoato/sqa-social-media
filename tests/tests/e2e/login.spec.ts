import { test, expect, request } from '@playwright/test';
import { API_URL, SENHA_FORTE, emailNovo } from '../helpers';

// Cria um usuario direto pela API, para o teste de login ja ter uma conta pronta.
// Assim o teste de login testa so o login (nao depende da tela de cadastro).
async function criarUsuarioPelaApi(): Promise<string> {
  const api = await request.newContext({ baseURL: API_URL });
  const email = emailNovo();
  await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });
  return email; // devolve o e-mail para o teste usar na tela
}

test.describe('E2E - login', () => {
  // Requisito coberto: login com dados corretos leva para a pagina principal, logado
  test('entra com e-mail e senha corretos e vai para a pagina principal', async ({ page }) => {
    const email = await criarUsuarioPelaApi(); // preparar

    // Agir: faz o que o usuario faria na tela de login
    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(SENHA_FORTE);
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();

    // Conferir: foi para a home e os botoes de quem esta logado apareceram
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Posts Curtidos' })).toBeVisible();
  });

  // Requisito coberto: senha errada mostra mensagem de erro e nao entra
  test('mostra "Credenciais inválidas" quando a senha esta errada', async ({ page }) => {
    const email = await criarUsuarioPelaApi();

    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('••••••••').fill('Outra123@'); // senha diferente da cadastrada
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();

    // getByText procura um texto qualquer visivel na tela
    await expect(page.getByText('Credenciais inválidas')).toBeVisible();
    await expect(page).toHaveURL(/\/signin$/); // continua na tela de login
  });
});
