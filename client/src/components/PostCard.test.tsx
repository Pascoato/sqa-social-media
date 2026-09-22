import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import PostCard from "./PostCard";

test("PostCard_aplicaFeedbackVisualAoCurtirAutenticado", async () => {
  const post = {
    id: 10,
    title: "Post de teste",
    body: "Conteúdo do post",
    liked: false,
  };
  const onLike = jest.fn().mockResolvedValue(undefined);

  render(
    <PostCard post={post} isAuthenticated={true} onLike={onLike} />
  );

  expect(screen.getByText("Post de teste")).toBeInTheDocument();
  expect(screen.getByText("Conteúdo do post")).toBeInTheDocument();
  expect(screen.getByText("Curtir")).toBeInTheDocument();
  expect(screen.getByText("🤍")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Curtir/ }));

  expect(onLike).toHaveBeenCalledTimes(1);
  expect(onLike).toHaveBeenCalledWith(10);
  expect(await screen.findByText("Curtido")).toBeInTheDocument();
  expect(screen.getByText("❤️")).toBeInTheDocument();
});
