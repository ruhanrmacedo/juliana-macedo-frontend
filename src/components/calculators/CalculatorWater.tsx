import CalculatorTool from "./CalculatorTool";

export default function CalculatorWater({ patientId }: { patientId?: number }) {
  return <CalculatorTool kind="water" patientId={patientId} />;
}
