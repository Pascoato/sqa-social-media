import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import LikedPosts from "./page";
import { useAuth } from "@/contexts/AuthContext";
import { postsService } from "@/service/posts/posts";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@/contexts/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("@/service/posts/posts", () => ({
  postsService: { getLikedPosts: jest.fn(), toggleLikePost: jest.fn() },
}));

test("pagina de curtidos mostra os posts curtidos do usuario logado", async () => {
  // Arrange: usuario logado e a API devolvendo 1 post curtido
  const push = jest.fn();
  jest.mocked(useRouter).mockReturnValue({ push } as any);
  jest.mocked(useAuth).mockReturnValue({
    user: { id: 1, email: "aluno@fag.edu.br" },
    isAuthenticated: true,
    isLoading: false,
    logout: jest.fn(),
  } as any);
  jest.mocked(postsService.getLikedPosts).mockResolvedValue({
    posts: [{ id: 10, title: "Post curtido", body: "Conteudo do post curtido", liked: true }],
    total: 1,
    limit: 50,
  } as any);

  // Act
  render(<LikedPosts />);

  // Assert
  expect(await screen.findByText("Post curtido")).toBeInTheDocument();
  expect(screen.getByText("Conteudo do post curtido")).toBeInTheDocument();
  expect(postsService.getLikedPosts).toHaveBeenCalledWith({ userId: 1, limit: 50 });
  expect(push).not.toHaveBeenCalledWith("/signin");
});
