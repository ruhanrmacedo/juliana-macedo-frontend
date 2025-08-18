import { useState } from "react";
import api from "@/lib/api";
import { Droplets } from "lucide-react";
import ConfirmUpdate from "@/components/ConfirmUpdate";
import {
  normalizePesoKg,
  normalizeAlturaToMeters,
  normalizeIdade,
  Sexo,
  NivelAtividadeFE,
  nivelToBackendValue,
} from "@/lib/metrics";
import { getErrorMessage } from "@/lib/errors";

const NIVEL_OPTIONS: NivelAtividadeFE[] = [
  "Sedentário",
  "Levemente Ativo",
  "Moderadamente Ativo",
  "Altamente Ativo",
  "Atleta",
];

type WaterResult = {
  consumoDiarioAguaMl: string;
  consumoDiarioAguaLitros: string;
  mensagem: string;
};

function calcularAguaLocal(pesoKg: number): WaterResult {
  const ml = pesoKg * 45;
  return {
    consumoDiarioAguaMl: ml.toFixed(0),
    consumoDiarioAguaLitros: (ml / 1000).toFixed(2) + "L",
    mensagem: `Você deve consumir aproximadamente ${(ml / 1000).toFixed(
      2
    )} litros de água por dia com base no seu peso corporal.`,
  };
}

const CalculatorWater = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  // exibição
  const [showForm, setShowForm] = useState(!isAuthenticated);
  const [showResult, setShowResult] = useState(false);

  // form (peso obrigatório para cálculo; os demais só se quiser salvar a 1ª vez)
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState(""); // m ou cm (opcional p/salvar 1ª vez)
  const [idade, setIdade] = useState("");   // opcional p/salvar 1ª vez
  const [sexo, setSexo] = useState<Sexo>("M");
  const [nivel, setNivel] = useState<NivelAtividadeFE>("Sedentário");

  // resultado
  const [result, setResult] = useState<WaterResult | null>(null);

  // modal confirmar update
  const [askUpdate, setAskUpdate] = useState(false);

  // usa métricas salvas (backend)
  const fetchWaterIntake = async () => {
    try {
      const { data } = await api.get("/metrics/water");
      setResult(data);
      setShowResult(true);
      setShowForm(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  // estado inicial
  const handlePrimaryClick = () => {
    if (!isAuthenticated) {
      setShowForm(true);
      setShowResult(false);
      return;
    }
    fetchWaterIntake();
  };

  const onUsarNovamente = () => {
    setShowForm(true);
    setShowResult(false);
  };

  const onCalcular = () => {
    try {
      const p = normalizePesoKg(peso);
      const data = calcularAguaLocal(p);
      setResult(data);
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
        // se já tiver histórico, só o peso já atualiza;
        // se for o 1º cadastro, os campos abaixo evitam erro no backend:
        peso: normalizePesoKg(peso),
        altura: altura ? normalizeAlturaToMeters(altura) : undefined,
        idade: idade ? normalizeIdade(idade) : undefined,
        sexo,
        nivelAtividade: nivelToBackendValue[nivel],
        gorduraCorporal: null,
      });
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const reset = () => {
    setResult(null);
    setShowResult(false);
    setShowForm(!isAuthenticated);
    setPeso("");
    setAltura("");
    setIdade("");
    setSexo("M");
    setNivel("Sedentário");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Droplets className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">Calculadora de Água</h3>
      </div>

      {/* estado inicial */}
      {!showForm && !showResult && (
        <button onClick={handlePrimaryClick} className="btn-primary w-full">
          Ver Consumo Diário
        </button>
      )}

      {/* formulário */}
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCalcular();
          }}
          className="space-y-4"
        >
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
              required
            />
          </div>

          {/* seção opcional — só necessária para salvar o 1º registro */}
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 mb-2">
              (Opcional) Preencha estes campos se quiser salvar no histórico pela primeira vez:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Altura (m ou cm)</label>
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
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
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
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">
              Calcular
            </button>
            <button type="button" onClick={reset} className="flex-1 border rounded-md">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* resultado */}
      {showResult && !showForm && result && (
        <div className="text-center space-y-2">
          <p>
            Aproximadamente:{" "}
            <span className="text-primary font-semibold">{result.consumoDiarioAguaMl} ml</span>{" "}
            / <span className="text-primary font-semibold">{result.consumoDiarioAguaLitros}</span>
          </p>
          <p className="text-sm text-gray-600">{result.mensagem}</p>
          <div className="mt-4 flex gap-2">
            <button onClick={onUsarNovamente} className="btn-primary w-full">
              Usar novamente
            </button>
          </div>
        </div>
      )}

      {/* modal confirmar update */}
      <ConfirmUpdate
        open={askUpdate}
        onCancel={() => setAskUpdate(false)}
        onConfirm={onConfirmUpdate}
      />
    </div>
  );
};

export default CalculatorWater;