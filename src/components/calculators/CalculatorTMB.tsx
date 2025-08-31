import { useState } from "react";
import api from "@/lib/api";
import { Activity } from "lucide-react";
import ConfirmUpdate from "@/components/ConfirmUpdate";
import {
  normalizePesoKg,
  normalizeAlturaToMeters,
  normalizeIdade,
  Sexo,
} from "@/lib/metrics";
import { getErrorMessage } from "@/lib/errors";

type Props = { patientId?: number };
type TmbResult = { tmb: string; mensagem: string };

// mesma fórmula do backend (Harris-Benedict)
function calcularTMBLocal(pesoKg: number, alturaM: number, idade: number, sexo: Sexo) {
  if (sexo === "M") return 66 + 13.7 * pesoKg + 5 * (alturaM * 100) - 6.8 * idade;
  return 655 + 9.6 * pesoKg + 1.8 * (alturaM * 100) - 4.7 * idade;
}
function msgTMB(tmb: number) {
  return `Sua Taxa Metabólica Basal estimada é de ${tmb.toFixed(0)} kcal. Essa é a energia mínima necessária para manter funções vitais em repouso.`;
}

const NIVEL_ATIVIDADE_DEFAULT = "Sedentário";

export default function CalculatorTMB({ patientId }: Props) {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const isPatientMode = typeof patientId === "number";

  const [showForm, setShowForm] = useState(!isAuthenticated && !isPatientMode);
  const [showResult, setShowResult] = useState(false);

  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState(""); // m ou cm
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState<Sexo>("M");

  const [result, setResult] = useState<TmbResult | null>(null);
  const [askUpdate, setAskUpdate] = useState(false);

  const fetchForPatient = async () => {
    try {
      const { data } = await api.get("/metrics", { params: { userId: patientId } });
      const last = data?.[0];
      if (!last) throw new Error("Paciente sem métricas.");
      const tmbVal = calcularTMBLocal(last.peso, last.altura, last.idade, last.sexo);
      setResult({ tmb: tmbVal.toFixed(2), mensagem: msgTMB(tmbVal) });
      setShowResult(true);
      setShowForm(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const fetchForMe = async () => {
    try {
      const { data } = await api.get("/metrics/tmb");
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
      const idadeNum = normalizeIdade(idade);
      const tmb = calcularTMBLocal(pesoKg, alturaM, idadeNum, sexo);
      setResult({ tmb: tmb.toFixed(2), mensagem: msgTMB(tmb) });
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
        <Activity className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">
          Calculadora de TMB {isPatientMode ? "(paciente)" : ""}
        </h3>
      </div>

      {!showForm && !showResult && (
        <button onClick={handlePrimaryClick} className="btn-primary w-full">
          {isPatientMode ? "Ver TMB do paciente" : "Ver TMB"}
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
                type="number"
                step="any"
                inputMode="decimal"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Altura (m ou cm)</label>
              <input
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Ex.: 1,75 ou 175"
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
                type="number"
                inputMode="numeric"
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
            <button onClick={onCalcular} className="btn-primary flex-1">Calcular</button>
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
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">
            TMB estimada: <span className="text-primary">{result.tmb} kcal</span>
          </p>
          <p className="text-gray-700">{result.mensagem}</p>
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