import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import PostCard from "./PostCard";

const post = { id: 10, title: "Post de teste", body: "Conteudo do post", liked: false };

describe("PostCard", () => {
  test("mostra o numero de likes e dislikes do post", () => {
    const postComReacoes = { ...post, reactions: { likes: 192, dislikes: 25 } };
    render(<PostCard post={postComReacoes} isAuthenticated={false} onLike={jest.fn()} />);

    expect(screen.getByLabelText("Likes")).toHaveTextContent("192");
    expect(screen.getByLabelText("Dislikes")).toHaveTextContent("25");
  });

  test("nao quebra quando o post nao tem reactions", () => {
    render(<PostCard post={post} isAuthenticated={false} onLike={jest.fn()} />);

    expect(screen.queryByLabelText("Likes")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Dislikes")).not.toBeInTheDocument();
  });

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
