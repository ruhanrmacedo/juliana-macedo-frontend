// src/components/CalculatorTDEE.tsx
import { useState } from "react";
import api from "@/lib/api";
import { Flame } from "lucide-react";
import ConfirmUpdate from "@/components/ConfirmUpdate";
import {
  calcularTDEE,
  msgTDEE,
  parseNumberBR,
  nivelToBackendValue,
  NivelAtividadeFE,
  Sexo,
} from "@/lib/metrics";
import { getErrorMessage } from "@/lib/errors";

// ✅ use os labels padronizados da metrics.ts
const NIVEL_OPTIONS: NivelAtividadeFE[] = [
  "Sedentário",
  "Levemente Ativo",
  "Moderadamente Ativo",
  "Altamente Ativo",
  "Atleta",
];

const CalculatorTDEE = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  // estados de exibição
  const [showForm, setShowForm] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // form
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState(""); // cm
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState<Sexo>("M");
  const [nivel, setNivel] = useState<NivelAtividadeFE>("Moderadamente Ativo");

  // resultado
  const [tdee, setTdee] = useState<string>("");
  const [mensagem, setMensagem] = useState<string>("");

  // modal
  const [askUpdate, setAskUpdate] = useState(false);

  const fetchTDEEFromBackend = async () => {
    try {
      const { data } = await api.get("/metrics/tdee"); // <- endpoint correto
      setTdee(data.tdee);
      setMensagem(data.mensagem);
      setShowResult(true);
      setShowForm(false);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handlePrimaryClick = () => {
    // comportamento padrão atual: se logado e NÃO quer editar, puxar do backend
    if (!isAuthenticated) {
      // usuário não logado não tem métricas salvas -> abrir formulário
      setShowForm(true);
      setShowResult(false);
      return;
    }
    // logado: decide se quer usar métricas atuais (backend) ou inserir novas
    // aqui vamos abrir o formulário quando clicar "Usar novamente"
    fetchTDEEFromBackend();
  };

  const onUsarNovamente = () => {
    // exibe form pra TODOS (logado e não logado)
    setShowForm(true);
    setShowResult(false);
  };

  const onCalcular = () => {
    // calcula local, mostra modal para salvar (se logado)
    const p = parseNumberBR(peso);
    const a = parseNumberBR(altura);
    const i = parseInt(idade || "0", 10);

    if (!p || !a || !i) {
      alert("Preencha peso, altura e idade corretamente.");
      return;
    }

    const tdeeValor = calcularTDEE({
      pesoKg: p,
      alturaCm: a < 3 ? a * 100 : a, // se usuário digitar em metros
      idade: i,
      sexo,
      nivel,
    });

    setTdee(tdeeValor.toFixed(2));
    setMensagem(msgTDEE(tdeeValor));
    setShowResult(true);
    setShowForm(false);

    if (isAuthenticated) setAskUpdate(true);
  };

  const onConfirmUpdate = async () => {
    setAskUpdate(false);
    try {
      await api.post("/metrics", {
        peso: parseNumberBR(peso),
        altura: parseNumberBR(altura),
        idade: parseInt(idade, 10),
        sexo,
        nivelAtividade: nivelToBackendValue[nivel],
        gorduraCorporal: null,
      }); // <- sem headers; interceptor cuida do Bearer
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

      {/* estado inicial */}
      {!showForm && !showResult && (
        <button onClick={handlePrimaryClick} className="btn-primary w-full">
          Ver TDEE
        </button>
      )}

      {/* formulário */}
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
              <label className="block text-sm mb-1">Altura (cm)</label>
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

      {/* resultado */}
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

      {/* modal confirmar update */}
      <ConfirmUpdate
        open={askUpdate}
        onCancel={() => setAskUpdate(false)}
        onConfirm={onConfirmUpdate}
      />
    </div>
  );
};

export default CalculatorTDEE;
