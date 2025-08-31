export type Sex = "M" | "F";
export type NumStr = number | string | undefined;

export type AnthroEval = {
    id?: number;
    userId: number;
    measuredAt: string; // yyyy-mm-dd
    sexo?: Sex;
    idade?: NumStr;
    peso?: NumStr;
    altura?: NumStr;

    // dobras (mm)
    triceps_mm?: NumStr;
    biceps_mm?: NumStr;
    subescapular_mm?: NumStr;
    supra_iliaca_mm?: NumStr;
    abdominal_mm?: NumStr;
    peitoral_torax_mm?: NumStr;
    axilar_media_mm?: NumStr;
    coxa_mm?: NumStr;
    panturrilha_medial_mm?: NumStr;

    // circunferências (cm)
    cintura_cm?: NumStr;
    quadril_cm?: NumStr;
    pescoco_cm?: NumStr;
    braco_muac_cm?: NumStr;
    coxa_circ_cm?: NumStr;
    panturrilha_circ_cm?: NumStr;
};

export type AnthroResult = {
    id: number;
    method: string;
    percentualGordura?: number;
    massaGordaKg?: number;
    massaMagraKg?: number;
    zScore?: number;
    percentil?: number;
    classificacao?: string;
    createdAt: string;
};

export const METHODS = [
    "DURNIN_WOMERSLEY",
    "FAULKNER",
    "GUEDES",
    "JACKSON_POLLOCK_3",
    "JACKSON_POLLOCK_7",
    "JACKSON_POLLOCK_WARD_3",
    "JACKSON_POLLOCK_WARD_7",
    "PETROSKI",
    "WHO_BAZ",
    "WHO_HAZ",
    "WHO_WHZ",
    "SLAUGHTER",
] as const;

export type MethodKey = (typeof METHODS)[number];
