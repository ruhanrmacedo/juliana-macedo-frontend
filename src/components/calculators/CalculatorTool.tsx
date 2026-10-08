import { useState } from "react";
import { Activity, Calculator, ChefHat, Droplets, Flame } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getCalculatorUiState } from "@/lib/calculatorUx";
import { getErrorMessage } from "@/lib/errors";
import {
  calcularAguaMl,
  calcularIMC,
  calcularMacronutrientes,
  calcularTDEE,
  calcularTMB,
  classificarIMC,
  NivelAtividadeFE,
  nivelFromBackend,
  nivelToBackendValue,
  normalizeAlturaToMeters,
  normalizeIdade,
  normalizePesoKg,
  Sexo,
} from "@/lib/metrics";

export type CalculatorKind = "imc" | "tmb" | "tdee" | "macros" | "water";
export type CalculatorExpansionProps = {
  expanded?: boolean;
  onToggle?: () => void;
};

type Props = CalculatorExpansionProps & { kind: CalculatorKind; patientId?: number };

type FormState = {
  peso: string;
  altura: string;
  idade: string;
  sexo: Sexo;
  nivel: NivelAtividadeFE;
};

type StoredMetrics = {
  peso: number;
  altura: number;
  idade: number;
  sexo: Sexo;
  nivelAtividade: string;
};

type Result = { title: string; details: string[]; disclaimer: string };

const initialForm: FormState = {
  peso: "",
  altura: "",
  idade: "",
  sexo: "M",
  nivel: "Moderadamente Ativo",
};

const configs = {
  imc: { label: "IMC", viewLabel: "Ver IMC", icon: Calculator, needsHeight: true, needsAge: false, needsActivity: false },
  tmb: { label: "TMB", viewLabel: "Ver TMB", icon: Activity, needsHeight: true, needsAge: true, needsActivity: false },
  tdee: { label: "TDEE", viewLabel: "Ver TDEE", icon: Flame, needsHeight: true, needsAge: true, needsActivity: true },
  macros: { label: "Macronutrientes", viewLabel: "Ver Macronutrientes", icon: ChefHat, needsHeight: true, needsAge: true, needsActivity: true },
  water: { label: "Água", viewLabel: "Ver Água", icon: Droplets, needsHeight: false, needsAge: false, needsActivity: false },
} as const;

const activityOptions: NivelAtividadeFE[] = [
  "Sedentário",
  "Levemente Ativo",
  "Moderadamente Ativo",
  "Altamente Ativo",
  "Atleta",
];

function calculateEducationalResult(kind: CalculatorKind, form: FormState): Result {
  const pesoKg = normalizePesoKg(form.peso);
  const alturaM = configs[kind].needsHeight ? normalizeAlturaToMeters(form.altura) : 0;
  const idade = configs[kind].needsAge ? normalizeIdade(form.idade) : 0;

  if (kind === "imc") {
    const imc = calcularIMC(pesoKg, alturaM);
    return {
      title: `IMC estimado: ${imc.toFixed(2)}`,
      details: [classificarIMC(imc)],
      disclaimer: "O IMC é apenas um indicador populacional e não resume sua saúde ou composição corporal.",
    };
  }

  if (kind === "tmb") {
    const tmb = calcularTMB({ pesoKg, alturaCm: alturaM * 100, idade, sexo: form.sexo });
    return {
      title: `TMB estimada: ${tmb.toFixed(0)} kcal`,
      details: ["Estimativa da energia utilizada pelo organismo em repouso."],
      disclaimer: "Esta é uma estimativa educativa e não representa prescrição nutricional individual.",
    };
  }

  if (kind === "tdee" || kind === "macros") {
    const tdee = calcularTDEE({
      pesoKg,
      alturaCm: alturaM * 100,
      idade,
      sexo: form.sexo,
      nivel: form.nivel,
    });
    if (kind === "tdee") {
      return {
        title: `Gasto energético estimado: ${tdee.toFixed(0)} kcal/dia`,
        details: [`Fator de atividade utilizado: ${form.nivel}.`],
        disclaimer: "Esta é uma estimativa educativa; necessidades reais pedem avaliação individualizada.",
      };
    }
    const macros = calcularMacronutrientes(tdee);
    return {
      title: "Exemplo de distribuição de macronutrientes",
      details: [
        `Proteínas: ${macros.proteinas.toFixed(1)} g (30%)`,
        `Carboidratos: ${macros.carboidratos.toFixed(1)} g (50%)`,
        `Gorduras: ${macros.gorduras.toFixed(1)} g (20%)`,
      ],
      disclaimer: "Exemplo educativo 30/50/20. Não é uma prescrição nutricional individual.",
    };
  }

  const waterMl = calcularAguaMl(pesoKg);
  return {
    title: `Estimativa de água: ${(waterMl / 1000).toFixed(2)} L/dia`,
    details: [`Cálculo de compatibilidade atual: 45 ml por kg (${waterMl.toFixed(0)} ml).`],
    disclaimer: "Esta é uma estimativa educativa. A necessidade individual pode variar.",
  };
}

