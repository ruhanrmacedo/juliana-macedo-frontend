import CalculatorTool from "./CalculatorTool";

export default function CalculatorTMB({ patientId }: { patientId?: number }) {
  return <CalculatorTool kind="tmb" patientId={patientId} />;
}
