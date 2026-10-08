export type HomeCalculatorId = "imc" | "tmb" | "tdee" | "macros" | "water";

export const INITIAL_OPEN_CALCULATOR: HomeCalculatorId | null = null;

export function toggleOpenCalculator(
  current: HomeCalculatorId | null,
  requested: HomeCalculatorId,
): HomeCalculatorId | null {
  return current === requested ? null : requested;
}
