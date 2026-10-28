import { test, expect, request } from '@playwright/test';
import { API_URL, SENHA_FORTE, emailNovo } from '../helpers';

// Testes de API (caixa-preta): mandamos requisicoes HTTP para o backend em execucao
// e conferimos so a resposta (status e JSON), sem olhar o codigo por dentro.
test.describe('API - autenticacao', () => {
  test('POST /auth/signup cria o usuario e devolve id e e-mail', async () => {
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo();

    const resposta = await api.post('/auth/signup', {
      data: { email, password: SENHA_FORTE },
    });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(typeof corpo.id).toBe('number');
    expect(corpo.email).toBe(email);
  });

  test('POST /auth/signup com e-mail ja cadastrado retorna 409', async () => {
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo();
    await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });

    // Segundo cadastro com o mesmo e-mail
    const resposta = await api.post('/auth/signup', {
      data: { email, password: SENHA_FORTE },
    });

    expect(resposta.status()).toBe(409);
    const corpo = await resposta.json();
    expect(corpo.status).toBe(409);
    expect(corpo.message).toBeTruthy();
  });

  test('POST /auth/signin com credenciais corretas retorna o usuario', async () => {
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo();
    await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });

    const resposta = await api.post('/auth/signin', {
      data: { email, password: SENHA_FORTE },
    });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.email).toBe(email);
  });

  test('POST /auth/signin com senha errada retorna 401 e "Credenciais inválidas"', async () => {
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo();
    await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });

    // Senha valida no formato, mas diferente da cadastrada
    const resposta = await api.post('/auth/signin', {
      data: { email, password: 'Outra123@' },
    });

    expect(resposta.status()).toBe(401);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Credenciais inválidas');
  });

  test('POST /auth/signup com senha fraca retorna 422', async () => {
    const api = await request.newContext({ baseURL: API_URL });

    const resposta = await api.post('/auth/signup', {
      data: { email: emailNovo(), password: 'fraca' },
    });

    expect(resposta.status()).toBe(422);
  });

  test('POST /auth/reset-password com e-mail inexistente retorna 404 e "Usuário não encontrado"', async () => {
    const api = await request.newContext({ baseURL: API_URL });

    const resposta = await api.post('/auth/reset-password', {
      data: { email: emailNovo() },
    });

    expect(resposta.status()).toBe(404);
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Usuário não encontrado');
  });
});
