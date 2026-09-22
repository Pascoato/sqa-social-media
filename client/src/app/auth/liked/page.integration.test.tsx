import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import LikedPosts from "./page";
import { useAuth } from "@/contexts/AuthContext";
import { postsService } from "@/service/posts/posts";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/service/posts/posts", () => ({
  postsService: {
    getLikedPosts: jest.fn(),
    toggleLikePost: jest.fn(),
  },
}));

test("LikedPosts_exibePostsCurtidosDoUsuarioAutenticado", async () => {
  const push = jest.fn();
  const usuario = { id: 1, email: "aluno@fag.edu.br" };

  jest.mocked(useRouter).mockReturnValue({ push } as ReturnType<typeof useRouter>);
  jest.mocked(useAuth).mockReturnValue({
    user: usuario,
    isAuthenticated: true,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  });
  jest.mocked(postsService.getLikedPosts).mockResolvedValue({
    posts: [
      {
        id: 10,
        title: "Post curtido",
        body: "Conteúdo do post curtido",
        liked: true,
      },
    ],
    total: 1,
    limit: 50,
  });

  render(<LikedPosts />);

  expect(await screen.findByText("Post curtido")).toBeInTheDocument();
  expect(screen.getByText("Conteúdo do post curtido")).toBeInTheDocument();
  expect(postsService.getLikedPosts).toHaveBeenCalledTimes(1);
  expect(postsService.getLikedPosts).toHaveBeenCalledWith({
    userId: 1,
    limit: 50,
  });
  expect(push).not.toHaveBeenCalledWith("/signin");
});
