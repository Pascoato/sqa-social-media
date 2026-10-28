import { isPasswordValid } from "./password";

describe("isPasswordValid", () => {
  // Cada linha da tabela e um caso: [descricao, senha, resultado esperado]
  // O caso de 8 caracteres FALHA de proposito: o codigo usa "length <= 8"
  // e o requisito diz "minimo 8 caracteres" (BUG).
  const casos: [string, string, boolean][] = [
    ["7 caracteres (abaixo do minimo)", "Abcd12!", false],
    ["8 caracteres (exatamente o minimo)", "Abcd12!?", true],
    ["9 caracteres (acima do minimo)", "Abcd12!?x", true],
    ["sem letra maiuscula", "abcd12!?", false],
    ["sem letra minuscula", "ABCD12!?", false],
    ["sem numero", "Abcdef!?", false],
    ["sem caractere especial", "Abcd1234", false],
    ["vazia", "", false],
  ];

  test.each(casos)("%s", (_descricao, senha, esperado) => {
    expect(isPasswordValid(senha)).toBe(esperado);
  });
});
