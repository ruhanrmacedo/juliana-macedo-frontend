import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { ModalEdit } from "@/components/ModalEdit";
import { ModalAddress } from "@/components/ModalAddress";
import { ModalEditMetrics } from "@/components/ModalEditMetrics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { UserMe, UserAddress, UserMetrics as TMetrics } from "@/lib/domain";
import { getErrorMessage } from "@/lib/errors";

type EditArgs = {
    label: string;
    value: string;
    endpoint: string;
    fieldName: string;
    method?: "put" | "patch" | "post";
};

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [metrics, setMetrics] = useState<TMetrics[] | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<EditArgs>({
        label: "",
        value: "",
        endpoint: "",
        fieldName: "",
        method: "put",
    });

    const [modalAddressOpen, setModalAddressOpen] = useState(false);
    const [modalAddressData, setModalAddressData] = useState<{
        method: "post" | "put";
        endpoint: string;
        initialData?: UserAddress;
    }>({
        method: "post",
        endpoint: "",
        initialData: undefined,
    });

    const [modalMetricsOpen, setModalMetricsOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const userRes = await api.get<UserMe>("/auth/me");
                setUser(userRes.data);

                const metricsRes = await api.get<TMetrics[]>("/metrics");
                setMetrics(metricsRes.data);
            } catch (err: unknown) {
                console.error(getErrorMessage(err));
            }
        }
        fetchData();
    }, []);

    function openModal(args: EditArgs) {
        setModalData(args);
        setModalOpen(true);
    }

    const lastMetric = metrics?.[0] ?? null;

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 pt-20 space-y-8">
                <Card>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <h2 className="text-xl font-bold">🧍 Dados do Usuário</h2>
                        </div>

                        <div>
                            <strong>Nome:</strong> {user?.name}
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    user &&
                                    openModal({
                                        label: "Nome",
                                        value: user.name,
                                        endpoint: `/user`,
                                        fieldName: "name",
                                    })
                                }
                            >
                                ✏️
                            </Button>
                        </div>

                        <div>
                            <strong>CPF:</strong> {user?.cpf}
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    user &&
                                    openModal({
                                        label: "CPF",
                                        value: user.cpf,
                                        endpoint: `/user`,
                                        fieldName: "cpf",
                                    })
                                }
                            >
                                ✏️
                            </Button>
                        </div>

                        <div>
                            <strong>Data de nascimento:</strong>{" "}
                            {user?.dataNascimento &&
                                new Date(user.dataNascimento).toLocaleDateString()}
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    user &&
                                    openModal({
                                        label: "Data de nascimento",
                                        value: user.dataNascimento,
                                        endpoint: `/user`,
                                        fieldName: "dataNascimento",
                                    })
                                }
                            >
                                ✏️
                            </Button>
                        </div>

                        <div>
                            <strong>Email:</strong> {user?.email}
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    user &&
                                    openModal({
                                        label: "Email",
                                        value: user.email,
                                        endpoint: `/user`,
                                        fieldName: "email",
                                    })
                                }
                            >
                                ✏️
                            </Button>
                        </div>

                        <div className="sm:col-span-2">
                            <strong>Telefones:</strong>
                            <div className="space-y-1 mt-1">
                                {user?.phones?.map((phone) => (
                                    <div
                                        key={phone.id}
                                        className="flex justify-between items-center border rounded p-2"
                                    >
                                        <span className="text-sm text-muted-foreground">
                                            {phone.number}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                openModal({
                                                    label: "Telefone",
                                                    value: phone.number,
                                                    endpoint: `/phones/${phone.id}`,
                                                    fieldName: "number",
                                                })
                                            }
                                        >
                                            ✏️
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-2">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        openModal({
                                            label: "Novo Telefone",
                                            value: "",
                                            endpoint: "/phones",
                                            fieldName: "number",
                                            method: "post",
                                        })
                                    }
                                >
                                    + Novo telefone
                                </Button>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <strong>Endereços:</strong>
                            <div className="space-y-1 mt-1">
                                {user?.addresses?.map((address) => (
                                    <div
                                        key={address.id}
                                        className="flex justify-between items-center border rounded p-2"
                                    >
                                        <span className="text-sm text-muted-foreground">
                                            {`${address.street}, ${address.city}, ${address.state}`}
                                        </span>
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
                            </div>
                            <div className="flex justify-center mt-2">
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
                        </div>

                        <div className="sm:col-span-2">
                            <strong>E-mails alternativos:</strong>
                            <div className="space-y-1 mt-1">
                                {user?.emails?.map((emailAlt) => (
                                    <div
                                        key={emailAlt.id}
                                        className="flex justify-between items-center border rounded p-2"
                                    >
                                        <span className="text-sm text-muted-foreground">
                                            {emailAlt.email}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                openModal({
                                                    label: "Email alternativo",
                                                    value: emailAlt.email,
                                                    endpoint: `/emails/${emailAlt.id}`,
                                                    fieldName: "email",
                                                })
                                            }
                                        >
                                            ✏️
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-2">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        openModal({
                                            label: "Novo e-mail alternativo",
                                            value: "",
                                            endpoint: "/emails",
                                            fieldName: "email",
                                            method: "post",
                                        })
                                    }
                                >
                                    + Novo e-mail
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {lastMetric && (
                    <Card>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">⚖️ Métricas Atuais</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                                <p>
                                    <strong>Peso:</strong> {lastMetric.peso} kg
                                </p>
                                <p>
                                    <strong>Altura:</strong> {lastMetric.altura} m
                                </p>
                                <p>
                                    <strong>Idade:</strong> {lastMetric.idade} anos
                                </p>
                                <p>
                                    <strong>Sexo:</strong>{" "}
                                    {lastMetric.sexo === "F" ? "Feminino" : "Masculino"}
                                </p>
                                <p>
                                    <strong>Nível de Atividade:</strong>{" "}
                                    {lastMetric.nivelAtividade}
                                </p>
                                <p>
                                    <strong>Gordura Corporal:</strong>{" "}
                                    {lastMetric.gorduraCorporal ?? "Não informado"}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <Button variant="outline" onClick={() => setModalMetricsOpen(true)}>
                                    ✏️ Editar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

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

                <ModalEdit
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    {...modalData}
                    onSuccess={() => window.location.reload()}
                />

                <ModalAddress
                    open={modalAddressOpen}
                    onClose={() => setModalAddressOpen(false)}
                    {...modalAddressData}
                    onSuccess={() => window.location.reload()}
                />

                {lastMetric && (
                    <ModalEditMetrics
                        open={modalMetricsOpen}
                        onClose={() => setModalMetricsOpen(false)}
                        initialData={lastMetric}
                        onSuccess={() => window.location.reload()}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default Perfil;