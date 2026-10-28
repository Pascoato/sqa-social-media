import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

// Simulamos o router e o login, para testar so o Header
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockUseAuth = jest.fn();
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("Header", () => {
  // BUG: o botao no codigo esta como "Criar Conta" (C maiusculo),
  // mas o requisito diz "Criar conta". Este teste FALHA de proposito.
  test("usuario deslogado ve os botoes Entrar e Criar conta", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, logout: jest.fn() });

    render(<Header />);

    expect(screen.getByText("SQA Social Media")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Criar conta" })).toBeInTheDocument();
  });

  test("usuario logado ve os botoes Posts Curtidos e Sair", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, logout: jest.fn() });

    render(<Header />);

    expect(screen.getByRole("button", { name: "Posts Curtidos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Entrar" })).not.toBeInTheDocument();
  });
});
