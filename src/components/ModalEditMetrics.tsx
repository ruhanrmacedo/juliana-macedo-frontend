import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";

interface ModalEditMetricsProps {
    open: boolean;
    onClose: () => void;
    initialData: {
        peso?: number;
        altura?: number;
        idade?: number;
        sexo?: string;
        nivelAtividade?: string;
        gorduraCorporal?: number;
    };
    onSuccess?: () => void;
}

function mapNivelAtividadeBackend(label: string): string {
    const map: Record<string, string> = {
        "SEDENTARIO": "Sedentário",
        "LEVEMENTE_ATIVO": "Levemente Ativo",
        "MODERADAMENTE_ATIVO": "Moderadamente Ativo",
        "ALTAMENTE_ATIVO": "Altamente Ativo",
        "ATLETA": "Atleta / Muito Ativo"
    };
    return map[label] || label;
}

export function ModalEditMetrics({ open, onClose, initialData, onSuccess }: ModalEditMetricsProps) {
    const [peso, setPeso] = useState(initialData.peso?.toString() || "");
    const [altura, setAltura] = useState(initialData.altura?.toString() || "");
    const [idade, setIdade] = useState(initialData.idade?.toString() || "");
    const [sexo, setSexo] = useState(initialData.sexo || "M");
    const [nivelAtividade, setNivelAtividade] = useState(mapNivelAtividadeBackend(initialData.nivelAtividade) || "SEDENTARIO");
    const [gorduraCorporal, setGorduraCorporal] = useState(initialData.gorduraCorporal?.toString() || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);
            await api.post("/metrics", {
                peso: peso.replace(",", "."),
                altura: altura.replace(",", "."),
                idade: parseInt(idade),
                sexo,
                nivelAtividade: mapNivelAtividadeBackend(nivelAtividade),
                gorduraCorporal: gorduraCorporal ? gorduraCorporal.replace(",", ".") : undefined
            });
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Erro ao salvar métricas:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="z-50">
                <DialogHeader>
                    <DialogTitle>Editar Métricas</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[75vh] space-y-3">
                    <label className="flex flex-col gap-1">
                        Peso (kg)
                        <Input
                            placeholder="Peso (kg)"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        Altura (m)
                        <Input
                            placeholder="Altura (m)"
                            value={altura}
                            onChange={(e) => setAltura(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        Idade
                        <Input
                            placeholder="Idade"
                            type="number"
                            value={idade}
                            onChange={(e) => setIdade(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        Sexo
                        <Select value={sexo} onValueChange={setSexo}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sexo" />
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md">
                                <SelectItem value="M">Masculino</SelectItem>
                                <SelectItem value="F">Feminino</SelectItem>
                            </SelectContent>
                        </Select>
                    </label>
                    <label className="flex flex-col gap-1">
                        Nível de Atividade
                        <Select value={nivelAtividade} onValueChange={setNivelAtividade}>
                            <SelectTrigger>
                                <SelectValue placeholder="Nível de Atividade">
                                {mapNivelAtividadeBackend(nivelAtividade)}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="z-50 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md">
                                <SelectItem value="SEDENTARIO">Sedentário</SelectItem>
                                <SelectItem value="LEVEMENTE_ATIVO">Levemente Ativo</SelectItem>
                                <SelectItem value="MODERADAMENTE_ATIVO">Moderadamente Ativo</SelectItem>
                                <SelectItem value="ALTAMENTE_ATIVO">Altamente Ativo</SelectItem>
                                <SelectItem value="ATLETA">Atleta</SelectItem>
                            </SelectContent>
                        </Select>
                    </label>
                    <label className="flex flex-col gap-1">
                        Gordura Corporal (%)
                        <Input
                            placeholder="Gordura Corporal (%)"
                            value={gorduraCorporal}
                            onChange={(e) => setGorduraCorporal(e.target.value)}
                        />
                    </label>
                </div>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}