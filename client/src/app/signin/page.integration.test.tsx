import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useRouter } from "next/navigation";

import SignIn from "./page";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/service/auth/auth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/service/auth/auth", () => ({
  authService: {
    signIn: jest.fn(),
  },
}));

test("SignIn_autenticaERedirecionaAposLoginBemSucedido", async () => {
  const push = jest.fn();
  const login = jest.fn();
  const usuario = { id: 1, email: "aluno@fag.edu.br" };

  jest.mocked(useRouter).mockReturnValue({ push } as ReturnType<typeof useRouter>);
  jest.mocked(useAuth).mockReturnValue({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login,
    logout: jest.fn(),
  });
  jest.mocked(authService.signIn).mockResolvedValue(usuario);

  render(<SignIn />);

  const main = screen.getByRole("main");
  fireEvent.change(within(main).getByPlaceholderText("seu@email.com"), {
    target: { value: "aluno@fag.edu.br" },
  });
  fireEvent.change(within(main).getByPlaceholderText("••••••••"), {
    target: { value: "Abcd12!?" },
  });
  fireEvent.click(within(main).getByRole("button", { name: "Entrar" }));

  await waitFor(() => {
    expect(authService.signIn).toHaveBeenCalledTimes(1);
    expect(authService.signIn).toHaveBeenCalledWith({
      email: "aluno@fag.edu.br",
      password: "Abcd12!?",
    });
    expect(login).toHaveBeenCalledWith(usuario);
    expect(push).toHaveBeenCalledWith("/");
  });
});
