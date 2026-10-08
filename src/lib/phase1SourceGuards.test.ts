import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf-8");
}

describe("Fase 1 - garantias estruturais dos fluxos", () => {
  it("login não usa métricas como gate", () => {
    const login = source("src/pages/Login.tsx");
    expect(login).not.toContain("/metrics/check");
    expect(login).toContain("getPostLoginDestination(location.state)");
  });

  it("cadastro público usa somente o endpoint básico", () => {
    const register = source("src/pages/UserRegister.tsx");
    expect(register).toContain('"/auth/register"');
    expect(register).not.toContain("/auth/register/full");
  });

  it("cálculo e persistência são ações separadas", () => {
    const calculator = source("src/components/calculators/CalculatorTool.tsx");
    expect(calculator).toContain("calculateEducationalResult(kind, nextForm)");
    expect(calculator).toContain("const saveMetrics = async () =>");
    expect(calculator.match(/api\.post\("\/metrics"/g)).toHaveLength(1);
    expect(calculator).not.toContain("setAskUpdate");
    expect(calculator).not.toContain("Use dados temporários para uma estimativa educativa");
    expect(calculator).toContain("ui.showUseStoredMetrics");
    expect(calculator).toContain("ui.showEducationalNotice");
    expect(calculator).toContain("ui.showSave");
  });

  it("a Home controla um único card expandido por vez", () => {
    const container = source("src/components/Calculadoras.tsx");
    expect(container).toContain("INITIAL_OPEN_CALCULATOR");
    expect(container).toContain("toggleOpenCalculator");
    expect(container.match(/expanded={openCalculator ===/g)).toHaveLength(5);
  });

  it("os cards recolhidos possuem ação Ver e conteúdo acessível", () => {
    const calculator = source("src/components/calculators/CalculatorTool.tsx");
    expect(calculator).toContain("aria-expanded={false}");
    expect(calculator).toContain("{config.viewLabel}");
    expect(calculator).toContain("aria-controls={contentId}");
    expect(calculator).toContain("{expanded && (");
  });

  it("as cinco calculadoras continuam usando o fluxo público compartilhado", () => {
    for (const file of [
      "CalculatorIMC.tsx",
      "CalculatorTMB.tsx",
      "CalculatorTDEE.tsx",
      "CalculatorMacronutrients.tsx",
      "CalculatorWater.tsx",
    ]) {
      expect(source(`src/components/calculators/${file}`)).toContain("<CalculatorTool");
    }
  });
});
