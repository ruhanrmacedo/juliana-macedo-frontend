import { describe, expect, it } from "vitest";
import { createBasicRegistrationPayload, getPostLoginDestination } from "./authFlows";
import {
  calcularAguaMl,
  calcularIMC,
  calcularMacronutrientes,
  calcularTDEE,
  calcularTMB,
  classificarIMC,
} from "./metrics";

describe("Fase 1 - fluxos de conta", () => {
  it("cria apenas o payload básico do cadastro público", () => {
    expect(createBasicRegistrationPayload({
      name: " Juliana ",
      email: " JULIANA@EXAMPLE.COM ",
      password: "SenhaSegura123",
      confirmPassword: "SenhaSegura123",
      captchaToken: "captcha",
    })).toEqual({
      name: "Juliana",
      email: "juliana@example.com",
      password: "SenhaSegura123",
      confirmPassword: "SenhaSegura123",
      captchaToken: "captcha",
    });
  });

  it("retorna à rota de origem legítima ou à home", () => {
    expect(getPostLoginDestination({ from: { pathname: "/perfil" } })).toBe("/perfil");
    expect(getPostLoginDestination(null)).toBe("/");
    expect(getPostLoginDestination({ from: { pathname: "https://example.com" } })).toBe("/");
  });
});

describe("Fase 1 - cálculos educativos determinísticos", () => {
  it("calcula e classifica IMC", () => {
    const imc = calcularIMC(70, 1.75);
    expect(imc).toBeCloseTo(22.8571, 4);
    expect(classificarIMC(imc)).toBe("Peso normal");
  });

  it("usa Harris-Benedict de forma consistente em TMB e TDEE", () => {
    const tmb = calcularTMB({ pesoKg: 70, alturaCm: 175, idade: 25, sexo: "M" });
    const tdee = calcularTDEE({
      pesoKg: 70,
      alturaCm: 175,
      idade: 25,
      sexo: "M",
      nivel: "Moderadamente Ativo",
    });
    expect(tmb).toBeCloseTo(1730, 5);
    expect(tdee).toBeCloseTo(tmb * 1.55, 5);
  });

  it("mantém macros 30/50/20 e água em 45 ml/kg", () => {
    expect(calcularMacronutrientes(2000)).toEqual({
      proteinas: 150,
      carboidratos: 250,
      gorduras: 2000 * 0.2 / 9,
    });
    expect(calcularAguaMl(70)).toBe(3150);
  });
});
