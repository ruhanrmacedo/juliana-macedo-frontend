import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [metrics, setMetrics] = useState<any[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const userRes = await axios.get("/auth/me");
                setUser(userRes.data);

                const metricsRes = await axios.get("/metrics");
                setMetrics(metricsRes.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    const lastMetric = metrics[0];

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            {/* Seção 1 - Dados do Usuário */}
            <Card>
                <CardContent className="space-y-2">
                    <h2 className="text-xl font-bold">🧍 Dados do Usuário</h2>
                    <div>Nome: {user?.name}</div>
                    <div>Email: {user?.email} <Button variant="ghost">✏️</Button></div>

                    <div>
                        Telefones:
                        {/* Mapear lista de telefones */}
                        <div>(48) 99999-0000 <Button variant="ghost">✏️</Button></div>
                        <Button variant="outline">+ Novo telefone</Button>
                    </div>

                    <div>
                        Endereços:
                        {/* Mapear lista de endereços */}
                        <div>Rua Exemplo, Centro, Truro <Button variant="ghost">✏️</Button></div>
                        <Button variant="outline">+ Novo endereço</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Seção 2 - Métricas Atuais */}
            {lastMetric && (
                <Card>
                    <CardContent className="space-y-2">
                        <h2 className="text-xl font-bold">⚖️ Métricas Atuais</h2>
                        <div>Peso: {lastMetric.peso} kg <Button variant="ghost">✏️</Button></div>
                        <div>Altura: {lastMetric.altura} m <Button variant="ghost">✏️</Button></div>
                        <div>Idade: {lastMetric.idade} anos <Button variant="ghost">✏️</Button></div>
                        <div>Sexo: {lastMetric.sexo === "F" ? "Feminino" : "Masculino"} <Button variant="ghost">✏️</Button></div>
                        <div>Nível de Atividade: {lastMetric.nivelAtividade} <Button variant="ghost">✏️</Button></div>
                        <div>Gordura Corporal: {lastMetric.gorduraCorporal ?? "Não informado"} <Button variant="ghost">✏️</Button></div>
                    </CardContent>
                </Card>
            )}

            {/* Seção 3 - Histórico de Métricas */}
            <Card>
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
                                {Array.isArray(metrics) && metrics.map((m, i) => (
                                    <tr key={i} className="border-b">
                                        <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                                        <td>{m.peso}</td>
                                        <td>{m.altura}</td>
                                        <td>{m.gorduraCorporal ?? "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline">🔍 Ver como gráfico</Button>
                        <Button variant="outline">📆 Filtrar por data</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Perfil;