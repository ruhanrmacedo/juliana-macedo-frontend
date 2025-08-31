import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { nivelFromBackend } from "@/lib/metrics";
import { get } from "http";
import { getErrorMessage } from "@/lib/errors";

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
    userId?: number;
}

function backendToLabel(code?: string) {
    return code ? (nivelFromBackend[code] ?? code) : "Sedentário";
}

export function ModalEditMetrics({
    open,
    onClose,
    initialData = {},
    onSuccess,
    userId,
}: ModalEditMetricsProps) {
    const [peso, setPeso] = useState(initialData.peso?.toString() || "");
    const [altura, setAltura] = useState(initialData.altura?.toString() || "");
    const [idade, setIdade] = useState(initialData.idade?.toString() || "");
    const [sexo, setSexo] = useState(initialData.sexo || "M");
    const [nivelAtividade, setNivelAtividade] = useState(
        initialData.nivelAtividade || "Sedentário"
    );
    const [gorduraCorporal, setGorduraCorporal] = useState(
        initialData.gorduraCorporal?.toString() || ""
    );
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);

            // monta payload somente com campos preenchidos
            const payload: Record<string, unknown> = { userId };

            const pesoTrim = peso.trim();
            if (pesoTrim !== "") payload.peso = pesoTrim.replace(",", ".");

            const alturaTrim = altura.trim();
            if (alturaTrim !== "") payload.altura = alturaTrim.replace(",", ".");

            const idadeTrim = idade.trim();
            if (idadeTrim !== "") payload.idade = Number(idadeTrim);

            if (sexo) payload.sexo = sexo; // manter sempre ok
            if (nivelAtividade) payload.nivelAtividade = nivelAtividade;

            const gcTrim = gorduraCorporal.trim();
            if (gcTrim !== "") payload.gorduraCorporal = gcTrim.replace(",", ".");

            await api.post("/metrics", payload);

            onClose();
            onSuccess?.();
        } catch (err: unknown) {
            alert(getErrorMessage(err) || "Erro ao salvar métricas");
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
                            <SelectTrigger><SelectValue placeholder="Nível de Atividade" /></SelectTrigger>
                            <SelectContent className="z-50 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md">
                                <SelectItem value="Sedentário">Sedentário</SelectItem>
                                <SelectItem value="Levemente Ativo">Levemente Ativo</SelectItem>
                                <SelectItem value="Moderadamente Ativo">Moderadamente Ativo</SelectItem>
                                <SelectItem value="Altamente Ativo">Altamente Ativo</SelectItem>
                                <SelectItem value="Atleta / Muito Ativo">Atleta / Muito Ativo</SelectItem>
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
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}