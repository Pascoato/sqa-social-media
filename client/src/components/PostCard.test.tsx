import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import PostCard from "./PostCard";

const post = { id: 10, title: "Post de teste", body: "Conteudo do post", liked: false };

describe("PostCard", () => {
  test("usuario logado: ao clicar em Curtir o botao muda para Curtido", async () => {
    const onLike = jest.fn().mockResolvedValue(undefined);
    render(<PostCard post={post} isAuthenticated={true} onLike={onLike} />);

    fireEvent.click(screen.getByRole("button", { name: /Curtir/ }));

    expect(onLike).toHaveBeenCalledWith(10);
    expect(await screen.findByText("Curtido")).toBeInTheDocument();
    expect(screen.getByText("❤️")).toBeInTheDocument();
  });

  test("usuario deslogado: ao clicar em Curtir aparece o alert", () => {
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const onLike = jest.fn();
    render(<PostCard post={post} isAuthenticated={false} onLike={onLike} />);

    fireEvent.click(screen.getByRole("button", { name: /Curtir/ }));

    expect(alertSpy).toHaveBeenCalledWith("Você precisa estar autenticado para curtir posts!");
    expect(onLike).not.toHaveBeenCalled();
  });
});
