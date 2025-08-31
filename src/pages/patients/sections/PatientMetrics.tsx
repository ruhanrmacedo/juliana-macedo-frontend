import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { ModalEditMetrics } from "@/components/ModalEditMetrics";
import type { UserMetrics as TMetrics } from "@/lib/domain";

type PatientCtx = { patient: { id: number; name: string } | null };

export default function PatientMetrics() {
    const { patient } = useOutletContext<PatientCtx>();
    const [metrics, setMetrics] = useState<TMetrics[] | null>(null);
    const [open, setOpen] = useState(false);

    const lastMetric = useMemo(() => metrics?.[0] ?? null, [metrics]);

    useEffect(() => {
        if (!patient?.id) return;
        (async () => {
            const { data } = await api.get<TMetrics[]>("/metrics", {
                params: { userId: patient.id }, // admin pode ver de outro usuário
            });
            setMetrics(data);
        })();
    }, [patient?.id]);

    return (
        <>
            <Card>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">⚖️ Métricas Atuais</h2>
                        <div className="space-x-2">
                            <Button variant="outline" onClick={() => setOpen(true)}>
                                {lastMetric ? "✏️ Atualizar métricas" : "➕ Nova métrica"}
                            </Button>
                        </div>
                    </div>

                    {lastMetric ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                            <p><strong>Peso:</strong> {lastMetric.peso} kg</p>
                            <p><strong>Altura:</strong> {lastMetric.altura} m</p>
                            <p><strong>Idade:</strong> {lastMetric.idade} anos</p>
                            <p><strong>Sexo:</strong> {lastMetric.sexo === "F" ? "Feminino" : "Masculino"}</p>
                            <p><strong>Nível de Atividade:</strong> {lastMetric.nivelAtividade}</p>
                            <p><strong>Gordura Corporal:</strong> {lastMetric.gorduraCorporal ?? "Não informado"}</p>
                        </div>
                    ) : (
                        <div className="text-sm text-neutral-600">
                            Nenhuma métrica cadastrada para este paciente.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardContent>
                    <h2 className="text-xl font-bold mb-2">📊 Histórico de Métricas</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b">
                                    <th>Data</th>
                                    <th>Peso (kg)</th>
                                    <th>Altura (m)</th>
                                    <th>Gordura (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metrics?.map((m) => (
                                    <tr key={m.id} className="border-b">
                                        <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                                        <td>{m.peso}</td>
                                        <td>{m.altura}</td>
                                        <td>{m.gorduraCorporal ?? "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <ModalEditMetrics
                open={open}
                onClose={() => setOpen(false)}
                initialData={lastMetric ?? {}}
                userId={patient?.id}            // ⬅️ importante para o admin
                onSuccess={async () => {
                    if (!patient?.id) return;
                    const { data } = await api.get<TMetrics[]>("/metrics", {
                        params: { userId: patient.id },
                    });
                    setMetrics(data);
                }}
            />
        </>
    );
}
