package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.UserPostReaction;
import com.demoapp.demo.repository.UserPostReactionRepository;

@ExtendWith(MockitoExtension.class)
class PostServiceMockitoTest {

  @Mock
  private UserPostReactionRepository reactionRepository;

  @InjectMocks
  private PostService postService;

  @Test
  void toggleLike_deveCriarCurtidaQuandoElaNaoExiste() {
    Long userId = 10L;
    Long postId = 20L;

    when(reactionRepository.findByUserIdAndPostId(userId, postId))
        .thenReturn(Optional.empty());

    Map<String, Object> resultado = postService.toggleLike(postId, userId);

    ArgumentCaptor<UserPostReaction> reactionCaptor =
        ArgumentCaptor.forClass(UserPostReaction.class);
    verify(reactionRepository, times(1)).save(reactionCaptor.capture());
    verify(reactionRepository, never()).delete(any(UserPostReaction.class));

    UserPostReaction reactionSalva = reactionCaptor.getValue();
    assertEquals(userId, reactionSalva.getUserId());
    assertEquals(postId, reactionSalva.getPostId());
    assertEquals(postId, resultado.get("postId"));
    assertTrue((Boolean) resultado.get("liked"));
  }
}
