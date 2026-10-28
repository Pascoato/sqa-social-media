import { isEmailValid } from "./email";

describe("isEmailValid", () => {
  test("aceita um e-mail correto", () => {
    expect(isEmailValid("aluno@fag.edu.br")).toBe(true);
  });

  test("rejeita e-mail sem ponto no dominio", () => {
    expect(isEmailValid("aluno@fag")).toBe(false);
  });
});
