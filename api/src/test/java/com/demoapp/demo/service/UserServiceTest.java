package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

// Teste unitario simples: so JUnit, sem Spring, sem Mockito, sem MockMvc.
class UserServiceTest {

  // O repositorio nao e usado em isPasswordValid, entao passamos null
  private final UserService userService = new UserService(null);

  @Test
  void senhaForteDeveSerAceita() {
    boolean resultado = userService.isPasswordValid("Abcd12!?");

    assertTrue(resultado);
  }

  @Test
  void senhaSemMaiusculaDeveSerRejeitada() {
    boolean resultado = userService.isPasswordValid("abcdef1!");

    assertFalse(resultado);
  }
}
