import CalculatorTool, { CalculatorExpansionProps } from "./CalculatorTool";

type Props = CalculatorExpansionProps & { patientId?: number };

export default function CalculatorTMB({ patientId, expanded, onToggle }: Props) {
  return (
    <CalculatorTool
      kind="tmb"
      patientId={patientId}
      expanded={expanded}
      onToggle={onToggle}
    />
  );
}
