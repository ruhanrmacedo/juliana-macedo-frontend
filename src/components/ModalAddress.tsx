import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import api from "@/lib/api";

export type AddressForm = {
    postalCode: string;
    street: string;
    number?: string;
    complement?: string;
    city: string;
    state: string;
    country: string;
};

interface ModalAddressProps {
    open: boolean;
    onClose: () => void;
    method?: "post" | "put";
    endpoint: string;
    initialData?: Partial<AddressForm>;
    onSuccess?: () => void;
}

export function ModalAddress({
    open,
    onClose,
    method = "post",
    endpoint,
    initialData = {},
    onSuccess,
}: ModalAddressProps) {
    const [form, setForm] = useState<AddressForm>({
        postalCode: initialData.postalCode ?? "",
        street: initialData.street ?? "",
        number: initialData.number ?? "",
        complement: initialData.complement ?? "",
        city: initialData.city ?? "",
        state: initialData.state ?? "",
        country: initialData.country ?? "Brasil",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Busca CEP somente quando houver exatamente 8 dígitos
        if (name === "postalCode") {
            const digits = value.replace(/\D/g, "");
            if (digits.length === 8) buscarEnderecoPorCEP(digits);
        }
    };

    const buscarEnderecoPorCEP = async (cep: string) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
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
        await api[method](endpoint, form);
        onSuccess?.();
        onClose();
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
                    <div className="grid gap-2 grid-cols-2">
                        <Input name="number" value={form.number} onChange={handleChange} placeholder="Número" />
                        <Input name="complement" value={form.complement} onChange={handleChange} placeholder="Complemento" />
                    </div>
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