export default function CalculatorTool({
  kind,
  patientId,
  expanded = true,
  onToggle,
}: Props) {
  const config = configs[kind];
  const Icon = config.icon;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const isPatientMode = typeof patientId === "number";
  const contentId = `calculator-${kind}-${patientId ?? "public"}-content`;
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<Result | null>(null);
  const [usingStoredMetrics, setUsingStoredMetrics] = useState(false);
  const [saving, setSaving] = useState(false);

  const metricsQuery = useQuery({
    queryKey: ["calculator-metrics", isPatientMode ? patientId : "me"],
    enabled: isAuthenticated || isPatientMode,
    staleTime: 60_000,
    retry: false,
    queryFn: async () => {
      const response = await api.get<StoredMetrics[]>(
        "/metrics",
        isPatientMode ? { params: { userId: patientId } } : undefined,
      );
      return response.data?.[0] ?? null;
    },
  });

  const ui = getCalculatorUiState({
    isAuthenticated,
    isPatientMode,
    hasStoredMetrics: Boolean(metricsQuery.data),
    hasResult: Boolean(result),
  });

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const calculate = (nextForm = form) => {
    try {
      setResult(calculateEducationalResult(kind, nextForm));
    } catch (error: unknown) {
      toast({ variant: "destructive", title: "Confira os dados", description: getErrorMessage(error) });
    }
  };

  const useStoredMetrics = () => {
    const latest = metricsQuery.data;
    if (!latest) return;

    const next: FormState = {
      peso: String(latest.peso),
      altura: String(latest.altura),
      idade: String(latest.idade),
      sexo: latest.sexo,
      nivel: nivelFromBackend[String(latest.nivelAtividade)] ?? "Moderadamente Ativo",
    };
    setForm(next);
    setUsingStoredMetrics(true);
  };

  const saveMetrics = async () => {
    if (!isAuthenticated && !isPatientMode) return;

    const needsHiddenFields = kind === "imc" || kind === "tmb" || kind === "water";
    const incomplete =
      !form.peso ||
      !form.altura ||
      !form.idade ||
      !form.sexo ||
      !form.nivel ||
      (needsHiddenFields && !usingStoredMetrics);
    if (incomplete) {
      navigate("/metrics", {
        state: {
          prefill: {
            peso: form.peso,
            altura: form.altura,
            idade: form.idade,
            sexo: form.sexo,
            nivelAtividade: nivelToBackendValue[form.nivel],
          },
        },
      });
      toast({
        title: "Complete os dados para salvar",
        description: "O cálculo não foi salvo. Confirme os campos restantes em Minhas métricas.",
      });
      return;
    }

    try {
      setSaving(true);
      await api.post("/metrics", {
        ...(isPatientMode ? { userId: patientId } : {}),
        peso: normalizePesoKg(form.peso),
        altura: normalizeAlturaToMeters(form.altura),
        idade: normalizeIdade(form.idade),
        sexo: form.sexo,
        nivelAtividade: nivelToBackendValue[form.nivel],
        gorduraCorporal: null,
      });
      await queryClient.invalidateQueries({
        queryKey: ["calculator-metrics", isPatientMode ? patientId : "me"],
      });
      toast({ title: "Métricas salvas", description: "Os dados foram salvos após sua confirmação." });
    } catch (error: unknown) {
      toast({ variant: "destructive", title: "Não foi possível salvar", description: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <div className={`flex items-center justify-between gap-3 ${expanded ? "mb-5" : "mb-4"}`}>
        <div className="flex items-center space-x-2">
          <Icon className="text-primary" size={24} />
          <h3 className="font-heading font-bold text-xl">
            Calculadora de {config.label} {isPatientMode ? "(paciente)" : ""}
          </h3>
        </div>
        {expanded && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={true}
            aria-controls={contentId}
            className="shrink-0 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Recolher
          </button>
        )}
      </div>

      {!expanded && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={false}
          aria-controls={contentId}
          className="btn-primary w-full"
        >
          {config.viewLabel}
        </button>
      )}

      {expanded && (
        <div id={contentId}>
      {ui.showUseStoredMetrics && (
        <div className="mb-3 text-right">
          <button
            type="button"
            onClick={useStoredMetrics}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {isPatientMode ? "Usar métricas do paciente" : "Usar minhas métricas"}
          </button>
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          calculate();
        }}
        className="space-y-4"
      >
        <label className="block text-sm">Peso (kg)
          <input
            required
            type="number"
            step="any"
            value={form.peso}
            onChange={(event) => update("peso", event.target.value)}
            className="mt-1 w-full p-2 border rounded-md"
            placeholder="Ex.: 72,5"
          />
        </label>

        {config.needsHeight && (
          <label className="block text-sm">Altura (m ou cm)
            <input
              required
              type="number"
              step="any"
              value={form.altura}
              onChange={(event) => update("altura", event.target.value)}
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="Ex.: 1,75 ou 175"
            />
          </label>
        )}

        {config.needsAge && (
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">Idade
              <input
                required
                type="number"
                value={form.idade}
                onChange={(event) => update("idade", event.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
              />
            </label>
            <label className="block text-sm">Sexo
              <select
                value={form.sexo}
                onChange={(event) => update("sexo", event.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </label>
          </div>
        )}

        {config.needsActivity && (
          <label className="block text-sm">Nível de atividade
            <select
              value={form.nivel}
              onChange={(event) => update("nivel", event.target.value)}
              className="mt-1 w-full p-2 border rounded-md"
            >
              {activityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        )}

        <button type="submit" className="btn-primary w-full">Calcular</button>
      </form>

      {result && (
        <div className="mt-5 rounded-md border p-4 text-center space-y-2">
          <p className="font-semibold text-primary">{result.title}</p>
          {result.details.map((detail) => <p key={detail}>{detail}</p>)}
          {ui.showEducationalNotice && (
            <p className="pt-2 text-xs text-muted-foreground">{result.disclaimer}</p>
          )}
          {ui.showSave && (
            <button type="button" onClick={saveMetrics} disabled={saving} className="mt-3 w-full border rounded-md p-2">
              {saving ? "Salvando..." : "Salvar estes dados"}
            </button>
          )}
        </div>
      )}
        </div>
      )}
    </section>
  );
}
