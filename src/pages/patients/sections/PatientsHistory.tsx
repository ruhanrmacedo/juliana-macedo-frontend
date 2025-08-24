import { Card, CardContent } from "@/components/ui/card";
export default function PatientsHistory() {
    return (
        <Card><CardContent>
            <h2 className="text-xl font-bold">📜 Histórico</h2>
            <p className="text-sm text-neutral-600">Adicione Histórico do paciente, para acompanhar a evolução.</p>
        </CardContent></Card>
    );
}