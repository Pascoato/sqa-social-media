import { isPasswordValid } from "./password";

test("isPasswordValid_aceitaSenhaForteComOitoCaracteres", () => {
  expect(isPasswordValid("Abcd12!?")).toBe(true);
});
