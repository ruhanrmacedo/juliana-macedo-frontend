import { useState } from "react";
import api from "@/lib/api";
import { Droplets } from "lucide-react";

const CalculatorWater = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const [result, setResult] = useState<{
    consumoDiarioAguaMl: string;
    consumoDiarioAguaLitros: string;
    mensagem: string;
  } | null>(null);
  const [showResult, setShowResult] = useState(false);

  const fetchWaterIntake = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("http://localhost:3000/metrics/water", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult(response.data);
      setShowResult(true);
    } catch (error: any) {
      alert("Erro ao calcular consumo de água: " + error.response?.data?.error || error.message);
    }
  };

  const handleClick = () => {
    if (isAuthenticated) {
      fetchWaterIntake();
    } else {
      alert("Você precisa estar logado para visualizar o consumo diário de água.");
    }
  };

  const reset = () => {
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <Droplets className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">Calculadora de Água</h3>
      </div>

      {!showResult ? (
        <button onClick={handleClick} className="btn-primary w-full">
          Ver Consumo Diário
        </button>
      ) : (
        <div className="text-center space-y-2">
          <p>
            Aproximadamente:{" "}
            <span className="text-primary font-semibold">{result?.consumoDiarioAguaMl} ml</span> /{" "}
            <span className="text-primary font-semibold">{result?.consumoDiarioAguaLitros}</span>
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

export default CalculatorWater;
