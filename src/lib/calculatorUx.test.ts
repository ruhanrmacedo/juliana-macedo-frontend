import { describe, expect, it } from "vitest";
import { getCalculatorUiState } from "./calculatorUx";

describe("UX das calculadoras", () => {
  it("visitante não vê métricas salvas nem ação de salvar", () => {
    expect(getCalculatorUiState({
      isAuthenticated: false,
      isPatientMode: false,
      hasStoredMetrics: true,
      hasResult: false,
    })).toEqual({
      showUseStoredMetrics: false,
      showSave: false,
      showEducationalNotice: false,
    });
  });

  it("visitante vê aviso educativo somente depois do resultado", () => {
    const ui = getCalculatorUiState({
      isAuthenticated: false,
      isPatientMode: false,
      hasStoredMetrics: false,
      hasResult: true,
    });
    expect(ui.showEducationalNotice).toBe(true);
    expect(ui.showSave).toBe(false);
  });

  it("autenticado sem métricas não recebe atalho inútil", () => {
    expect(getCalculatorUiState({
      isAuthenticated: true,
      isPatientMode: false,
      hasStoredMetrics: false,
      hasResult: false,
    }).showUseStoredMetrics).toBe(false);
  });

  it("autenticado com métricas pode usar seus dados", () => {
    expect(getCalculatorUiState({
      isAuthenticated: true,
      isPatientMode: false,
      hasStoredMetrics: true,
      hasResult: false,
    }).showUseStoredMetrics).toBe(true);
  });

  it("salvamento autenticado só aparece depois do resultado", () => {
    expect(getCalculatorUiState({
      isAuthenticated: true,
      isPatientMode: false,
      hasStoredMetrics: false,
      hasResult: false,
    }).showSave).toBe(false);
    expect(getCalculatorUiState({
      isAuthenticated: true,
      isPatientMode: false,
      hasStoredMetrics: false,
      hasResult: true,
    }).showSave).toBe(true);
  });
});
