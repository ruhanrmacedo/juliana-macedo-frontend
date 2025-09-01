import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import StartGestationDialog from "@/components/gestation/StartGestationDialog";
import AddVisitDialog from "@/components/gestation/AddVisitDialog";
import { getCurrentGestation, listVisits } from "@/lib/gestation";
import { Button } from "@/components/ui/button";
import { GestationTrackingDTO, GestationVisitDTO } from "@/lib/gestationTypes";
import { toast } from "sonner";

export default function PatientGestational({ userId }: { userId: number }) {
    const [tracking, setTracking] = useState<GestationTrackingDTO | null>(null);
    const [visits, setVisits] = useState<GestationVisitDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const hasTracking = !!tracking?.id;

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const t = await getCurrentGestation(userId);
            setTracking(t);
            if (t?.id) {
                const list = await listVisits(t.id);
                setVisits(list);
            } else {
                setVisits([]);
            }
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
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <div>IMC pré: <b>{tracking.bmiPre}</b> ({tracking.bmiClass})</div>
                                <div>Meta de ganho: <b>{tracking.metaGanhoMinKg}–{tracking.metaGanhoMaxKg} kg</b></div>
                            </div>
                            <AddVisitDialog trackingId={tracking.id} onCreated={refresh} />
                        </div>

                        <div className="overflow-auto rounded border">
                            <table className="min-w-full text-sm">
                                <thead className="bg-muted/40">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Data</th>
                                        <th className="px-3 py-2 text-left">Peso (kg)</th>
                                        <th className="px-3 py-2 text-left">IG (sem)</th>
                                        <th className="px-3 py-2 text-left">Tri</th>
                                        <th className="px-3 py-2 text-left">PA</th>
                                        <th className="px-3 py-2 text-left">Obs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visits.map(v => (
                                        <tr key={v.id} className="border-t">
                                            <td className="px-3 py-2">{new Date(v.data).toLocaleDateString()}</td>
                                            <td className="px-3 py-2">{Number(v.pesoKg).toFixed(2)}</td>
                                            <td className="px-3 py-2">{v.idadeGestacional ?? "-"}</td>
                                            <td className="px-3 py-2">{v.trimestre ?? "-"}</td>
                                            <td className="px-3 py-2">{v.paSistolica && v.paDiastolica ? `${v.paSistolica}/${v.paDiastolica}` : "-"}</td>
                                            <td className="px-3 py-2">{v.observacoes || "-"}</td>
                                        </tr>
                                    ))}
                                    {visits.length === 0 && (
                                        <tr><td className="px-3 py-6 text-center text-muted-foreground" colSpan={6}>Nenhuma visita registrada.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* depois você pluga Recharts aqui com series de peso e ganho semanal */}
                        <div className="text-xs text-muted-foreground">
                            Em breve: gráficos de peso/ganho vs meta por trimestre.
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}