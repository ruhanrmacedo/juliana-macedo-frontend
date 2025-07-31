import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { ModalEdit } from "@/components/ModalEdit";
import { ModalAddress } from "@/components/ModalAddress";

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [metrics, setMetrics] = useState<any[] | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{
        label: string;
        value: string;
        endpoint: string;
        fieldName: string;
        method?: "put" | "patch" | "post";
    }>({
        label: "",
        value: "",
        endpoint: "",
        fieldName: "",
        method: "put", // valor default
    });
    const [modalAddressOpen, setModalAddressOpen] = useState(false);
    const [modalAddressData, setModalAddressData] = useState<{
        method: "post" | "put";
        endpoint: string;
        initialData?: any;
    }>({
        method: "post",
        endpoint: "",
        initialData: {},
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const userRes = await api.get("/auth/me");
                setUser(userRes.data);

                const metricsRes = await api.get("/metrics");
                setMetrics(metricsRes.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    function openModal({ label, value, endpoint, fieldName, method = "put" }: any) {
        setModalData({ label, value, endpoint, fieldName, method });
        setModalOpen(true);
    }

    const lastMetric = Array.isArray(metrics) && metrics.length > 0 ? metrics[0] : null;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8">
            {/* Seção 1 - Dados do Usuário */}
            <Card>
                <CardContent className="space-y-2">
                    <h2 className="text-xl font-bold">🧍 Dados do Usuário</h2>
                    <div>
                        Nome: {user?.name}
                        <Button variant="ghost" onClick={() =>
                            openModal({
                                label: "Nome",
                                value: user.name,
                                endpoint: `/user`,
                                fieldName: "name"
                            })
                        }>
                            ✏️
                        </Button>
                    </div>
                    <div>
                        CPF: {user?.cpf}
                        <Button variant="ghost" onClick={() =>
                            openModal({
                                label: "CPF",
                                value: user.cpf,
                                endpoint: `/user`,
                                fieldName: "cpf"
                            })
                        }>
                            ✏️
                        </Button>
                    </div>

                    <div>
                        Data de nascimento: {user?.dataNascimento && new Date(user.dataNascimento).toLocaleDateString()}
                        <Button variant="ghost" onClick={() =>
                            openModal({
                                label: "Data de nascimento",
                                value: user.dataNascimento,
                                endpoint: `/user`,
                                fieldName: "dataNascimento"
                            })
                        }>
                            ✏️
                        </Button>
                    </div>
                    <div>
                        Email: {user?.email}
                        <Button variant="ghost" onClick={() =>
                            openModal({
                                label: "Email",
                                value: user.email,
                                endpoint: `/user`, // endpoint que você criou no backend
                                fieldName: "email"
                            })
                        }>
                            ✏️
                        </Button>
                    </div>

                    <div>
                        Telefones: {user?.phones?.length || 0}
                        {user?.phones?.map((phone: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                                {phone.number}
                                <Button variant="ghost" onClick={() =>
                                    openModal({
                                        label: "Telefone",
                                        value: phone.number,
                                        endpoint: `/phones/${phone.id}`,
                                        fieldName: "number"
                                    })
                                }>
                                    ✏️
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() =>
                                openModal({
                                    label: "Novo Telefone",
                                    value: "",
                                    endpoint: "/phones", // endpoint para criação
                                    fieldName: "number",
                                    method: "post", // 👈 adiciona isso!
                                })
                            }
                        >
                            + Novo telefone
                        </Button>
                    </div>

                    <div>
                        Endereços:
                        {user?.addresses?.map((address: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                                {`${address.street}, ${address.city}, ${address.state}`}
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setModalAddressData({
                                            method: "put",
                                            endpoint: `/addresses/${address.id}`,
                                            initialData: address,
                                        });
                                        setModalAddressOpen(true);
                                    }}
                                >
                                    ✏️
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() => {
                                setModalAddressData({
                                    method: "post",
                                    endpoint: "/addresses",
                                });
                                setModalAddressOpen(true);
                            }}
                        >
                            + Novo endereço
                        </Button>
                    </div>
                    <div>
                        E-mails alternativos:
                        {user?.emails?.map((emailAlt: any, index: number) => (
                            <div key={index}>
                                {emailAlt.email}
                                <Button variant="ghost" onClick={() =>
                                    openModal({
                                        label: "Email alternativo",
                                        value: emailAlt.email,
                                        endpoint: `/emails/${emailAlt.id}`,
                                        fieldName: "email"
                                    })
                                }>
                                    ✏️
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={() =>
                                openModal({
                                    label: "Novo e-mail alternativo",
                                    value: "",
                                    endpoint: "/emails",
                                    fieldName: "email",
                                    method: "post"
                                })
                            }
                        >
                            + Novo e-mail
                        </Button>
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
            <ModalEdit
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                {...modalData}
                onSuccess={() => window.location.reload()} // ou refetch dos dados
            />
            <ModalAddress
                open={modalAddressOpen}
                onClose={() => setModalAddressOpen(false)}
                {...modalAddressData}
                onSuccess={() => window.location.reload()}
            />
        </div>
    );
}

export default Perfil;