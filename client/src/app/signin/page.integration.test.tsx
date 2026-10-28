import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useRouter } from "next/navigation";
import SignIn from "./page";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";

// Simulamos so as partes de fora (router, contexto e chamada a API)
jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("@/service/auth/auth", () => ({ authService: { signIn: jest.fn() } }));

test("login com sucesso autentica o usuario e vai para a pagina principal", async () => {
  // Arrange
  const push = jest.fn();
  const login = jest.fn();
  const usuario = { id: 1, email: "aluno@fag.edu.br" };
  jest.mocked(useRouter).mockReturnValue({ push } as any);
  jest.mocked(useAuth).mockReturnValue({ login } as any);
  jest.mocked(authService.signIn).mockResolvedValue(usuario);

  render(<SignIn />);
  const main = screen.getByRole("main");

  // Act: preenche o formulario e clica em Entrar
  fireEvent.change(within(main).getByPlaceholderText("seu@email.com"), {
    target: { value: "aluno@fag.edu.br" },
  });
  fireEvent.change(within(main).getByPlaceholderText("••••••••"), {
    target: { value: "Abcd12!?" },
  });
  fireEvent.click(within(main).getByRole("button", { name: "Entrar" }));

  // Assert
  await waitFor(() => {
    expect(authService.signIn).toHaveBeenCalledWith({
      email: "aluno@fag.edu.br",
      password: "Abcd12!?",
    });
    expect(login).toHaveBeenCalledWith(usuario);
    expect(push).toHaveBeenCalledWith("/");
  });
});
