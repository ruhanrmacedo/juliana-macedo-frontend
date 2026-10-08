import { describe, expect, it } from "vitest";
import {
  INITIAL_OPEN_CALCULATOR,
  toggleOpenCalculator,
} from "./calculatorAccordion";

describe("accordion das calculadoras da Home", () => {
  it("começa com os cinco cards recolhidos", () => {
    expect(INITIAL_OPEN_CALCULATOR).toBeNull();
  });

  it("abre a calculadora escolhida", () => {
    expect(toggleOpenCalculator(null, "imc")).toBe("imc");
  });

  it("permite recolher a calculadora aberta", () => {
    expect(toggleOpenCalculator("imc", "imc")).toBeNull();
  });

  it("abrir outra calculadora recolhe a anterior", () => {
    expect(toggleOpenCalculator("imc", "tmb")).toBe("tmb");
  });
});
