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

@WebMvcTest(AuthController.class)
class AuthControllerMockMvcTest {

  @Autowired
  private MockMvc mockMvc;

  @MockBean
  private UserService userService;

  @Test
  void signup_deveRetornarConflitoComMensagemEmailJaCadastrado() throws Exception {
    String email = "aluno@fag.edu.br";
    String password = "Abcd12!?";
    User usuarioExistente = new User();
    usuarioExistente.setEmail(email);

    when(userService.isEmailValid(email)).thenReturn(true);
    when(userService.isPasswordValid(password)).thenReturn(true);
    when(userService.findByEmail(email)).thenReturn(usuarioExistente);

    mockMvc.perform(post("/auth/signup")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "aluno@fag.edu.br",
              "password": "Abcd12!?"
            }
            """))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.status").value(409))
        .andExpect(jsonPath("$.message").value("E-mail já cadastrado"));
  }

  @Test
  void signin_deveRetornarNaoAutorizadoParaCredenciaisInvalidas() throws Exception {
    String email = "inexistente@fag.edu.br";
    String password = "Abcd12!?";

    when(userService.isEmailValid(email)).thenReturn(true);
    when(userService.isPasswordValid(password)).thenReturn(true);
    when(userService.findByEmail(email)).thenReturn(null);

    mockMvc.perform(post("/auth/signin")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "inexistente@fag.edu.br",
              "password": "Abcd12!?"
            }
            """))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.status").value(401))
        .andExpect(jsonPath("$.message").value("Credenciais inválidas"));
  }
}
