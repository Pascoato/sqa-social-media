import { test, expect, request } from '@playwright/test';
import { API_URL, SENHA_FORTE, emailNovo } from '../helpers';

test.describe('API - posts', () => {
  // Requisito coberto: listar posts (a API busca no dummyjson.com e devolve para nos)
  test('GET /posts retorna a lista de posts com titulo, corpo e liked', async () => {
    const api = await request.newContext({ baseURL: API_URL });

    // params vira a query string: /posts?limit=5&skip=0 (5 posts, a partir do primeiro)
    const resposta = await api.get('/posts', { params: { limit: 5, skip: 0 } });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.posts).toHaveLength(5); // pedimos 5, tem que vir 5
    expect(corpo.posts[0]).toHaveProperty('title'); // cada post tem titulo...
    expect(corpo.posts[0]).toHaveProperty('body'); // ...e corpo
    expect(corpo.posts[0].liked).toBe(false); // sem usuario logado, nada vem curtido
  });

  // Requisito coberto: cada post traz o objeto reactions do DummyJSON com likes e dislikes
  test('GET /posts retorna reactions com likes e dislikes em cada post', async () => {
    const api = await request.newContext({ baseURL: API_URL });

    const resposta = await api.get('/posts', { params: { limit: 5, skip: 0 } });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    for (const post of corpo.posts) {
      expect(typeof post.reactions.likes).toBe('number');
      expect(typeof post.reactions.dislikes).toBe('number');
    }
  });

  // Requisito coberto: curtir e descurtir um post (o mesmo endpoint alterna)
  test('POST /posts/{id}/like curte e descurte o post (alterna)', async () => {
    const api = await request.newContext({ baseURL: API_URL });
    // Precisamos de um usuario, porque a curtida pertence a um usuario
    const cadastro = await api.post('/auth/signup', {
      data: { email: emailNovo(), password: SENHA_FORTE },
    });
    const { id: userId } = await cadastro.json(); // pega so o "id" do JSON e chama de userId

    // Primeira chamada: curte (liked passa a ser true)
    const curtir = await api.post('/posts/1/like', { params: { userId } });
    expect(curtir.status()).toBe(200);
    expect((await curtir.json()).liked).toBe(true);

    // Segunda chamada, mesma requisicao: descurte (liked volta a ser false)
    const descurtir = await api.post('/posts/1/like', { params: { userId } });
    expect(descurtir.status()).toBe(200);
    expect((await descurtir.json()).liked).toBe(false);
  });
});
