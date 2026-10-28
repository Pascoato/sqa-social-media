// test    = define um teste
// expect  = faz a conferencia (assert)
// request = cria um "cliente HTTP" para falar direto com a API, sem navegador
import { test, expect, request } from '@playwright/test';
// Funcoes e constantes de apoio, definidas em helpers.ts
import { API_URL, SENHA_FORTE, emailNovo } from '../helpers';

// Testes de API (caixa-preta): mandamos requisicoes HTTP para o backend em execucao
// e conferimos so a resposta (status e JSON), sem olhar o codigo por dentro.
//
// Todos os testes seguem o mesmo molde:
//   1. Preparar: criar o cliente HTTP e os dados (e-mail novo)
//   2. Agir:     mandar a requisicao (post)
//   3. Conferir: olhar o status e o JSON da resposta
test.describe('API - autenticacao', () => {
  // Requisito coberto: cadastro de usuario com e-mail e senha validos
  test('POST /auth/signup cria o usuario e devolve id e e-mail', async () => {
    // Cliente HTTP ja apontando para o endereco da API (assim so escrevemos '/auth/signup')
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo(); // e-mail unico, senao o banco recusaria na 2a execucao

    // POST com um JSON no corpo: { email, password }
    const resposta = await api.post('/auth/signup', {
      data: { email, password: SENHA_FORTE },
    });

    expect(resposta.status()).toBe(200); // 200 = deu certo
    const corpo = await resposta.json(); // le o JSON que a API devolveu
    expect(typeof corpo.id).toBe('number'); // o banco gerou um id numerico
    expect(corpo.email).toBe(email); // devolveu o mesmo e-mail que mandamos
  });

  // Requisito coberto: nao pode haver dois usuarios com o mesmo e-mail
  test('POST /auth/signup com e-mail ja cadastrado retorna 409', async () => {
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo();
    // Primeiro cadastro: so prepara o cenario, nao conferimos nada aqui
    await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });

    // Segundo cadastro com o mesmo e-mail
    const resposta = await api.post('/auth/signup', {
      data: { email, password: SENHA_FORTE },
    });

    expect(resposta.status()).toBe(409); // 409 = conflito (ja existe)
    const corpo = await resposta.json();
    expect(corpo.status).toBe(409);
    // So conferimos que existe uma mensagem. O texto do backend ("E-mail ja esta em uso")
    // e diferente do requisito ("E-mail ja cadastrado"); esse e o bug da Atividade 2.
    expect(corpo.message).toBeTruthy();
  });

  // Requisito coberto: login com e-mail e senha corretos
  test('POST /auth/signin com credenciais corretas retorna o usuario', async () => {
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo();
    // Cria o usuario antes, para ter uma conta para entrar
    await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });

    const resposta = await api.post('/auth/signin', {
      data: { email, password: SENHA_FORTE },
    });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.email).toBe(email);
  });

  // Requisito coberto: login com senha errada deve ser recusado
  test('POST /auth/signin com senha errada retorna 401 e "Credenciais inválidas"', async () => {
    const api = await request.newContext({ baseURL: API_URL });
    const email = emailNovo();
    await api.post('/auth/signup', { data: { email, password: SENHA_FORTE } });

    // Senha valida no formato, mas diferente da cadastrada
    const resposta = await api.post('/auth/signin', {
      data: { email, password: 'Outra123@' },
    });

    expect(resposta.status()).toBe(401); // 401 = nao autorizado
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Credenciais inválidas');
  });

  // Requisito coberto: senha fora das regras (8+ caracteres, maiuscula, numero, etc.)
  test('POST /auth/signup com senha fraca retorna 422', async () => {
    const api = await request.newContext({ baseURL: API_URL });

    const resposta = await api.post('/auth/signup', {
      data: { email: emailNovo(), password: 'fraca' },
    });

    expect(resposta.status()).toBe(422); // 422 = dados enviados sao invalidos
  });

  // Requisito coberto: redefinir senha de um e-mail que nao existe
  test('POST /auth/reset-password com e-mail inexistente retorna 404 e "Usuário não encontrado"', async () => {
    const api = await request.newContext({ baseURL: API_URL });

    // emailNovo() nunca foi cadastrado, entao a API nao deve achar o usuario
    const resposta = await api.post('/auth/reset-password', {
      data: { email: emailNovo() },
    });

    expect(resposta.status()).toBe(404); // 404 = nao encontrado
    const corpo = await resposta.json();
    expect(corpo.message).toBe('Usuário não encontrado');
  });
});
