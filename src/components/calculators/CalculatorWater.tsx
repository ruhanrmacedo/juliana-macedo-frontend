import CalculatorTool, { CalculatorExpansionProps } from "./CalculatorTool";

type Props = CalculatorExpansionProps & { patientId?: number };

export default function CalculatorWater({ patientId, expanded, onToggle }: Props) {
  return (
    <CalculatorTool
      kind="water"
      patientId={patientId}
      expanded={expanded}
      onToggle={onToggle}
    />
  );
}
