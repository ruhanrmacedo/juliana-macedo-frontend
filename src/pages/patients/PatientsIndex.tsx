import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";

type Patient = {
    id: number;
    name: string;
    email: string;
    role: string;
    cpf: string;
    dataNascimento: string;
    updatedAt?: string;
    // avatarUrl?: string; Implementar depois
};

export default function PatientsIndex() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [q, setQ] = useState("");
    const [error, setError] = useState<string | null>(null);
    const nav = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/users", { params: { role: "user" } });
                setPatients(data.items ?? data);
            } catch (err: any) {
                // Mostra motivo (404/403) em vez de “sumir”
                setError(err?.response?.data?.error || `${err?.response?.status || ""} ${err?.message}`);
                setPatients([]);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return patients;
        return patients.filter((p) =>
            [p.name, p.cpf, p.email].some((v) => (v || "").toLowerCase().includes(term))
        );
    }, [patients, q]);

    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-5xl px-4 pt-24 pb-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Seus pacientes</h1>

                    {/* agora navega para /register */}
                    <button
                        onClick={() => nav("/register")}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                    >
                        adicionar paciente
                    </button>
                </div>

                <div className="mb-4">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="Busque pelo nome, CPF, telefone ou tag do paciente"
                    />
                </div>

                <div className="space-y-2">
                    {filtered.map((p) => (
                        <Link
                            to={`/patients/${p.id}/profile`}
                            key={p.id}
                            className="flex items-center gap-3 rounded-xl bg-neutral-900/5 p-4 hover:bg-neutral-900/10"
                        >
                            <div className="min-w-0">
                                <div className="truncate font-medium">{p.name}</div>
                                <div className="truncate text-xs text-neutral-500">
                                    Modificado em {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "—"}
                                </div>
                            </div>
                        </Link>
                    ))}
                    {filtered.length === 0 && (
                        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-neutral-500">
                            Nenhum paciente encontrado.
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}