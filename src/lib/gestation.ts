import api from "@/lib/api";
import { GestationType, GestationTrackingDTO, GestationVisitDTO } from "@/lib/gestationTypes";

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
    }
) {
    const { data } = await api.post<GestationVisitDTO>(`/gestation/${trackingId}/visits`, payload);
    return data;
}

export async function listVisits(trackingId: number) {
    const { data } = await api.get<GestationVisitDTO[]>(`/gestation/${trackingId}/visits`);
    return data;
}