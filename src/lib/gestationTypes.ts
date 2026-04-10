export type GestationType = "UNICA" | "GEMELAR" | "TRIGEMELAR";

export type BMIClass = "UNDER" | "NORMAL" | "OVER" | "OBESE";

export interface GestationTrackingDTO {
    id: number;
    userId: number;
    dum: string; // ISO (YYYY-MM-DD)
    bmiPre: number;
    bmiClass: BMIClass;
    metaGanhoMinKg: number;
    metaGanhoMaxKg: number;

    pesoPreGestacional: number;
    alturaCm: number;
    tipoGestacao: GestationType;
    idadeGestacionalInicio?: number | null;
    idadeGestacionalAtual: number;             // calculado no backend
    dataPrimeiroAcompanhamento: string;        // ISO Date

    ganhoAcumuladoKg?: number | null;          // calculado no backend
    imcAtual?: number | null;                  // calculado no backend
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

    cinturaCm?: number;
}
