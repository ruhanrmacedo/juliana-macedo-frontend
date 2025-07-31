import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Metrics {
  peso: number;
  altura: number;
  idade: number;
  sexo: string;
  nivelAtividade: string;
  gorduraCorporal?: number;
}

interface MetricsFormData {
  peso: string;
  altura: string;
  idade: string;
  sexo: string;
  nivelAtividade: string;
  gorduraCorporal?: string;
}

const UserMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [formData, setFormData] = useState<MetricsFormData>({
    peso: "",
    altura: "",
    idade: "",
    sexo: "",
    nivelAtividade: "",
    gorduraCorporal: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("http://localhost:3000/metrics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setMetrics(data);
          setFormData({
            peso: String(data.peso),
            altura: String(data.altura),
            idade: String(data.idade),
            sexo: data.sexo,
            nivelAtividade: data.nivelAtividade,
            gorduraCorporal: data.gorduraCorporal ? String(data.gorduraCorporal) : "",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar métricas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      peso: parseFloat(formData.peso.replace(",", ".")),
      altura: parseFloat(formData.altura.replace(",", ".")),
      idade: parseInt(formData.idade),
      sexo: formData.sexo,
      nivelAtividade: formData.nivelAtividade,
      gorduraCorporal: formData.gorduraCorporal
        ? parseFloat(formData.gorduraCorporal.replace(",", "."))
        : undefined,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await api.post("http://localhost:3000/metrics", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMetrics(response.data);
      setEditing(false);
    } catch (error) {
      console.error("Erro ao salvar métricas", error);
    }
  };

  const startEdit = () => {
    setEditing(true);
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {metrics && !editing ? (
          <div className="space-y-2">
            <h2 className="text-xl font-bold mb-4">Suas métricas</h2>
            <p>Peso: {metrics.peso} kg</p>
            <p>Altura: {metrics.altura} m</p>
            <p>Idade: {metrics.idade} anos</p>
            <p>Sexo: {metrics.sexo === "M" ? "Masculino" : "Feminino"}</p>
            <p>Nível de Atividade: {metrics.nivelAtividade}</p>
            <p>Gordura Corporal: {metrics.gorduraCorporal ?? "Não informado"}%</p>
            <button onClick={startEdit} className="btn-primary mt-4 w-full">Editar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="peso" className="block text-sm font-medium mb-1">Peso (kg)</label>
              <input id="peso" name="peso" type="text" value={formData.peso} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="altura" className="block text-sm font-medium mb-1">Altura (m)</label>
              <input id="altura" name="altura" type="text" value={formData.altura} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="idade" className="block text-sm font-medium mb-1">Idade</label>
              <input id="idade" name="idade" type="text" value={formData.idade} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="sexo" className="block text-sm font-medium mb-1">Sexo</label>
              <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <label htmlFor="nivelAtividade" className="block text-sm font-medium mb-1">Nível de Atividade</label>
              <select id="nivelAtividade" name="nivelAtividade" value={formData.nivelAtividade} onChange={handleChange} className="w-full p-2 border rounded-md">
                <option value="">Selecione</option>
                <option value="Sedentário">Sedentário</option>
                <option value="Levemente Ativo">Levemente ativo</option>
                <option value="Moderadamente Ativo">Moderadamente ativo</option>
                <option value="Altamente Ativo">Altamente ativo</option>
                <option value="Atleta / Muito Ativo">Atleta / Muito Ativo</option>
              </select>
            </div>
            <div>
              <label htmlFor="gorduraCorporal" className="block text-sm font-medium mb-1">Gordura Corporal (%)</label>
              <input id="gorduraCorporal" name="gorduraCorporal" type="text" value={formData.gorduraCorporal ?? ""} onChange={handleChange} className="w-full p-2 border rounded-md" />
            </div>
            <button type="submit" className="btn-primary w-full">Salvar</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserMetrics;
