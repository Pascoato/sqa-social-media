package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.demoapp.demo.model.User;
import com.demoapp.demo.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceMockitoTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  @Test
  void createUser_deveSalvarEDevolverUsuario() {
    String email = "teste@email.com";
    String password = "Abcd12!?";
    User usuarioSalvo = new User();
    usuarioSalvo.setId(1L);
    usuarioSalvo.setEmail(email);
    usuarioSalvo.setPassword(password);

    when(userRepository.save(any(User.class))).thenReturn(usuarioSalvo);

    User resultado = userService.createUser(email, password);

    ArgumentCaptor<User> usuarioCaptor = ArgumentCaptor.forClass(User.class);
    verify(userRepository, times(1)).save(usuarioCaptor.capture());

    User usuarioEnviadoParaSalvar = usuarioCaptor.getValue();
    assertEquals(email, usuarioEnviadoParaSalvar.getEmail());
    assertEquals(password, usuarioEnviadoParaSalvar.getPassword());
    assertSame(usuarioSalvo, resultado);
  }
}
