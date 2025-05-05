import { useState } from "react";
import axios from "axios";
import { Activity } from "lucide-react";

const CalculatorTMB = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const [result, setResult] = useState<{ tmb: string; mensagem: string } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const fetchTMB = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/metrics/tmb", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(response.data);
      setShowResult(true);
    } catch (error: any) {
      alert("Erro ao calcular TMB: " + error.response?.data?.error || error.message);
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      fetchTMB();
    } else {
      alert("Você precisa estar logado para ver sua TMB.");
    }
  };

  const reset = () => {
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">Calculadora de TMB</h3>
      </div>

      {!showResult ? (
        <button onClick={handleClick} className="btn-primary w-full">
          Ver TMB
        </button>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">
            TMB estimada: <span className="text-primary">{result?.tmb} kcal</span>
          </p>
          <p className="text-gray-700">{result?.mensagem}</p>
          <button onClick={reset} className="btn-primary w-full">
            Usar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default CalculatorTMB;
