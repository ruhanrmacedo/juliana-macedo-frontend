import { useState } from "react";
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
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    onSuccess?: () => void;
}

export function ModalAddress({
    open,
    onClose,
    method = "post",
    endpoint,
    initialData = {},
    onSuccess
}: ModalAddressProps) {
    const [form, setForm] = useState({
        street: initialData.street || "",
        city: initialData.city || "",
        state: initialData.state || "",
        postalCode: initialData.postalCode || "",
        country: initialData.country || "Brasil"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Ao preencher o CEP com 8 dígitos, chama a API automaticamente
        if (name === "postalCode" && value.replace(/\D/g, "").length === 8) {
            buscarEnderecoPorCEP(value);
        }
    };

    const buscarEnderecoPorCEP = async (cep: string) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data.erro) throw new Error("CEP inválido");

            setForm((prev) => ({
                ...prev,
                street: response.data.logradouro || "",
                city: response.data.localidade || "",
                state: response.data.uf || ""
            }));
        } catch {
            toast({
                variant: "destructive",
                title: "Erro ao buscar CEP",
                description: "Não foi possível buscar o endereço automaticamente."
            });
        }
    };

    const handleSave = async () => {
        try {
            await api[method](endpoint, form);
            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error("Erro ao salvar endereço:", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{method === "post" ? "Adicionar" : "Editar"} Endereço</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <Input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="CEP" />
                    <Input name="street" value={form.street} onChange={handleChange} placeholder="Rua" />
                    <Input name="city" value={form.city} onChange={handleChange} placeholder="Cidade" />
                    <Input name="state" value={form.state} onChange={handleChange} placeholder="Estado" />
                    <Input name="country" value={form.country} onChange={handleChange} placeholder="País" />
                </div>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
