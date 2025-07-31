import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface ModalEditProps {
    open: boolean;
    onClose: () => void;
    label: string;
    value: string;
    endpoint: string; // Ex: "/user" ou "/phones/1"
    fieldName: string; // Ex: "name", "email", "number"
    method?: "put" | "patch" | "post";
    onSuccess?: () => void;
}

export function ModalEdit({
    open,
    onClose,
    label,
    value,
    endpoint,
    fieldName,
    method,
    onSuccess
}: ModalEditProps) {
    const [inputValue, setInputValue] = useState(value);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);
            await api[method](endpoint, { [fieldName]: inputValue });
            onClose();
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Erro ao salvar:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar {label}</DialogTitle>
                </DialogHeader>
                <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
