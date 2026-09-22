import { isEmailValid } from "./email";

test("isEmailValid_rejeitaEmailSemDominioCompleto", () => {
  expect(isEmailValid("aluno@fag")).toBe(false);
});
