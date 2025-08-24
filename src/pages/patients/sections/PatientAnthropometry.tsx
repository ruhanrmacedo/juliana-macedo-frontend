import { Card, CardContent } from "@/components/ui/card";
export default function PatientAnthropometry() {
  return (
    <Card><CardContent>
      <h2 className="text-xl font-bold">📏 Antropometria geral</h2>
      <p className="text-sm text-neutral-600">Tabelas, dobras, perímetros, etc.</p>
    </CardContent></Card>
  );
}
