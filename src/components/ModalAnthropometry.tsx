import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

import {
  AnthroEval,
  Sex,
  REQUIRED,
  METHODS,
  type MethodKey,
  suggestMethod,
  calcIMC,
} from "@/lib/anthro";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: number;
  initial?: Partial<AnthroEval>;
  onSaved?: (saved: AnthroEval) => void;
};

function pretty(site: keyof AnthroEval) {
  return String(site)
    .replace(/_mm$/, " (mm)")
    .replace(/_cm$/, " (cm)")
    .replace(/_/g, " ")
    .replace("muac", "MUAC")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ModalAnthropometry({
  open,
  onClose,
  userId,
  initial,
  onSaved,
}: Props) {
  const [form, setForm] = useState<AnthroEval>({
    userId,
    measuredAt: new Date().toISOString().slice(0, 10),
    sexo: initial?.sexo, // sem default para não mudar sem querer
    idade: initial?.idade,
    peso: initial?.peso,
    altura: initial?.altura,

    triceps_mm: initial?.triceps_mm,
    biceps_mm: initial?.biceps_mm,
    subescapular_mm: initial?.subescapular_mm,
    supra_iliaca_mm: initial?.supra_iliaca_mm,
    abdominal_mm: initial?.abdominal_mm,
    peitoral_torax_mm: initial?.peitoral_torax_mm,
    axilar_media_mm: initial?.axilar_media_mm,
    coxa_mm: initial?.coxa_mm,
    panturrilha_medial_mm: initial?.panturrilha_medial_mm,

    cintura_cm: initial?.cintura_cm,
    quadril_cm: initial?.quadril_cm,
    pescoco_cm: initial?.pescoco_cm,
    braco_muac_cm: initial?.braco_muac_cm,
    coxa_circ_cm: initial?.coxa_circ_cm,
    panturrilha_circ_cm: initial?.panturrilha_circ_cm,
  });

  const [backendIMC, setBackendIMC] = useState<string | undefined>(undefined);

  // método escolhido manualmente no modal
  const [method, setMethod] = useState<MethodKey | undefined>(undefined);

  // último campo alterado — usado para sugerir troca de método
  const [lastChangedKey, setLastChangedKey] = useState<keyof AnthroEval | null>(null);

  const prefill = useCallback(async () => {
    if (!open) return;

    // reaplica initial com segurança
    setForm((prev) => ({
      ...prev,
      userId,
      measuredAt: initial?.measuredAt ?? new Date().toISOString().slice(0, 10),
      sexo: (initial?.sexo as Sex) ?? prev.sexo,
      idade: initial?.idade ?? prev.idade,
      peso: initial?.peso ?? prev.peso,
      altura: initial?.altura ?? prev.altura,

      triceps_mm: initial?.triceps_mm ?? prev.triceps_mm,
      biceps_mm: initial?.biceps_mm ?? prev.biceps_mm,
      subescapular_mm: initial?.subescapular_mm ?? prev.subescapular_mm,
      supra_iliaca_mm: initial?.supra_iliaca_mm ?? prev.supra_iliaca_mm,
      abdominal_mm: initial?.abdominal_mm ?? prev.abdominal_mm,
      peitoral_torax_mm: initial?.peitoral_torax_mm ?? prev.peitoral_torax_mm,
      axilar_media_mm: initial?.axilar_media_mm ?? prev.axilar_media_mm,
      coxa_mm: initial?.coxa_mm ?? prev.coxa_mm,
      panturrilha_medial_mm: initial?.panturrilha_medial_mm ?? prev.panturrilha_medial_mm,

      cintura_cm: initial?.cintura_cm ?? prev.cintura_cm,
      quadril_cm: initial?.quadril_cm ?? prev.quadril_cm,
      pescoco_cm: initial?.pescoco_cm ?? prev.pescoco_cm,
      braco_muac_cm: initial?.braco_muac_cm ?? prev.braco_muac_cm,
      coxa_circ_cm: initial?.coxa_circ_cm ?? prev.coxa_circ_cm,
      panturrilha_circ_cm: initial?.panturrilha_circ_cm ?? prev.panturrilha_circ_cm,
    }));

    // última métrica do usuário (admin pode ?userId)
    try {
      const { data } = await api.get("/metrics", { params: { userId } });
      const last = Array.isArray(data) ? data[0] : undefined;
      if (last) {
        setForm((prev) => ({
          ...prev,
          sexo: (last.sexo as Sex) ?? prev.sexo,
          idade: last.idade ?? prev.idade,
          peso: last.peso ?? prev.peso,
          altura: last.altura ?? prev.altura,
        }));
      }
    } catch { /* ignore */ }

    // IMC do backend (me vs admin)
    try {
      const me = (await api.get("/auth/me")).data;
      if (me?.id === userId) {
        const { data } = await api.get("/metrics/imc");
        setBackendIMC(`${data.imc} (${data.classificacao})`);
      } else {
        const { data } = await api.get(`/metrics/users/${userId}/imc`);
        setBackendIMC(`${data.imc} (${data.classificacao})`);
      }
    } catch {
      setBackendIMC(undefined);
    }

    // ao abrir, “esquece” escolhas da sessão anterior
    setMethod(undefined);
    setLastChangedKey(null);
  }, [open, userId, initial]);

  useEffect(() => { prefill(); }, [prefill]);

  function set<K extends keyof AnthroEval>(k: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value as AnthroEval[K] }));
      setLastChangedKey(k);
    };
  }

  // ——— Derivados (IMC / sugestão / método ativo / sites / faltantes) ———
  const imcLocal = useMemo(() => calcIMC(form.peso, form.altura), [form.peso, form.altura]);
  const idadeNum = useMemo(() => Number(String(form.idade ?? "").replace(",", ".")), [form.idade]);

  const autoSuggestion = useMemo(() => suggestMethod(idadeNum, form.sexo), [idadeNum, form.sexo]);
  const activeMethod = method ?? autoSuggestion;

  const requiredSites = useMemo(() => {
    if (!activeMethod) return [];
    const def = REQUIRED[activeMethod];
    if (!def) return [];
    return typeof def.sites === "function" ? def.sites(form.sexo) : def.sites;
  }, [activeMethod, form.sexo]);

  const filledKeys = useMemo(() => {
    const ks = Object.keys(form) as (keyof AnthroEval)[];
    return new Set(
      ks.filter((k) => {
        const v = form[k];
        return v !== undefined && v !== null && String(v).trim() !== "";
      }),
    );
  }, [form]);

  const missing = useMemo(
    () => requiredSites.filter((k) => !filledKeys.has(k)),
    [requiredSites, filledKeys]
  );
  const filledCount = requiredSites.length - missing.length;
  const nextMissing = missing[0];

  // ranking dos métodos pelo preenchimento atual
  const methodScores = useMemo(() => {
    return METHODS.map((m) => {
      const def = REQUIRED[m];
      const sites = typeof def.sites === "function" ? def.sites(form.sexo) : def.sites;
      const total = sites.length;
      const ok = sites.filter((s) => filledKeys.has(s)).length;
      const score = total ? ok / total : 0; // WHO_* tem 0 sites
      return { m, total, ok, score, label: def.label, sites };
    }).sort((a, b) => (b.score - a.score) || (b.total - a.total));
  }, [filledKeys, form.sexo]);

  const fullyEligible = useMemo(
    () => methodScores.filter((x) => x.total > 0 && x.ok === x.total).map((x) => x.m),
    [methodScores]
  );

  const suggestedSwitch = useMemo(() => {
    const best = methodScores[0];
    if (!best) return undefined;
    if (!activeMethod) return best; // ainda não há método — sugira o melhor

    const curr = methodScores.find((x) => x.m === activeMethod);
    if (!curr) return best;

    const improves =
      best.score > curr.score || (best.score === curr.score && best.total > curr.total);

    // se o último campo pertence ao “best” e não ao atual, faz sentido sugerir
    const last = lastChangedKey;
    const lastBelongsToBest = last ? best.sites.includes(last) : false;
    const lastMissingInCurr = last ? !requiredSites.includes(last) : false;

    if (improves && (lastBelongsToBest || lastMissingInCurr)) return best;
    return undefined;
  }, [methodScores, activeMethod, requiredSites, lastChangedKey]);

  // autoaplica a sugestão quando ainda não há método escolhido manualmente
  useEffect(() => {
    if (!method && suggestedSwitch) setMethod(suggestedSwitch.m as MethodKey);
  }, [suggestedSwitch, method]);

  const save = async () => {
    const payload = { ...form, measuredAt: form.measuredAt };
    const saved = form.id
      ? (await api.patch(`/anthropometry/evaluations/${form.id}`, payload)).data
      : (await api.post(`/anthropometry/evaluations`, payload)).data;
    onSaved?.(saved);
    onClose();
  };

  const selectValue = (method ?? activeMethod) ?? "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* flex container p/ footer fixo e conteúdo rolável */}
      <DialogContent className="z-50 w-[96vw] sm:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{form.id ? "Editar coleta" : "Nova coleta"}</DialogTitle>
        </DialogHeader>

        {/* ÁREA ROLÁVEL */}
        <div className="flex-1 overflow-y-auto px-6 pb-24 overscroll-contain">
          {/* Barra informativa */}
          <div className="rounded-md border p-3 text-sm bg-neutral-50 mb-3 space-y-2 break-words">
            <div className="flex flex-wrap items-center gap-4">
              <span><strong>IMC:</strong> {backendIMC ?? (imcLocal ?? "—")}</span>
              <span>
                <strong>Método ativo:</strong>{" "}
                {activeMethod ? (REQUIRED[activeMethod]?.label ?? activeMethod) : "—"}
              </span>
              {requiredSites.length > 0 && (
                <span>
                  <strong>Medidas necessárias:</strong> {filledCount}/{requiredSites.length}
                </span>
              )}
            </div>

            {!!requiredSites.length && (
              <div className="flex flex-wrap gap-2">
                {requiredSites.map((s) => {
                  const ok = !missing.includes(s);
                  return (
                    <span
                      key={String(s)}
                      className={`px-2 py-1 rounded text-xs ${
                        ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pretty(s)}
                    </span>
                  );
                })}
              </div>
            )}

            {activeMethod && (
              <div className="text-xs text-neutral-600">
                {REQUIRED[activeMethod]?.label}.{" "}
                {requiredSites.length > 0
                  ? nextMissing
                    ? <>Próxima medida sugerida: <strong>{pretty(nextMissing)}</strong>.</>
                    : "Todas as medidas deste método já foram preenchidas."
                  : "Método baseado em peso/altura."}
              </div>
            )}
          </div>

          {/* Método + infos fixas */}
          <div className="mb-4 space-y-2">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="text-sm flex flex-col gap-1 min-w-0">
                Método
                <Select
                  value={selectValue}
                  onValueChange={(val) => setMethod(val as MethodKey)}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione um método" /></SelectTrigger>
                  <SelectContent className="z-50 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md">
                    {methodScores.map(({ m, label, ok, total }) => (
                      <SelectItem key={m} value={m}>
                        {label} {total ? `(${ok}/${total})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="text-sm flex flex-col gap-1 min-w-0">
                Sexo
                {/* somente leitura */}
                <Input
                  disabled
                  value={form.sexo === "F" ? "Feminino" : form.sexo === "M" ? "Masculino" : "—"}
                />
              </label>

              <label className="text-sm flex flex-col gap-1 min-w-0">
                Data
                <Input type="date" value={String(form.measuredAt)} onChange={set("measuredAt")} />
              </label>
            </div>

            {suggestedSwitch && suggestedSwitch.m !== activeMethod && (
              <div className="mt-2 text-xs bg-amber-50 border border-amber-200 p-2 rounded flex items-center justify-between gap-3">
                <span>
                  Sugestão: trocar para <strong>{suggestedSwitch.label}</strong>{" "}
                  ({suggestedSwitch.ok}/{suggestedSwitch.total})
                  {lastChangedKey ? <> com base em <em>{pretty(lastChangedKey)}</em>.</> : "."}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setMethod(suggestedSwitch.m as MethodKey)}
                >
                  Usar sugestão
                </Button>
              </div>
            )}

            {fullyEligible.length > 0 && (
              <div className="text-xs text-neutral-600">
                <span className="mr-2 font-medium">Métodos possíveis agora:</span>
                <span className="inline-flex flex-wrap gap-2 align-middle">
                  {fullyEligible.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700"
                    >
                      {REQUIRED[m]?.label ?? m}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* FORM principal (3 colunas em telas grandes) */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm flex flex-col gap-1 min-w-0">
              Idade
              <Input value={String(form.idade ?? "")} onChange={set("idade")} placeholder="anos" />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">
              Peso (kg)
              <Input value={String(form.peso ?? "")} onChange={set("peso")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">
              Altura (m)
              <Input value={String(form.altura ?? "")} onChange={set("altura")} />
            </label>

            {/* Dobras cutâneas */}
            <label className="text-sm flex flex-col gap-1 min-w-0">Tríceps (mm)
              <Input value={String(form.triceps_mm ?? "")} onChange={set("triceps_mm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Bíceps (mm)
              <Input value={String(form.biceps_mm ?? "")} onChange={set("biceps_mm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Subescapular (mm)
              <Input value={String(form.subescapular_mm ?? "")} onChange={set("subescapular_mm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Supra-ilíaca (mm)
              <Input value={String(form.supra_iliaca_mm ?? "")} onChange={set("supra_iliaca_mm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Abdominal (mm)
              <Input value={String(form.abdominal_mm ?? "")} onChange={set("abdominal_mm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Peitoral/Tórax (mm)
              <Input value={String(form.peitoral_torax_mm ?? "")} onChange={set("peitoral_torax_mm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Axilar Média (mm)
              <Input value={String(form.axilar_media_mm ?? "")} onChange={set("axilar_media_mm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Coxa (mm)
              <Input value={String(form.coxa_mm ?? "")} onChange={set("coxa_mm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Panturrilha Medial (mm)
              <Input value={String(form.panturrilha_medial_mm ?? "")} onChange={set("panturrilha_medial_mm")} />
            </label>

            {/* Circunferências */}
            <label className="text-sm flex flex-col gap-1 min-w-0">Cintura (cm)
              <Input value={String(form.cintura_cm ?? "")} onChange={set("cintura_cm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Quadril (cm)
              <Input value={String(form.quadril_cm ?? "")} onChange={set("quadril_cm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Pescoço (cm)
              <Input value={String(form.pescoco_cm ?? "")} onChange={set("pescoco_cm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Braço MUAC (cm)
              <Input value={String(form.braco_muac_cm ?? "")} onChange={set("braco_muac_cm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Coxa (circ.) (cm)
              <Input value={String(form.coxa_circ_cm ?? "")} onChange={set("coxa_circ_cm")} />
            </label>
            <label className="text-sm flex flex-col gap-1 min-w-0">Panturrilha (circ.) (cm)
              <Input value={String(form.panturrilha_circ_cm ?? "")} onChange={set("panturrilha_circ_cm")} />
            </label>
          </div>
        </div>

        {/* FOOTER (fixo fora do scroll) */}
        <DialogFooter className="border-t bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 sticky bottom-0">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={save}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}