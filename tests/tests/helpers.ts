// Funcoes de apoio usadas pelos testes.

// Gera um e-mail diferente a cada chamada.
// Precisa ser unico porque o banco guarda os usuarios entre uma execucao e outra.
export function emailNovo(): string {
  const sufixo = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return `teste${sufixo}@teste.com`;
}

// Senha que atende todos os requisitos (8+ caracteres, maiuscula, minuscula, numero e especial)
export const SENHA_FORTE = 'Teste123@';

// Endereco da API
export const API_URL = process.env.API_URL ?? 'http://localhost:8080';
