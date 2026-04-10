import api from "@/lib/api";
import { GestationType, GestationTrackingDTO, GestationVisitDTO } from "@/lib/gestationTypes";

type GestationVisitApiDTO = GestationVisitDTO & { cintura_cm?: number | null };

export async function startGestation(payload: {
    userId?: number;
    pesoPreGestacional: string | number;
    alturaCm: string | number;
    dum: string;
    idadeGestacionalInicio?: number;
    tipo?: GestationType;
}) {
    const { data } = await api.post<GestationTrackingDTO>("/gestation/start", payload);
    return data;
}

export async function getCurrentGestation(userId: number) {
    const { data } = await api.get<GestationTrackingDTO | null>(`/gestation/users/${userId}/current`);
    return data;
}

export async function addVisit(
    trackingId: number,
    payload: {
        data: string;
        pesoKg: string | number;
        idadeGestacional?: number;
        paSistolica?: number;
        paDiastolica?: number;
        observacoes?: string;
        cinturaCm?: number;
    }
) {
    const { data } = await api.post<GestationVisitDTO>(`/gestation/${trackingId}/visits`, payload);
    return data;
}

export async function listVisits(trackingId: number, includeAnthro = true): Promise<GestationVisitDTO[]> {
    const { data } = await api.get<GestationVisitApiDTO[]>(
        `/gestation/${trackingId}/visits${includeAnthro ? "?includeAnthro=1" : ""}`
    );

    // Normalize anthropometry waist value from possible snake_case responses.
    return data.map(({ cintura_cm, ...visit }) => ({
        ...visit,
        cinturaCm: visit.cinturaCm ?? (cintura_cm ?? undefined),
    }));
}
