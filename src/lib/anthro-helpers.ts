import type { AnthroEval, MethodKey, Sex } from "./anthro-types";

export const REQUIRED: Record<
    MethodKey | "WHO_BAZ" | "WHO_HAZ" | "WHO_WHZ",
    { label: string; sites: (keyof AnthroEval)[] | ((sexo?: Sex) => (keyof AnthroEval)[]) }
> = {
    DURNIN_WOMERSLEY: { label: "Durnin & Womersley (4 dobras)", sites: ["triceps_mm", "biceps_mm", "subescapular_mm", "supra_iliaca_mm"] },
    FAULKNER: { label: "Faulkner (4 dobras)", sites: ["triceps_mm", "subescapular_mm", "supra_iliaca_mm", "abdominal_mm"] },
    GUEDES: { label: "Guedes (4 dobras)", sites: ["triceps_mm", "subescapular_mm", "supra_iliaca_mm", "abdominal_mm"] },
    JACKSON_POLLOCK_3: {
        label: "Jackson & Pollock 3 (H: Peitoral+Abdominal+Coxa | M: Tríceps+Supra-ilíaca+Coxa)",
        sites: (sexo?: Sex) => (sexo === "F" ? ["triceps_mm", "supra_iliaca_mm", "coxa_mm"] : ["peitoral_torax_mm", "abdominal_mm", "coxa_mm"])
    },
    JACKSON_POLLOCK_7: {
        label: "Jackson & Pollock 7 (7 dobras)",
        sites: ["peitoral_torax_mm", "axilar_media_mm", "triceps_mm", "subescapular_mm", "abdominal_mm", "supra_iliaca_mm", "coxa_mm"]
    },
    JACKSON_POLLOCK_WARD_3: { label: "Jackson/Pollock-Ward 3 (feminino)", sites: ["triceps_mm", "supra_iliaca_mm", "coxa_mm"] },
    JACKSON_POLLOCK_WARD_7: {
        label: "Jackson/Pollock-Ward 7 (feminino)",
        sites: ["triceps_mm", "supra_iliaca_mm", "subescapular_mm", "abdominal_mm", "peitoral_torax_mm", "axilar_media_mm", "coxa_mm"]
    },
    PETROSKI: { label: "Petroski", sites: ["triceps_mm", "subescapular_mm", "supra_iliaca_mm", "coxa_mm", "abdominal_mm"] },
    SLAUGHTER: { label: "Slaughter (2 dobras, pediatria)", sites: ["triceps_mm", "subescapular_mm"] },
    WHO_BAZ: { label: "OMS BAZ (5–19 anos)", sites: [] },
    WHO_HAZ: { label: "OMS HAZ (altura-para-idade)", sites: [] },
    WHO_WHZ: { label: "OMS WHZ/WFL (0–59 meses)", sites: [] },
};

export function suggestMethod(idade?: number, sexo?: Sex): MethodKey | undefined {
    if (idade == null || Number.isNaN(idade)) return;
    if (idade >= 5 && idade <= 19) return "WHO_BAZ";
    if (idade >= 18) return sexo === "M" ? "JACKSON_POLLOCK_3" : "JACKSON_POLLOCK_WARD_3";
    return;
}

export function parseNumber(x: unknown): number | undefined {
    if (x === undefined || x === null || x === "") return;
    const n = Number(String(x).replace(",", "."));
    return Number.isFinite(n) ? n : undefined;
}

export function calcIMC(peso?: unknown, altura?: unknown): number | undefined {
    const p = parseNumber(peso);
    const a = parseNumber(altura);
    if (!p || !a || a <= 0) return;
    return +(p / (a * a)).toFixed(2);
}
