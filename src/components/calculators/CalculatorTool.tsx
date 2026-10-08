import { useState } from "react";
import { Activity, Calculator, ChefHat, Droplets, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
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
type Props = { kind: CalculatorKind; patientId?: number };

type FormState = {
  peso: string;
  altura: string;
  idade: string;
  sexo: Sexo;
  nivel: NivelAtividadeFE;
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
  imc: { label: "IMC", icon: Calculator, needsHeight: true, needsAge: false, needsActivity: false },
  tmb: { label: "TMB", icon: Activity, needsHeight: true, needsAge: true, needsActivity: false },
  tdee: { label: "TDEE", icon: Flame, needsHeight: true, needsAge: true, needsActivity: true },
  macros: { label: "Macronutrientes", icon: ChefHat, needsHeight: true, needsAge: true, needsActivity: true },
  water: { label: "Água", icon: Droplets, needsHeight: false, needsAge: false, needsActivity: false },
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
      disclaimer: "Resultado educativo; não representa prescrição nutricional individual.",
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
        disclaimer: "Estimativa educativa; necessidades reais variam e pedem avaliação individualizada.",
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
    disclaimer: "Estimativa educativa. Clima, rotina e condições individuais podem alterar a necessidade.",
  };
}

export default function CalculatorTool({ kind, patientId }: Props) {
  const config = configs[kind];
  const Icon = config.icon;
  const navigate = useNavigate();
  const isPatientMode = typeof patientId === "number";
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<Result | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [usingStoredMetrics, setUsingStoredMetrics] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const useStoredMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const response = await api.get("/metrics", isPatientMode ? { params: { userId: patientId } } : undefined);
      const latest = response.data?.[0];
      if (!latest) throw new Error(isPatientMode ? "Paciente sem métricas." : "Você ainda não possui métricas salvas.");
      const next: FormState = {
        peso: String(latest.peso),
        altura: String(latest.altura),
        idade: String(latest.idade),
        sexo: latest.sexo as Sexo,
        nivel: nivelFromBackend[String(latest.nivelAtividade)] ?? "Moderadamente Ativo",
      };
      setForm(next);
      setUsingStoredMetrics(true);
      calculate(next);
    } catch (error: unknown) {
      toast({ variant: "destructive", title: "Métricas indisponíveis", description: getErrorMessage(error) });
    } finally {
      setLoadingMetrics(false);
    }
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
      toast({ title: "Métricas salvas", description: "O salvamento ocorreu somente após sua confirmação." });
    } catch (error: unknown) {
      toast({ variant: "destructive", title: "Não foi possível salvar", description: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">
          Calculadora de {config.label} {isPatientMode ? "(paciente)" : ""}
        </h3>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">
        Use dados temporários para uma estimativa educativa. Calcular não salva nenhuma informação.
      </p>

      {(isAuthenticated || isPatientMode) && (
        <button
          type="button"
          onClick={useStoredMetrics}
          disabled={loadingMetrics}
          className="mb-4 w-full border rounded-md p-2"
        >
          {loadingMetrics ? "Carregando..." : isPatientMode ? "Usar métricas do paciente" : "Usar minhas métricas"}
        </button>
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
          <p className="pt-2 text-xs text-muted-foreground">{result.disclaimer}</p>
          {(isAuthenticated || isPatientMode) && (
            <button type="button" onClick={saveMetrics} disabled={saving} className="mt-3 w-full border rounded-md p-2">
              {saving ? "Salvando..." : "Salvar estes dados"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
