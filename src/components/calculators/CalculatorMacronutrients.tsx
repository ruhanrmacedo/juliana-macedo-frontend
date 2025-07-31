import { useState } from "react";
import api from "@/lib/api";
import { ChefHat } from "lucide-react";

const CalculatorMacronutrients = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const [result, setResult] = useState<{
    proteinas: string;
    carboidratos: string;
    gorduras: string;
    mensagem: string;
  } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const fetchMacronutrients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("http://localhost:3000/metrics/macronutrients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(response.data);
      setShowResult(true);
    } catch (error: any) {
      alert("Erro ao calcular macronutrientes: " + error.response?.data?.error || error.message);
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      fetchMacronutrients();
    } else {
      alert("Você precisa estar logado para ver seus macronutrientes.");
    }
  };

  const reset = () => {
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <ChefHat className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">Calculadora de Macronutrientes</h3>
      </div>

      {!showResult ? (
        <button onClick={handleClick} className="btn-primary w-full">
          Ver Macronutrientes
        </button>
      ) : (
        <div className="text-center space-y-2">
          <p>
            Proteínas: <span className="text-primary font-semibold">{result?.proteinas}</span>
          </p>
          <p>
            Carboidratos: <span className="text-primary font-semibold">{result?.carboidratos}</span>
          </p>
          <p>
            Gorduras: <span className="text-primary font-semibold">{result?.gorduras}</span>
          </p>
          <p className="text-sm text-gray-600">{result?.mensagem}</p>
          <button onClick={reset} className="btn-primary w-full mt-4">
            Usar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default CalculatorMacronutrients;
