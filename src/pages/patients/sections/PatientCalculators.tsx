import { Card, CardContent } from "@/components/ui/card";
export default function PatientCalculators() {
    return (
        <Card><CardContent>
            <h2 className="text-xl font-bold">🧮 Cálculos</h2>
            <p className="text-sm text-neutral-600">IMC, TMB, TDEE, macros…</p>
        </CardContent></Card>
    );
}
