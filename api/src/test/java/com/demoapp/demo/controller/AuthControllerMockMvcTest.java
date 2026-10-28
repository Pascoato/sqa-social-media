package com.demoapp.demo.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.demoapp.demo.model.User;
import com.demoapp.demo.service.UserService;

// Testa o endpoint HTTP (status e JSON). O service e "falso" (MockBean).
@WebMvcTest(AuthController.class)
class AuthControllerMockMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private UserService userService;

  // O requisito pede a mensagem "E-mail já cadastrado". O controller devolvia
  // "E-mail já está em uso".
  @Test
  void signupComEmailRepetidoDeveRetornar409() throws Exception {
    // Arrange: o service diz que o e-mail e a senha sao validos e que o e-mail ja existe
    when(userService.isEmailValid("aluno@fag.edu.br")).thenReturn(true);
    when(userService.isPasswordValid("Abcd12!?")).thenReturn(true);
    when(userService.findByEmail("aluno@fag.edu.br")).thenReturn(new User());

    // Act + Assert
    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"aluno@fag.edu.br\",\"password\":\"Abcd12!?\"}"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("E-mail já cadastrado"));
  }

  @Test
  void signinComUsuarioInexistenteDeveRetornar401() throws Exception {
    // Arrange: e-mail e senha validos, mas o usuario nao existe
    when(userService.isEmailValid("naoexiste@fag.edu.br")).thenReturn(true);
    when(userService.isPasswordValid("Abcd12!?")).thenReturn(true);
    when(userService.findByEmail("naoexiste@fag.edu.br")).thenReturn(null);

    // Act + Assert
    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"naoexiste@fag.edu.br\",\"password\":\"Abcd12!?\"}"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
  }
}
