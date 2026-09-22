import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Header from "./Header";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

test("Header_deslogado_exibeTituloEOpcoesDeAutenticacao", () => {
  render(<Header />);

  expect(screen.getByText("SQA Social Media")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Criar Conta" })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Posts Curtidos" })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Sair" })
  ).not.toBeInTheDocument();
});
