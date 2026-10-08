import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import {
  normalizeAlturaToMeters,
  normalizePesoKg,
  normalizeIdade,
  normalizeGordura,
} from "@/lib/metrics";
import { getErrorMessage } from "@/lib/errors";

interface Metrics {
  id?: number;
  peso: number;
  altura: number;
  idade: number;
  sexo: string;
  nivelAtividade: string;
  gorduraCorporal?: number | null;
}

interface MetricsFormData {
  peso: string;
  altura: string;
  idade: string;
  sexo: string;
  nivelAtividade: string;
  gorduraCorporal: string;
}

const emptyForm: MetricsFormData = {
  peso: "",
  altura: "",
  idade: "",
  sexo: "",
  nivelAtividade: "",
  gorduraCorporal: "",
};

const UserMetrics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [formData, setFormData] = useState<MetricsFormData>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get<Metrics[]>("/metrics");
        const latest = response.data?.[0];
        const prefill = (location.state as { prefill?: Partial<MetricsFormData> } | null)?.prefill;
        if (latest) {
          setMetrics(latest);
          setFormData({
            peso: prefill?.peso ?? String(latest.peso),
            altura: prefill?.altura ?? String(latest.altura),
            idade: prefill?.idade ?? String(latest.idade),
            sexo: prefill?.sexo ?? latest.sexo,
            nivelAtividade: prefill?.nivelAtividade ?? latest.nivelAtividade,
            gorduraCorporal: latest.gorduraCorporal == null ? "" : String(latest.gorduraCorporal),
          });
          if (prefill) setEditing(true);
        } else {
          if (prefill) setFormData((current) => ({ ...current, ...prefill }));
          setEditing(true);
        }
      } catch (error: unknown) {
        toast({
          variant: "destructive",
          title: "Não foi possível carregar as métricas",
          description: getErrorMessage(error),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [location.state]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        peso: normalizePesoKg(formData.peso),
        altura: normalizeAlturaToMeters(formData.altura),
        idade: normalizeIdade(formData.idade),
        sexo: formData.sexo,
        nivelAtividade: formData.nivelAtividade,
        gorduraCorporal: normalizeGordura(formData.gorduraCorporal),
      };
      const response = await api.post<Metrics>("/metrics", payload);
      setMetrics(response.data);
      setEditing(false);
      toast({ title: "Métricas salvas", description: "Seu histórico foi atualizado." });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Não foi possível salvar",
        description: getErrorMessage(error),
      });
    }
  };

  if (loading) return <div className="p-4">Carregando...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 bg-green-600 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl font-bold">Minhas métricas</h1>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            Este recurso é opcional. Você pode usar o site normalmente sem preencher estes dados.
          </p>

          {metrics && !editing ? (
            <div className="space-y-2">
              <p>Peso: {metrics.peso} kg</p>
              <p>Altura: {metrics.altura} m</p>
              <p>Idade: {metrics.idade} anos</p>
              <p>Sexo: {metrics.sexo === "M" ? "Masculino" : "Feminino"}</p>
              <p>Nível de atividade: {metrics.nivelAtividade}</p>
              <p>Gordura corporal: {metrics.gorduraCorporal == null ? "Não informado" : `${metrics.gorduraCorporal}%`}</p>
              <button onClick={() => setEditing(true)} className="btn-primary mt-4 w-full">
                Atualizar métricas
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm">Peso (kg)
                <input name="peso" required value={formData.peso} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
              </label>
              <label className="block text-sm">Altura (m ou cm)
                <input name="altura" required value={formData.altura} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
              </label>
              <label className="block text-sm">Idade
                <input name="idade" required type="number" value={formData.idade} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
              </label>
              <label className="block text-sm">Sexo
                <select name="sexo" required value={formData.sexo} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </label>
              <label className="block text-sm">Nível de atividade
                <select name="nivelAtividade" required value={formData.nivelAtividade} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                  <option value="">Selecione</option>
                  <option value="Sedentário">Sedentário</option>
                  <option value="Levemente Ativo">Levemente Ativo</option>
                  <option value="Moderadamente Ativo">Moderadamente Ativo</option>
                  <option value="Altamente Ativo">Altamente Ativo</option>
                  <option value="Atleta / Muito Ativo">Atleta / Muito Ativo</option>
                </select>
              </label>
              <label className="block text-sm">Gordura corporal (%) — opcional
                <input name="gorduraCorporal" value={formData.gorduraCorporal} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
              </label>
              <button type="submit" className="btn-primary w-full">Salvar métricas</button>
            </form>
          )}

          <button type="button" onClick={() => navigate("/")} className="mt-3 w-full border rounded-md p-2">
            Agora não
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserMetrics;
