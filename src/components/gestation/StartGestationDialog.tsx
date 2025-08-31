// src/components/gestation/StartGestationDialog.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { startGestation } from "@/lib/gestation";
import { useToast } from "@/hooks/use-toast";
import { GestationType } from "@/lib/gestationTypes";
import { getErrorMessage } from "@/lib/errors";

type FormState = {
    pesoPreGestacional: string;
    alturaCm: string;
    dum: string;
    idadeGestacionalInicio: string;
    tipo: GestationType;
};

export default function StartGestationDialog({ userId, onCreated }: { userId?: number; onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [form, setForm] = useState<FormState>({
        pesoPreGestacional: "",
        alturaCm: "",
        dum: "",
        idadeGestacionalInicio: "",
        tipo: "UNICA",
    });

    async function submit() {
        try {
            await startGestation({
                userId,
                pesoPreGestacional: form.pesoPreGestacional,
                alturaCm: form.alturaCm,
                dum: form.dum,
                idadeGestacionalInicio: form.idadeGestacionalInicio ? Number(form.idadeGestacionalInicio) : undefined,
                tipo: form.tipo, // agora é GestationType, não string solta
            });
            toast({ title: "Acompanhamento iniciado!" });
            setOpen(false);
            onCreated();
        } catch (e) {
            toast({ title: "Erro", description: getErrorMessage(e), variant: "destructive" });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="mt-2">iniciar acompanhamento</Button></DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Oba! Um bebê está chegando!</DialogTitle>
                    <p className="text-sm text-muted-foreground">Preencha os dados iniciais para começar o acompanhamento.</p>
                </DialogHeader>

                <div className="space-y-3">
                    <Input placeholder="Peso pré-gestacional (kg)" value={form.pesoPreGestacional}
                        onChange={e => setForm(f => ({ ...f, pesoPreGestacional: e.target.value }))} />
                    <Input placeholder="Altura/Estatura (cm)" value={form.alturaCm}
                        onChange={e => setForm(f => ({ ...f, alturaCm: e.target.value }))} />
                    <Input placeholder="Idade gestacional atual (semanas) — opcional" value={form.idadeGestacionalInicio}
                        onChange={e => setForm(f => ({ ...f, idadeGestacionalInicio: e.target.value }))} />
                    <Input type="date" placeholder="Data da última menstruação" value={form.dum}
                        onChange={e => setForm(f => ({ ...f, dum: e.target.value }))} />
                    <Select
                        value={form.tipo}
                        onValueChange={(v) => setForm(f => ({ ...f, tipo: v as GestationType }))}
                    >
                        <SelectTrigger><SelectValue placeholder="Tipo de gestação" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="UNICA">Única</SelectItem>
                            <SelectItem value="GEMELAR">Gemelar</SelectItem>
                            <SelectItem value="TRIGEMELAR">Trigemelar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>cancelar</Button>
                    <Button onClick={submit}>iniciar acompanhamento</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
