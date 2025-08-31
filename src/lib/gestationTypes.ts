export type GestationType = "UNICA" | "GEMELAR" | "TRIGEMELAR";

export type BMIClass = "UNDER" | "NORMAL" | "OVER" | "OBESE";

export interface GestationTrackingDTO {
    id: number;
    userId: number;
    dum: string; // ISO
    bmiPre: number;
    bmiClass: BMIClass;
    metaGanhoMinKg: number;
    metaGanhoMaxKg: number;
}

export interface GestationVisitDTO {
    id: number;
    trackingId: number;
    data: string;               // ISO
    pesoKg: number;
    idadeGestacional?: number;
    trimestre?: 1 | 2 | 3;
    paSistolica?: number;
    paDiastolica?: number;
    observacoes?: string;
}
