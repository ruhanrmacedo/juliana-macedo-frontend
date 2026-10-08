import { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

import ModalAnthropometry from "@/components/ModalAnthropometry";
import {
  AnthroEval,
  AnthroResult,
  METHODS,
  MethodKey,
  REQUIRED,
} from "@/lib/anthro";

type PatientCtx = { patient: { id: number; name: string } | null };

type Latest = {
  evaluation: (AnthroEval & { id: number; measuredAt: string });
  results: AnthroResult[];
} | null;

type EvalList = {
  items: (AnthroEval & { id: number; measuredAt: string })[];
  total: number;
  page: number;
  perPage: number;
};

export default function PatientAnthropometry() {
  const { patient } = useOutletContext<PatientCtx>();
  const [latest, setLatest] = useState<Latest>(null);
  const [open, setOpen] = useState(false);
  const [initialForModal, setInitialForModal] = useState<Partial<AnthroEval>>({});
  const [modalKey, setModalKey] = useState<string>("new");

  const [method, setMethod] = useState<MethodKey>("JACKSON_POLLOCK_3");
  const [computing, setComputing] = useState(false);

  // histórico
  const [history, setHistory] = useState<EvalList | null>(null);
  const [histLoading, setHistLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<number, AnthroResult[] | "loading" | undefined>>({});

  const evalId = latest?.evaluation?.id;

  const refetchLatest = useCallback(async () => {
    if (!patient?.id) return;
    try {
      const { data } = await api.get<Latest>(`/anthropometry/users/${patient.id}/latest`);
      setLatest(data);
    } catch (e) {
      console.error("Falha ao buscar última avaliação:", e);
      setLatest(null);
    }
  }, [patient?.id]);

  const refetchHistory = useCallback(async () => {
    if (!patient?.id) return;
    try {
      setHistLoading(true);
      const { data } = await api.get<EvalList>(`/anthropometry/users/${patient.id}/evaluations`, {
        params: { page: 1, perPage: 10 },
      });
      setHistory(data);
    } catch (e) {
      console.error("Falha ao buscar histórico:", e);
      setHistory(null);
    } finally {
      setHistLoading(false);
    }
  }, [patient?.id]);

  useEffect(() => { refetchLatest(); refetchHistory(); }, [refetchLatest, refetchHistory]);

  const pgAtual = useMemo(
    () => latest?.results?.find((r) => r.percentualGordura != null)?.percentualGordura,
    [latest]
  );

  const runAutopick = useCallback(async () => {
    if (!evalId) return;
    setComputing(true);
    try {
      await api.post(`/anthropometry/evaluations/${evalId}/compute`);
      await refetchLatest();
    } finally {
      setComputing(false);
    }
  }, [evalId, refetchLatest]);

  const runMethod = useCallback(async () => {
    if (!evalId) return;

    // evita duplicar cálculo do mesmo método na mesma coleta
    const already = latest?.results?.some((r) => r.method === method);
    if (already) return;

    setComputing(true);
    try {
      await api.post(`/anthropometry/evaluations/${evalId}/compute/${method}`);
      await refetchLatest();
    } finally {
      setComputing(false);
    }
  }, [evalId, method, refetchLatest, latest?.results]);

  // descrição e sites do método selecionado (considera sexo da avaliação)
  const selectedLabel = useMemo(() => REQUIRED[method]?.label ?? method, [method]);
  const selectedSites = useMemo(() => {
    const def = REQUIRED[method];
    if (!def) return [];
    const sexo = latest?.evaluation?.sexo as ("M" | "F") | undefined;
    return typeof def.sites === "function" ? def.sites(sexo) : def.sites;
  }, [method, latest?.evaluation?.sexo]);

  // abrir modal: NOVA
  const openNew = () => {
    setInitialForModal({});          // Modal vai prefetchar métricas e preencher sexo/idade/peso/altura
    setModalKey(`new-${Date.now()}`); // força remontagem
    setOpen(true);
  };

  // abrir modal: EDITAR
  const openEdit = () => {
    const init = (latest?.evaluation ?? {}) as Partial<AnthroEval>;
    setInitialForModal(init);
    setModalKey(`edit-${init.id || Date.now()}`);
    setOpen(true);
  };

  // carregar resultados sob demanda no histórico
  const toggleExpand = async (id: number) => {
    if (expanded[id] === "loading") return;
    if (expanded[id]) {
      setExpanded((s) => ({ ...s, [id]: undefined }));
      return;
    }
    setExpanded((s) => ({ ...s, [id]: "loading" }));
    try {
      const { data } = await api.get<{ evaluation: any; results: AnthroResult[] }>(`/anthropometry/evaluations/${id}`);
      setExpanded((s) => ({ ...s, [id]: data.results || [] }));
    } catch {
      setExpanded((s) => ({ ...s, [id]: [] }));
    }
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">📏 Antropometria geral</h2>
              <p className="text-sm text-neutral-600">Tabelas, dobras, perímetros, etc.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={openNew}>➕ Nova coleta</Button>
              <Button variant="outline" onClick={openEdit} disabled={!latest?.evaluation}>✏️ Editar coleta</Button>
              <Button
                variant="outline"
                disabled={!latest?.evaluation || computing}
                onClick={runAutopick}
                title={!latest?.evaluation ? "Crie uma coleta primeiro" : ""}
              >
                🧮 Calcular (autopick)
              </Button>
            </div>
          </div>

          {latest?.evaluation && (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <p><strong>Data:</strong> {new Date(latest.evaluation.measuredAt).toLocaleDateString()}</p>
              <p><strong>Sexo:</strong> {latest.evaluation.sexo}</p>
              <p><strong>Idade:</strong> {latest.evaluation.idade ?? "—"}</p>
              <p><strong>Peso:</strong> {latest.evaluation.peso ?? "—"} kg</p>
              <p><strong>Altura:</strong> {latest.evaluation.altura ?? "—"} m</p>
              <p><strong>% Gordura (últ.):</strong> {pgAtual ?? "—"}</p>
            </div>
          )}

          {/* Calcular por método específico */}
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={method}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setMethod(e.target.value as MethodKey)
                }
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {REQUIRED[m]?.label ?? m}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                disabled={!latest?.evaluation || computing || latest?.results?.some(r => r.method === method)}
                onClick={runMethod}
                title={latest?.results?.some(r => r.method === method) ? "Já calculado para esta coleta" : ""}
              >
                ▶️ Calcular por método
              </Button>
            </div>

            {/* descrição + chips do método selecionado */}
            <div className="text-xs text-neutral-600">
              <div className="font-medium">{selectedLabel}</div>
              {selectedSites.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedSites.map((s) => (
                    <span key={String(s)} className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                      {String(s).replace(/_mm$/, " (mm)").replace(/_cm$/, " (cm)").replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resultados (última avaliação) */}
          {latest?.results?.length ? (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Resultados</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left">Método</th>
                      <th>% Gordura</th>
                      <th>M. gorda (kg)</th>
                      <th>M. magra (kg)</th>
                      <th>Z</th>
                      <th>Percentil</th>
                      <th>Classificação</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latest.results.map((r) => (
                      <tr key={r.id} className="border-b">
                        <td className="text-left">{REQUIRED[r.method as MethodKey]?.label ?? r.method}</td>
                        <td>{r.percentualGordura ?? "—"}</td>
                        <td>{r.massaGordaKg ?? "—"}</td>
                        <td>{r.massaMagraKg ?? "—"}</td>
                        <td>{r.zScore ?? "—"}</td>
                        <td>{r.percentil ?? "—"}</td>
                        <td>{r.classificacao ?? "—"}</td>
                        <td>{new Date(r.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-neutral-600">Nenhum resultado ainda para esta coleta.</p>
          )}
        </CardContent>
      </Card>

      {/* HISTÓRICO */}
      <Card className="mt-6">
        <CardContent>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">🗂️ Histórico de coletas</h2>
            <Button variant="outline" onClick={refetchHistory} disabled={histLoading}>
              Atualizar
            </Button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th>Data</th>
                  <th>Sexo</th>
                  <th>Idade</th>
                  <th>Peso (kg)</th>
                  <th>Altura (m)</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {history?.items?.map((e) => (
                  <tr key={e.id} className="border-b align-top">
                    <td>{new Date(e.measuredAt).toLocaleDateString()}</td>
                    <td>{e.sexo ?? "—"}</td>
                    <td>{e.idade ?? "—"}</td>
                    <td>{e.peso ?? "—"}</td>
                    <td>{e.altura ?? "—"}</td>
                    <td className="text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setInitialForModal(e);
                            setModalKey(`edit-${e.id}`);
                            setOpen(true);
                          }}
                        >
                          ✏️ Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleExpand(e.id!)}
                        >
                          {expanded[e.id!] ? "Ocultar" : "Ver resultados"}
                        </Button>
                      </div>
                      {/* sublinha expandida com os resultados */}
                      {expanded[e.id!] && expanded[e.id!] !== "loading" && (
                        <div className="mt-3">
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left">Método</th>
                                  <th>% Gordura</th>
                                  <th>M. gorda</th>
                                  <th>M. magra</th>
                                  <th>Z</th>
                                  <th>Percentil</th>
                                  <th>Classificação</th>
                                  <th>Gerado em</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(expanded[e.id!] as AnthroResult[]).map((r) => (
                                  <tr key={r.id} className="border-b">
                                    <td className="text-left">
                                      {REQUIRED[r.method as MethodKey]?.label ?? r.method}
                                    </td>
                                    <td>{r.percentualGordura ?? "—"}</td>
                                    <td>{r.massaGordaKg ?? "—"}</td>
                                    <td>{r.massaMagraKg ?? "—"}</td>
                                    <td>{r.zScore ?? "—"}</td>
                                    <td>{r.percentil ?? "—"}</td>
                                    <td>{r.classificacao ?? "—"}</td>
                                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      {expanded[e.id!] === "loading" && (
                        <div className="text-xs text-neutral-500 mt-2">Carregando…</div>
                      )}
                    </td>
                  </tr>
                ))}
                {!history?.items?.length && (
                  <tr><td colSpan={6} className="py-6 text-center text-neutral-500">Sem coletas anteriores.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ModalAnthropometry
        key={modalKey}
        open={open}
        onClose={() => setOpen(false)}
        userId={patient!.id}
        initial={initialForModal}
        onSaved={async () => {
          await refetchLatest();
          await refetchHistory();
        }}
      />
    </>
  );
}