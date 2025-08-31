/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import api from "@/lib/api";
import { Flame } from "lucide-react";
import ConfirmUpdate from "@/components/ConfirmUpdate";
import {
  calcularTDEE,
  msgTDEE,
  NivelAtividadeFE,
  Sexo,
  nivelToBackendValue,
  parseNumberBR,
} from "@/lib/metrics";
import { getErrorMessage } from "@/lib/errors";

type Props = { patientId?: number };

// mapeia valor vindo do backend → rótulo do FE (sem any)
const backendNivelToFE: Record<string, NivelAtividadeFE> = {
  "Sedentário": "Sedentário",
  "Levemente Ativo": "Levemente Ativo",
  "Moderadamente Ativo": "Moderadamente Ativo",
  "Altamente Ativo": "Altamente Ativo",
  "Atleta": "Atleta",
};

const NIVEL_OPTIONS: NivelAtividadeFE[] = [
  "Sedentário",
  "Levemente Ativo",
  "Moderadamente Ativo",
  "Altamente Ativo",
  "Atleta",
];

export default function CalculatorTDEE({ patientId }: Props) {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const [showForm, setShowForm] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState(""); // cm (ou metros; converto)
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState<Sexo>("M");
  const [nivel, setNivel] = useState<NivelAtividadeFE>("Moderadamente Ativo");

  const [tdee, setTdee] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");

  const [askUpdate, setAskUpdate] = useState(false);

  const fetchPatientLatest = async () => {
    try {
      const { data } = await api.get("/metrics", { params: { userId: patientId } });
      const last = (data as Array<any>)[0];
      if (!last) throw new Error("Paciente sem métricas.");

      const tdeeVal = calcularTDEE({
        pesoKg: Number(last.peso),
        alturaCm: Number(last.altura) * 100,
        idade: Number(last.idade),
        sexo: last.sexo as Sexo,
        nivel: backendNivelToFE[String(last.nivelAtividade)] ?? "Moderadamente Ativo",
      });
      setTdee(tdeeVal.toFixed(2));
      setMensagem(`Seu gasto calórico diário estimado é de ${tdeeVal.toFixed(0)} kcal. Use esse valor como base para metas.`);
      setShowResult(true);
      setShowForm(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const fetchMine = async () => {
    try {
      const res = await api.get("/metrics/tdee");
      setTdee(String(res.data.tdee));
      setMensagem(String(res.data.mensagem));
      setShowResult(true);
      setShowForm(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePrimaryClick = () => {
    if (patientId) return fetchPatientLatest();
    if (!isAuthenticated) {
      setShowForm(true);
      setShowResult(false);
      return;
    }
    fetchMine();
  };

  const onUsarNovamente = () => {
    setShowForm(true);
    setShowResult(false);
  };

  const onCalcular = () => {
    const p = parseNumberBR(peso);
    const a = parseNumberBR(altura);
    const i = parseInt(idade || "0", 10);

    if (!p || !a || !i) {
      alert("Preencha peso, altura e idade corretamente.");
      return;
    }

    const alturaCm = a < 3 ? a * 100 : a;
    const tdeeVal = calcularTDEE({ pesoKg: p, alturaCm, idade: i, sexo, nivel });

    setTdee(tdeeVal.toFixed(2));
    setMensagem(msgTDEE(tdeeVal));
    setShowResult(true);
    setShowForm(false);

    if (isAuthenticated) setAskUpdate(true);
  };

  const onConfirmUpdate = async () => {
    setAskUpdate(false);
    try {
      await api.post("/metrics", {
        userId: patientId,
        peso: parseNumberBR(peso),
        altura: parseNumberBR(altura),
        idade: parseInt(idade, 10),
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
        <Flame className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">Calculadora de TDEE</h3>
      </div>

      {!showForm && !showResult && (
        <button onClick={handlePrimaryClick} className="btn-primary w-full">
          Ver TDEE
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
              <label className="block text-sm mb-1">Altura (cm ou m)</label>
              <input
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Ex.: 175"
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

      {showResult && !showForm && (
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">
            TDEE estimado: <span className="text-primary">{tdee} kcal</span>
          </p>
          <p className="text-gray-700">{mensagem}</p>
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
