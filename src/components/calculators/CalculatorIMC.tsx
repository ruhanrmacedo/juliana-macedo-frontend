import CalculatorTool from "./CalculatorTool";

export default function CalculatorIMC({ patientId }: { patientId?: number }) {
  return <CalculatorTool kind="imc" patientId={patientId} />;
}
