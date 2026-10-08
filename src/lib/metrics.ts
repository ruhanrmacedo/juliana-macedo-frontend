export type Sexo = "M" | "F";

export type NivelAtividadeFE =
  | "Sedentário"
  | "Levemente Ativo"
  | "Moderadamente Ativo"
  | "Altamente Ativo"
  | "Atleta";

export const nivelToFactor: Record<NivelAtividadeFE, number> = {
  "Sedentário": 1.2,
  "Levemente Ativo": 1.375,
  "Moderadamente Ativo": 1.55,
  "Altamente Ativo": 1.725,
  "Atleta": 1.9,
};

export const nivelToBackendValue: Record<NivelAtividadeFE, string> = {
  "Sedentário": "Sedentário",
  "Levemente Ativo": "Levemente Ativo",
  "Moderadamente Ativo": "Moderadamente Ativo",
  "Altamente Ativo": "Altamente Ativo",
  "Atleta": "Atleta / Muito Ativo",
};

export const nivelFromBackend: Record<string, NivelAtividadeFE> = {
  "Sedentário": "Sedentário",
  "Levemente Ativo": "Levemente Ativo",
  "Moderadamente Ativo": "Moderadamente Ativo",
  "Altamente Ativo": "Altamente Ativo",
  "Atleta": "Atleta",
  "Atleta / Muito Ativo": "Atleta",
};

export function parseNumberBR(value: string | number): number {
  const parsed = typeof value === "number" ? value : Number(value.replace(",", "."));
  if (!Number.isFinite(parsed)) throw new Error("Informe um número válido.");
  return parsed;
}

export function normalizeAlturaToMeters(value: string | number): number {
  const parsed = parseNumberBR(value);
  if (parsed >= 90 && parsed <= 250) return parsed / 100;
  if (parsed >= 0.9 && parsed <= 2.5) return parsed;
  if (parsed > 2.5 && parsed < 400) return parsed / 100;
  throw new Error("Altura fora do intervalo plausível (0,90 m a 2,50 m).");
}

export function normalizePesoKg(value: string | number): number {
  const parsed = parseNumberBR(value);
  if (parsed < 30 || parsed > 400) {
    throw new Error("Peso fora do intervalo plausível (30–400 kg).");
  }
  return parsed;
}

export function normalizeIdade(value: string | number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 5 || parsed > 120) {
    throw new Error("Idade fora do intervalo plausível (5–120 anos).");
  }
  return Math.round(parsed);
}

export function normalizeGordura(
  value: string | number | null | undefined,
): number | undefined {
  if (value == null || value === "") return undefined;
  const parsed = parseNumberBR(value);
  if (parsed < 0 || parsed > 70) {
    throw new Error("Gordura corporal deve estar entre 0% e 70%.");
  }
  return parsed;
}

export function calcularIMC(pesoKg: number, alturaM: number): number {
  return pesoKg / (alturaM * alturaM);
}

export function classificarIMC(imc: number): string {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 24.9) return "Peso normal";
  if (imc < 29.9) return "Sobrepeso";
  if (imc < 34.9) return "Obesidade grau 1";
  if (imc < 39.9) return "Obesidade grau 2";
  return "Obesidade grau 3";
}

// Harris-Benedict, igual ao backend legado, para evitar resultados divergentes.
export function calcularTMB({
  pesoKg,
  alturaCm,
  idade,
  sexo,
}: {
  pesoKg: number;
  alturaCm: number;
  idade: number;
  sexo: Sexo;
}): number {
  return sexo === "M"
    ? 66 + 13.7 * pesoKg + 5 * alturaCm - 6.8 * idade
    : 655 + 9.6 * pesoKg + 1.8 * alturaCm - 4.7 * idade;
}

export function calcularTDEE({
  pesoKg,
  alturaCm,
  idade,
  sexo,
  nivel,
}: {
  pesoKg: number;
  alturaCm: number;
  idade: number;
  sexo: Sexo;
  nivel: NivelAtividadeFE;
}): number {
  return calcularTMB({ pesoKg, alturaCm, idade, sexo }) * nivelToFactor[nivel];
}

export function calcularMacronutrientes(tdee: number) {
  return {
    proteinas: (tdee * 0.3) / 4,
    carboidratos: (tdee * 0.5) / 4,
    gorduras: (tdee * 0.2) / 9,
  };
}

export function calcularAguaMl(pesoKg: number): number {
  return pesoKg * 45;
}

export function msgTDEE(tdee: number): string {
  return `Estimativa educativa de ${tdee.toFixed(0)} kcal por dia. Não substitui avaliação individualizada.`;
}
