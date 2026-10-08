import CalculatorTool from "./CalculatorTool";

export default function CalculatorMacronutrients({ patientId }: { patientId?: number }) {
  return <CalculatorTool kind="macros" patientId={patientId} />;
}
