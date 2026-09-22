package com.demoapp.demo.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class UserServiceTest {

  private final UserService userService = new UserService(null);

  @Test
  void isPasswordValid_deveAceitarSenhaForteComOitoCaracteres() {
    boolean resultado = userService.isPasswordValid("Abcd12!?");

    assertTrue(resultado);
  }

  @Test
  void isPasswordValid_deveRejeitarSenhaSemLetraMaiuscula() {
    boolean resultado = userService.isPasswordValid("abcdef1!");

    assertFalse(resultado);
  }
}
