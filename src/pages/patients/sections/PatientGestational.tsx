import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import StartGestationDialog from "@/components/gestation/StartGestationDialog";
import AddVisitDialog from "@/components/gestation/AddVisitDialog";
import { getCurrentGestation, listVisits } from "@/lib/gestation";
import { GestationTrackingDTO, GestationType, GestationVisitDTO } from "@/lib/gestationTypes";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-sm font-medium">{value}</div>
        </div>
    );
}

export default function PatientGestational() {
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);
    const [tracking, setTracking] = useState<GestationTrackingDTO | null>(null);
    const [visits, setVisits] = useState<GestationVisitDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const hasTracking = !!tracking?.id;

    const tipoLabel: Record<GestationType, string> = {
        UNICA: "Única",
        GEMELAR: "Gemelar",
        TRIGEMELAR: "Trigemelar",
    };

    const refresh = useCallback(async () => {
        try {
            if (!Number.isFinite(userId)) throw new Error("ID do paciente inválido");
            setLoading(true);
            const t = await getCurrentGestation(userId);
            setTracking(t);
            setVisits(t?.id ? await listVisits(t.id) : []);
        } catch (error) {
            console.error("Erro ao carregar dados gestacionais:", error);
            toast.error("Erro ao carregar dados gestacionais");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    if (loading) {
        return (
            <Card>
                <CardContent className="space-y-4">
                    <div>
                        <h2 className="text-xl font-bold">🤰 Acompanhamento gestacional</h2>
                        <p className="text-sm text-neutral-600">Carregando...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="space-y-4">
                <div>
                    <h2 className="text-xl font-bold">🤰 Acompanhamento gestacional</h2>
                    <p className="text-sm text-neutral-600">Peso, consultas, recomendações…</p>
                </div>

                {!hasTracking ? (
                    <StartGestationDialog userId={userId} onCreated={refresh} />
                ) : (
                    <>
                        {/* Cabeçalho */}
                        <div className="w-full max-w-5xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <Stat label="IMC pré-gestacional" value={`${tracking.bmiPre} (${tracking.bmiClass})`} />
                                <Stat label="Meta de ganho de peso" value={`${tracking.metaGanhoMinKg}–${tracking.metaGanhoMaxKg} kg`} />
                                <Stat label="Peso pré-gestacional" value={`${tracking.pesoPreGestacional.toFixed(2)} kg`} />
                                <Stat label="Altura/Estatura" value={`${Number(tracking.alturaCm).toFixed(0)} cm`} />
                                <Stat label="Tipo de gestação" value={tipoLabel[tracking.tipoGestacao]} />
                                <Stat label="Idade gestacional" value={`${tracking.idadeGestacionalAtual} semanas`} />
                                <Stat label="DUM" value={new Date(tracking.dum).toLocaleDateString()} />
                                <Stat label="Primeiro acompanhamento" value={new Date(tracking.dataPrimeiroAcompanhamento).toLocaleDateString()} />
                                {/* novos */}
                                <Stat label="IMC atual" value={tracking.imcAtual?.toFixed(1)} />
                                <Stat label="Ganho acumulado" value={`${tracking.ganhoAcumuladoKg?.toFixed(1)} kg`} />
                            </div>

                            {/* Botão abaixo e à direita */}
                            <div className="flex justify-end mt-3">
                                <AddVisitDialog trackingId={tracking.id} onCreated={refresh} />
                            </div>
                        </div>

                        <div className="overflow-auto rounded border mt-2">
                            <table className="min-w-full text-sm">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Data da visita</th>
                                        <th className="px-3 py-2 text-left">Peso (kg)</th>
                                        <th className="px-3 py-2 text-left">Idade gestacional (semanas)</th>
                                        <th className="px-3 py-2 text-left">Trimestre</th>
                                        <th className="px-3 py-2 text-left">Pressão arterial</th>
                                        <th className="px-3 py-2 text-left">Cintura (cm)</th>
                                        <th className="px-3 py-2 text-left">Observações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visits.map(v => (
                                        <tr key={v.id} className="border-t">
                                            <td className="px-3 py-2">{new Date(v.data).toLocaleDateString()}</td>
                                            <td className="px-3 py-2">{Number(v.pesoKg).toFixed(2)}</td>
                                            <td className="px-3 py-2">{v.idadeGestacional ?? "-"}</td>
                                            <td className="px-3 py-2">{v.trimestre ?? "-"}</td>
                                            <td className="px-3 py-2">
                                                {v.paSistolica && v.paDiastolica ? `${v.paSistolica}/${v.paDiastolica}` : "-"}
                                            </td>
                                            <td className="px-3 py-2">{v.cinturaCm ?? "-"}</td>
                                            <td className="px-3 py-2">{v.observacoes || "-"}</td>
                                        </tr>
                                    ))}
                                    {visits.length === 0 && (
                                        <tr>
                                            <td className="px-3 py-6 text-center text-muted-foreground" colSpan={7}>
                                                Nenhuma visita registrada.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}