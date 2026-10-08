import CalculatorTool from "./CalculatorTool";

export default function CalculatorTDEE({ patientId }: { patientId?: number }) {
  return <CalculatorTool kind="tdee" patientId={patientId} />;
}
