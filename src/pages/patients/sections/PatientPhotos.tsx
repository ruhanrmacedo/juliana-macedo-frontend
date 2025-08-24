import { Card, CardContent } from "@/components/ui/card";
export default function PatientsPhotos() {
    return (
        <Card><CardContent>
            <h2 className="text-xl font-bold">📸 Fotos do paciente</h2>
            <p className="text-sm text-neutral-600">Adicione fotos do paciente aqui, como antes e depois, para acompanhar a evolução.</p>
        </CardContent></Card>
    );
}