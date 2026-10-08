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
  });
});
