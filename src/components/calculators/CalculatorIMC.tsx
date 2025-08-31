import { useState } from "react";
import { Calculator as CalculatorIcon } from "lucide-react";
import api from "@/lib/api";
import ConfirmUpdate from "@/components/ConfirmUpdate";
import {
  normalizePesoKg,
  normalizeAlturaToMeters,
  normalizeIdade,
  Sexo,
} from "@/lib/metrics";
import { getErrorMessage } from "@/lib/errors";

type Props = { patientId?: number };
type ImcResult = { imc: string; classificacao: string };

function classificarIMC(imc: number): string {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 24.9) return "Peso normal";
  if (imc < 29.9) return "Sobrepeso";
  if (imc < 34.9) return "Obesidade grau 1";
  if (imc < 39.9) return "Obesidade grau 2";
  return "Obesidade grau 3";
}

const NIVEL_ATIVIDADE_DEFAULT = "Sedentário";

export default function CalculatorIMC({ patientId }: Props) {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const isPatientMode = typeof patientId === "number";

  // exibição
  const [showForm, setShowForm] = useState(!isAuthenticated && !isPatientMode);
  const [showResult, setShowResult] = useState(false);

  // form
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState<Sexo>("M");

  // resultado
  const [result, setResult] = useState<ImcResult | null>(null);

  // modal confirmar update
  const [askUpdate, setAskUpdate] = useState(false);

  const fetchForPatient = async () => {
    try {
      // pega última métrica do paciente (admin)
      const { data } = await api.get("/metrics", { params: { userId: patientId } });
      const last = data?.[0];
      if (!last) throw new Error("Paciente sem métricas.");
      const imc = Number(last.peso) / (Number(last.altura) * Number(last.altura));
      setResult({ imc: imc.toFixed(2), classificacao: classificarIMC(imc) });
      setShowResult(true);
      setShowForm(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const fetchForMe = async () => {
    try {
      const { data } = await api.get("/metrics/imc");
      setResult(data);
      setShowResult(true);
      setShowForm(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePrimaryClick = () => {
    if (isPatientMode) return fetchForPatient();
    if (!isAuthenticated) {
      setShowForm(true);
      setShowResult(false);
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
      const imc = pesoKg / (alturaM * alturaM);
      setResult({ imc: imc.toFixed(2), classificacao: classificarIMC(imc) });
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
        peso: normalizePesoKg(peso),
        altura: normalizeAlturaToMeters(altura),
        idade: normalizeIdade(idade),
        sexo,
        nivelAtividade: NIVEL_ATIVIDADE_DEFAULT,
        gorduraCorporal: null,
        ...(isPatientMode ? { userId: patientId } : {}),
      });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <CalculatorIcon className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">
          Calculadora de IMC {isPatientMode ? "(paciente)" : ""}
        </h3>
      </div>

      {!showForm && !showResult && (
        <button onClick={handlePrimaryClick} className="btn-primary w-full">
          {isPatientMode ? "Ver IMC do paciente" : "Ver IMC"}
        </button>
      )}

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCalcular();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Altura (m ou cm)</label>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Ex.: 1,75 ou 175"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Peso (kg)</label>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Ex.: 72,5"
              />
            </div>
          </div>

          {/* Campos apenas para salvar 1ª vez */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Idade (anos)</label>
              <input
                type="number"
                inputMode="numeric"
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

          <div className="flex gap-2">
            <button type="submit" className="btn-primary w-full">Calcular IMC</button>
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
        </form>
      )}

      {showResult && !showForm && result && (
        <div className="space-y-4 text-center">
          <p className="text-lg font-semibold">
            IMC: <span className="text-primary">{result.imc}</span>
          </p>
          <p className="text-gray-700 font-medium">{result.classificacao}</p>
          <button onClick={onUsarNovamente} className="btn-primary w-full">
            Usar novamente
          </button>
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