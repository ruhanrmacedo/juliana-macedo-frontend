import CalculatorTool, { CalculatorExpansionProps } from "./CalculatorTool";

type Props = CalculatorExpansionProps & { patientId?: number };

export default function CalculatorIMC({ patientId, expanded, onToggle }: Props) {
  return (
    <CalculatorTool
      kind="imc"
      patientId={patientId}
      expanded={expanded}
      onToggle={onToggle}
    />
  );
}
