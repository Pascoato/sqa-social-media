package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;

// Testa o UserService com o repositorio "falso" (sem banco de dados).
@ExtendWith(MockitoExtension.class)
class UserServiceMockitoTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  @Test
  void createUserDeveSalvarUsuarioNoRepositorio() {
    // Arrange
    User salvo = new User();
    salvo.setEmail("teste@email.com");
    when(userRepository.save(any(User.class))).thenReturn(salvo);

    // Act
    User resultado = userService.createUser("teste@email.com", "Abcd12!?");

    // Assert: confere o que foi enviado para o repositorio
    ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
    verify(userRepository).save(captor.capture());
    assertEquals("teste@email.com", captor.getValue().getEmail());
    assertEquals("Abcd12!?", captor.getValue().getPassword());
    assertEquals("teste@email.com", resultado.getEmail());
  }

  @Test
  void findByEmailDeveRetornarNullQuandoNaoExiste() {
    // Arrange
    when(userRepository.findByEmail("x@x.com")).thenReturn(Optional.empty());

    // Act
    User resultado = userService.findByEmail("x@x.com");

    // Assert
    assertNull(resultado);
  }
}
