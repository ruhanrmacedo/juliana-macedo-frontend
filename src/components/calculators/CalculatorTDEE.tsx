import { useState } from "react";
import api from "@/lib/api";
import { Flame } from "lucide-react";

const CalculatorTDEE = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const [result, setResult] = useState<{ tdee: string; mensagem: string } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const fetchTDEE = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("http://localhost:3000/metrics/tdee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(response.data);
      setShowResult(true);
    } catch (error: any) {
      alert("Erro ao calcular TDEE: " + error.response?.data?.error || error.message);
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      fetchTDEE();
    } else {
      alert("Você precisa estar logado para ver seu TDEE.");
    }
  };

  const reset = () => {
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Flame className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">Calculadora de TDEE</h3>
      </div>

      {!showResult ? (
        <button onClick={handleClick} className="btn-primary w-full">
          Ver TDEE
        </button>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">
            TDEE estimado: <span className="text-primary">{result?.tdee} kcal</span>
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

export default CalculatorTDEE;
