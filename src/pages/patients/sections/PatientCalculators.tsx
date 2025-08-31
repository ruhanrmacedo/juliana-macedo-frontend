// src/pages/patient/PatientCalculators.tsx
import { useOutletContext } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import CalculatorIMC from "@/components/calculators/CalculatorIMC";
import CalculatorTMB from "@/components/calculators/CalculatorTMB";
import CalculatorTDEE from "@/components/calculators/CalculatorTDEE";
import CalculatorMacronutrients from "@/components/calculators/CalculatorMacronutrients";
import CalculatorWater from "@/components/calculators/CalculatorWater";

type PatientCtx = { patient: { id: number; name: string } | null };

export default function PatientCalculators() {
  const { patient } = useOutletContext<PatientCtx>();
  const patientId = patient?.id;

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">🧮 Cálculos</h2>
          <p className="text-sm text-neutral-600">IMC, TMB, TDEE, macros…</p>
        </div>

        {/* Modo paciente: passamos patientId para cada calculadora */}
        <CalculatorIMC patientId={patientId!} />
        <CalculatorTMB patientId={patientId!} />
        <CalculatorTDEE patientId={patientId!} />
        <CalculatorMacronutrients patientId={patientId!} />
        <CalculatorWater patientId={patientId!} />
      </CardContent>
    </Card>
  );
}