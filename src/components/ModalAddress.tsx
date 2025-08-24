import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";

interface ModalAddressProps {
    open: boolean;
    onClose: () => void;
    method?: "post" | "put";
    endpoint: string;
    initialData?: {
        street?: string;        // pode vir "Rua X, 123 - Bloco B"
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    onSuccess?: () => void;
}

// Quebra "Rua ABC, 123 - Apto 4" em { rua, numero, complemento }
function splitStreet(full?: string) {
    if (!full) return { rua: "", numero: "", complemento: "" };
    const m = full.match(/^(.*?),\s*(\d+)(?:\s*-\s*(.*))?$/);
    if (m) {
        return {
            rua: (m[1] || "").trim(),
            numero: (m[2] || "").trim(),
            complemento: (m[3] || "").trim(),
        };
    }
    // fallback: não reconheceu padrão → tudo em rua
    return { rua: full, numero: "", complemento: "" };
}

export function ModalAddress({
    open,
    onClose,
    method = "post",
    endpoint,
    initialData = {},
    onSuccess,
}: ModalAddressProps) {
    const [form, setForm] = useState({
        street: initialData.street || "",
        city: initialData.city || "",
        state: initialData.state || "",
        postalCode: initialData.postalCode || "",
        country: initialData.country || "Brasil",
    });

    // campos adicionais locais
    const [{ numero, complemento }, setLocals] = useState({ numero: "", complemento: "" });

    // sempre que abrir/initialData mudar, sincroniza e tenta “quebrar” a rua
    useEffect(() => {
        const parts = splitStreet(initialData.street);
        setForm({
            street: parts.rua || initialData.street || "",
            city: initialData.city || "",
            state: initialData.state || "",
            postalCode: initialData.postalCode || "",
            country: initialData.country || "Brasil",
        });
        setLocals({ numero: parts.numero, complemento: parts.complemento });
    }, [open, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // número/complemento são locais
        if (name === "numero" || name === "complemento") {
            setLocals((prev) => ({ ...prev, [name]: value }));
            return;
        }

        // demais vão para o form
        setForm((prev) => ({ ...prev, [name]: value }));

        // CEP com 8 dígitos → busca
        if (name === "postalCode") {
            const digits = value.replace(/\D/g, "");
            if (digits.length === 8) buscarEnderecoPorCEP(digits);
        }
    };

    const buscarEnderecoPorCEP = async (cep8: string) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep8}/json/`);
            if (response.data.erro) throw new Error("CEP inválido");
            setForm((prev) => ({
                ...prev,
                street: response.data.logradouro || prev.street,
                city: response.data.localidade || prev.city,
                state: response.data.uf || prev.state,
            }));
        } catch {
            toast({
                variant: "destructive",
                title: "Erro ao buscar CEP",
                description: "Não foi possível buscar o endereço automaticamente.",
            });
        }
    };

    const handleSave = async () => {
        // monta street final: "Rua, 123 - Complemento"
        const streetFinal =
            `${form.street?.trim() || ""}` +
            `${numero?.trim() ? `, ${numero.trim()}` : ""}` +
            `${complemento?.trim() ? ` - ${complemento.trim()}` : ""}`;

        const payload = {
            ...form,
            street: streetFinal,
        };

        try {
            await (api as any)[method](endpoint, payload);
            onSuccess?.();
            onClose();
        } catch (err: any) {
            console.error("Erro ao salvar endereço:", err);
            toast({
                variant: "destructive",
                title: "Erro ao salvar endereço",
                description: err?.response?.data?.error || "Tente novamente mais tarde.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{method === "post" ? "Adicionar" : "Editar"} Endereço</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <Input
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        placeholder="CEP"
                    />

                    <Input
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        placeholder="Rua"
                    />

                    <div className="grid gap-2 sm:grid-cols-2">
                        <Input
                            name="numero"
                            value={numero}
                            onChange={handleChange}
                            placeholder="Número"
                        />
                        <Input
                            name="complemento"
                            value={complemento}
                            onChange={handleChange}
                            placeholder="Complemento"
                        />
                    </div>

                    <Input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Cidade"
                    />
                    <Input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        placeholder="Estado"
                    />
                    <Input
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        placeholder="País"
                    />
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
