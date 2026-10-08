import CalculatorTool, { CalculatorExpansionProps } from "./CalculatorTool";

type Props = CalculatorExpansionProps & { patientId?: number };

export default function CalculatorMacronutrients({ patientId, expanded, onToggle }: Props) {
  return (
    <CalculatorTool
      kind="macros"
      patientId={patientId}
      expanded={expanded}
      onToggle={onToggle}
    />
  );
}
