// src/lib/metrics.ts
export type Sexo = "M" | "F";

export type NivelAtividadeFE =
    | "Sedentário"
    | "Levemente Ativo"
    | "Moderadamente Ativo"
    | "Altamente Ativo"
    | "Atleta"; // nossa label curta no FE

export const nivelToFactor = {
    "Sedentário": 1.2,
    "Levemente Ativo": 1.375,
    "Moderadamente Ativo": 1.55,
    "Altamente Ativo": 1.725,
    "Atleta": 1.9,
} as const;

// NOVO: label do FE -> valor exato do enum no backend
export const nivelToBackendValue: Record<NivelAtividadeFE, string> = {
    "Sedentário": "Sedentário",
    "Levemente Ativo": "Levemente Ativo",
    "Moderadamente Ativo": "Moderadamente Ativo",
    "Altamente Ativo": "Altamente Ativo",
    "Atleta": "Atleta / Muito Ativo",
};

export const nivelFromBackend = {
    "Sedentário": "Sedentário",
    "Levemente Ativo": "Levemente Ativo",
    "Moderadamente Ativo": "Moderadamente Ativo",
    "Altamente Ativo": "Altamente Ativo",
    "Atleta / Muito Ativo": "Atleta",
} as const;

export function parseNumberBR(value: string | number): number {
    if (typeof value === "number") return value;
    return parseFloat(value.replace(",", "."));
}

export function calcularTMB({
    pesoKg,
    alturaCm,
    idade,
    sexo,
}: { pesoKg: number; alturaCm: number; idade: number; sexo: Sexo; }): number {
    const base = 10 * pesoKg + 6.25 * alturaCm - 5 * idade;
    return sexo === "M" ? base + 5 : base - 161;
}

export function calcularTDEE({
    pesoKg, alturaCm, idade, sexo, nivel,
}: {
    pesoKg: number; alturaCm: number; idade: number; sexo: Sexo; nivel: NivelAtividadeFE;
}): number {
    const tmb = calcularTMB({ pesoKg, alturaCm, idade, sexo });
    return tmb * nivelToFactor[nivel];
}

export function msgTDEE(tdee: number): string {
    return `Use ${tdee.toFixed(0)} kcal como referência diária. Ajuste conforme seu objetivo.`;
}

// 📌 Aceita altura em m (1.84) ou cm (184) e devolve SEMPRE em metros
export function normalizeAlturaToMeters(value: string | number): number {
    const v = parseNumberBR(value);
    // cm típicos
    if (v >= 90 && v <= 250) return v / 100;
    // metros típicos
    if (v >= 0.9 && v <= 2.5) return v;
    // valores como 300, 350 (erros comuns) -> tenta cm
    if (v > 2.5 && v < 400) return v / 100;
    throw new Error("Altura fora do intervalo plausível (0,9 m a 2,5 m).");
}

export function normalizePesoKg(value: string | number): number {
    const kg = parseNumberBR(value);
    if (kg < 0 || kg > 400) throw new Error("Peso fora do intervalo plausível (0–400 kg).");
    return kg;
}

export function normalizeIdade(value: string | number): number {
    const age = Number(value);
    if (!Number.isFinite(age) || age < 0 || age > 120) {
        throw new Error("Idade fora do intervalo plausível (0–120 anos).");
    }
    return age;
}

export function normalizeGordura(
    value: string | number | null | undefined
): number | undefined {
    // == null cobre undefined ou null
    if (value == null || value === "") return undefined;
    // após o guard, value é string | number, então não precisa de cast
    const g = parseNumberBR(value);
    // escolha 70 OU 75 — aqui deixei 75 para bater com a mensagem
    if (g < 0 || g > 75) {
        throw new Error("Gordura corporal deve estar entre 0% e 75%.");
    }
    return g;
}
