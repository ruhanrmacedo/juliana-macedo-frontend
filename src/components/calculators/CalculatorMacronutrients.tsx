/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import api from "@/lib/api";
import { ChefHat } from "lucide-react";
import ConfirmUpdate from "@/components/ConfirmUpdate";
import {
  calcularTDEE,
  NivelAtividadeFE,
  Sexo,
  nivelToBackendValue,
  normalizeAlturaToMeters,
  normalizeIdade,
  normalizePesoKg,
} from "@/lib/metrics";
import { getErrorMessage } from "@/lib/errors";

type Props = { patientId?: number };

type MacrosResult = {
  proteinas: string;
  carboidratos: string;
  gorduras: string;
  mensagem: string;
};

const NIVEL_OPTIONS: NivelAtividadeFE[] = [
  "Sedentário",
  "Levemente Ativo",
  "Moderadamente Ativo",
  "Altamente Ativo",
  "Atleta",
];

const backendNivelToFE: Record<string, NivelAtividadeFE> = {
  "Sedentário": "Sedentário",
  "Levemente Ativo": "Levemente Ativo",
  "Moderadamente Ativo": "Moderadamente Ativo",
  "Altamente Ativo": "Altamente Ativo",
  "Atleta": "Atleta",
};

function calcularMacrosLocal(tdee: number): MacrosResult {
  const proteinasG = (tdee * 0.3) / 4; // 30%
  const carboG = (tdee * 0.5) / 4;     // 50%
  const gordurasG = (tdee * 0.2) / 9;  // 20%
  return {
    proteinas: `${proteinasG.toFixed(1)}g`,
    carboidratos: `${carboG.toFixed(1)}g`,
    gorduras: `${gordurasG.toFixed(1)}g`,
    mensagem:
      "Distribuição sugerida com base em 30% proteínas, 50% carboidratos e 20% gorduras.",
  };
}

export default function CalculatorMacronutrients({ patientId }: Props) {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const [showForm, setShowForm] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState<Sexo>("M");
  const [nivel, setNivel] = useState<NivelAtividadeFE>("Moderadamente Ativo");

  const [result, setResult] = useState<MacrosResult | null>(null);
  const [askUpdate, setAskUpdate] = useState(false);

  const fetchForPatient = async () => {
    try {
      const { data } = await api.get("/metrics", { params: { userId: patientId } });
      const last = (data as Array<any>)[0];
      if (!last) throw new Error("Paciente sem métricas.");

      const tdee = calcularTDEE({
        pesoKg: Number(last.peso),
        alturaCm: Number(last.altura) * 100,
        idade: Number(last.idade),
        sexo: last.sexo as Sexo,
        nivel: backendNivelToFE[String(last.nivelAtividade)] ?? "Moderadamente Ativo",
      });
      const macros = calcularMacrosLocal(tdee);
      setResult(macros);
      setShowResult(true);
      setShowForm(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const fetchForMe = async () => {
    try {
      const res = await api.get("/metrics/macronutrients");
      setResult(res.data as MacrosResult);
      setShowResult(true);
      setShowForm(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePrimaryClick = () => {
    if (patientId) return fetchForPatient();
    if (!isAuthenticated) {
      alert("Você precisa estar logado para ver seus macronutrientes.");
      return;
    }
    fetchForMe();
  };

  const onUsarNovamente = () => {
    setShowForm(true);
    setShowResult(false);
  };

  const onCalcular = () => {
    try {
      const pesoKg = normalizePesoKg(peso);
      const alturaM = normalizeAlturaToMeters(altura);
      const idadeNum = normalizeIdade(idade);
      const tdee = calcularTDEE({
        pesoKg,
        alturaCm: alturaM * 100,
        idade: idadeNum,
        sexo,
        nivel,
      });

      const macros = calcularMacrosLocal(tdee);
      setResult(macros);
      setShowResult(true);
      setShowForm(false);

      if (isAuthenticated) setAskUpdate(true);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const onConfirmUpdate = async () => {
    setAskUpdate(false);
    try {
      await api.post("/metrics", {
        userId: patientId,
        peso: normalizePesoKg(peso),
        altura: normalizeAlturaToMeters(altura),
        idade: normalizeIdade(idade),
        sexo,
        nivelAtividade: nivelToBackendValue[nivel],
        gorduraCorporal: null,
      });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <ChefHat className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">Calculadora de Macronutrientes</h3>
      </div>

      {!showForm && !showResult && (
        <button onClick={handlePrimaryClick} className="btn-primary w-full">
          Ver Macronutrientes
        </button>
      )}

      {showForm && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Peso (kg)</label>
              <input
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Ex.: 72,5"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Altura (m ou cm)</label>
              <input
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="1,75 ou 175"
                type="number"
                step="any"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Idade (anos)</label>
              <input
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Ex.: 34"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Sexo</label>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value as Sexo)}
                className="w-full p-2 border rounded-md"
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Nível de atividade</label>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value as NivelAtividadeFE)}
              className="w-full p-2 border rounded-md"
            >
              {NIVEL_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={onCalcular} className="btn-primary flex-1">
              Calcular
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setShowResult(false);
              }}
              className="flex-1 border rounded-md"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showResult && !showForm && result && (
        <div className="text-center space-y-2">
          <p>
            Proteínas: <span className="text-primary font-semibold">{result.proteinas}</span>
          </p>
          <p>
            Carboidratos: <span className="text-primary font-semibold">{result.carboidratos}</span>
          </p>
          <p>
            Gorduras: <span className="text-primary font-semibold">{result.gorduras}</span>
          </p>
          <p className="text-sm text-gray-600">{result.mensagem}</p>
          <div className="mt-4 flex gap-2">
            <button onClick={onUsarNovamente} className="btn-primary w-full">
              Usar novamente
            </button>
          </div>
        </div>
      )}

      <ConfirmUpdate
        open={askUpdate}
        onCancel={() => setAskUpdate(false)}
        onConfirm={onConfirmUpdate}
      />
    </div>
  );
}