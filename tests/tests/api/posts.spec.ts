import { test, expect, request } from '@playwright/test';
import { API_URL, SENHA_FORTE, emailNovo } from '../helpers';

test.describe('API - posts', () => {
  test('GET /posts retorna a lista de posts com titulo, corpo e liked', async () => {
    const api = await request.newContext({ baseURL: API_URL });

    const resposta = await api.get('/posts', { params: { limit: 5, skip: 0 } });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.posts).toHaveLength(5);
    expect(corpo.posts[0]).toHaveProperty('title');
    expect(corpo.posts[0]).toHaveProperty('body');
    expect(corpo.posts[0].liked).toBe(false);
  });

  test('POST /posts/{id}/like curte e descurte o post (alterna)', async () => {
    const api = await request.newContext({ baseURL: API_URL });
    const cadastro = await api.post('/auth/signup', {
      data: { email: emailNovo(), password: SENHA_FORTE },
    });
    const { id: userId } = await cadastro.json();

    // Primeira chamada: curte
    const curtir = await api.post('/posts/1/like', { params: { userId } });
    expect(curtir.status()).toBe(200);
    expect((await curtir.json()).liked).toBe(true);

    // Segunda chamada: descurte
    const descurtir = await api.post('/posts/1/like', { params: { userId } });
    expect(descurtir.status()).toBe(200);
    expect((await descurtir.json()).liked).toBe(false);
  });
});
