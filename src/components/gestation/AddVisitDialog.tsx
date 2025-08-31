import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addVisit } from "@/lib/gestation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/errors";

export default function AddVisitDialog({ trackingId, onCreated }: { trackingId: number; onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [form, setForm] = useState({
        data: "",
        pesoKg: "",
        idadeGestacional: "",
        paSistolica: "",
        paDiastolica: "",
        observacoes: "",
    });

    async function submit() {
        try {
            await addVisit(trackingId, {
                ...form,
                idadeGestacional: form.idadeGestacional ? Number(form.idadeGestacional) : undefined,
                paSistolica: form.paSistolica ? Number(form.paSistolica) : undefined,
                paDiastolica: form.paDiastolica ? Number(form.paDiastolica) : undefined,
            });
            toast({ title: "Visita registrada!" });
            setOpen(false);
            onCreated();
        } catch (err) {
            toast({
                title: "Erro",
                description: getErrorMessage(err),
                variant: "destructive",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button>nova visita</Button></DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Nova visita</DialogTitle></DialogHeader>
                <div className="space-y-3">
                    <Input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
                    <Input placeholder="Peso (kg)" value={form.pesoKg} onChange={e => setForm(f => ({ ...f, pesoKg: e.target.value }))} />
                    <Input placeholder="Idade gestacional (semanas) — opcional" value={form.idadeGestacional}
                        onChange={e => setForm(f => ({ ...f, idadeGestacional: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="PA sistólica" value={form.paSistolica} onChange={e => setForm(f => ({ ...f, paSistolica: e.target.value }))} />
                        <Input placeholder="PA diastólica" value={form.paDiastolica} onChange={e => setForm(f => ({ ...f, paDiastolica: e.target.value }))} />
                    </div>
                    <Input placeholder="Observações (opcional)" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>cancelar</Button>
                    <Button onClick={submit}>salvar</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
