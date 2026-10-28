import { isPasswordValid } from "./password";

describe("isPasswordValid", () => {
  // BUG: o codigo usa "length <= 8", entao senha com exatamente 8 caracteres e recusada.
  // Este teste FALHA de proposito para mostrar o bug.
  test("aceita senha forte com exatamente 8 caracteres", () => {
    expect(isPasswordValid("Abcd12!?")).toBe(true);
  });

  test("rejeita senha sem letra maiuscula", () => {
    expect(isPasswordValid("abcdef12!?")).toBe(false);
  });
});
