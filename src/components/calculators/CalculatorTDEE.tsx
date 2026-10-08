import CalculatorTool, { CalculatorExpansionProps } from "./CalculatorTool";

type Props = CalculatorExpansionProps & { patientId?: number };

export default function CalculatorTDEE({ patientId, expanded, onToggle }: Props) {
  return (
    <CalculatorTool
      kind="tdee"
      patientId={patientId}
      expanded={expanded}
      onToggle={onToggle}
    />
  );
}
