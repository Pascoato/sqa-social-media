package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;

// Testa o toggleLike (curtir / descurtir) com o repositorio "falso".
@ExtendWith(MockitoExtension.class)
class PostServiceMockitoTest {

  @Mock
  private UserPostReactionRepository reactionRepository;

  @InjectMocks
  private PostService postService;

  @Test
  void toggleLikeDeveCurtirQuandoAindaNaoCurtiu() {
    // Arrange: nao existe curtida
    when(reactionRepository.findByUserIdAndPostId(10L, 20L)).thenReturn(Optional.empty());

    // Act
    Map<String, Object> resultado = postService.toggleLike(20L, 10L);

    // Assert: salvou uma curtida e nao apagou nada
    verify(reactionRepository).save(any(UserPostReaction.class));
    verify(reactionRepository, never()).delete(any(UserPostReaction.class));
    assertTrue((Boolean) resultado.get("liked"));
    assertEquals(20L, resultado.get("postId"));
  }

  @Test
  void toggleLikeDeveDescurtirQuandoJaCurtiu() {
    // Arrange: ja existe curtida
    UserPostReaction curtida = new UserPostReaction();
    when(reactionRepository.findByUserIdAndPostId(10L, 20L)).thenReturn(Optional.of(curtida));

    // Act
    Map<String, Object> resultado = postService.toggleLike(20L, 10L);

    // Assert: apagou a curtida e nao salvou nada
    verify(reactionRepository).delete(curtida);
    verify(reactionRepository, never()).save(any(UserPostReaction.class));
    assertFalse((Boolean) resultado.get("liked"));
  }
}
