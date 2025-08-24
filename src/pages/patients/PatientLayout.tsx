import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";

export default function PatientLayout() {
    const { id } = useParams();
    const nav = useNavigate();
    const [patient, setPatient] = useState<any>(null);

    useEffect(() => {
        (async () => {
            const { data } = await api.get(`/users/${id}`); // ajuste seu endpoint
            setPatient(data);
        })();
    }, [id]);

    const Item = ({ to, children }: { to: string; children: React.ReactNode }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${isActive ? "bg-emerald-600 text-white" : "text-neutral-800 hover:bg-neutral-200/60"
                }`
            }
        >
            {children}
        </NavLink>
    );

    return (
        <>
            <Navbar />
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pt-24 pb-10 md:grid-cols-[260px_1fr]">
                {/* Sidebar */}
                <aside className="h-fit rounded-2xl border bg-white p-3">
                    <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-300">👤</div>
                        <div className="min-w-0">
                            <div className="truncate font-medium">{patient?.name || "..."}</div>
                            <div className="truncate text-xs text-neutral-500">{patient?.cpf || "—"}</div>
                        </div>
                    </div>

                    <nav className="mt-3 space-y-1">
                        <Item to="profile">Perfil do Paciente</Item>
                        <Item to="anamneses">Anamneses geral</Item>
                        <Item to="metrics">Métricas Atuais</Item>
                        <Item to="anthropometry">Antropometria geral</Item>
                        <Item to="calculators">Cálculos</Item>
                        <Item to="gestational">Acompanhamento gestacional</Item>
                        <Item to="meal-plan">Planejamento Alimentar</Item>
                        <Item to="evolution-photos">Fotos de Evolução</Item>
                        <Item to="history-evolution">Histórico de Evolução</Item>
                        <Item to="finance">Financeiro</Item>
                    </nav>

                    <button
                        onClick={() => nav("/patients")}
                        className="mt-3 w-full rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
                    >
                        ← Voltar para pacientes
                    </button>
                </aside>

                {/* Conteúdo */}
                <main className="min-h-[60vh]">
                    <Outlet context={{ patient }} />
                </main>
            </div>
            <Footer />
        </>
    );
}
