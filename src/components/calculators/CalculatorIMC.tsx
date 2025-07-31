
import { useState } from "react";
import { Calculator as CalculatorIcon } from "lucide-react";
import api from "@/lib/api";

const CalculatorIMC = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<{ imc: string; classificacao: string } | null>(null);
  const [showInputs, setShowInputs] = useState(true);

  const calculateIMC = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // cálculo no frontend
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      const feedback =
        bmi < 18.5
          ? "Abaixo do peso"
          : bmi < 24.9
            ? "Peso normal"
            : bmi < 29.9
              ? "Sobrepeso"
              : bmi < 34.9
                ? "Obesidade grau 1"
                : bmi < 39.9
                  ? "Obesidade grau 2"
                  : "Obesidade grau 3";

      setResult({ imc: bmi.toFixed(1), classificacao: feedback });
      setShowInputs(false);
    } else {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("http://localhost:3000/metrics/imc", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResult(response.data);
        setShowInputs(false);
      } catch (error: any) {
        alert("Erro ao calcular IMC: " + error.response?.data?.error || error.message);
      }
    }
  };

  const resetForm = () => {
    setShowInputs(true);
    setResult(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <CalculatorIcon className="text-primary" size={24} />
        <h3 className="font-heading font-bold text-xl">Calculadora de IMC</h3>
      </div>

      {showInputs ? (
        <form onSubmit={calculateIMC} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Altura (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Sua altura aqui"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Peso (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Seu peso aqui"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Calcular IMC
          </button>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-lg font-semibold">Seu IMC é: <span className="text-primary">{result?.imc}</span></p>
          <p className="text-gray-700 font-medium">{result?.classificacao}</p>
          <button onClick={resetForm} className="btn-primary w-full">
            Voltar
          </button>
        </div>
      )}
    </div>
  );
};

export default CalculatorIMC;

