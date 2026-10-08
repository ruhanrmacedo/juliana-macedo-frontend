import { useState } from "react";
import CalculatorIMC from "./calculators/CalculatorIMC";
import CalculatorTMB from "./calculators/CalculatorTMB";
import CalculatorTDEE from "./calculators/CalculatorTDEE";
import CalculatorMacronutrients from "./calculators/CalculatorMacronutrients";
import CalculatorWater from "./calculators/CalculatorWater";
import {
  HomeCalculatorId,
  INITIAL_OPEN_CALCULATOR,
  toggleOpenCalculator,
} from "@/lib/calculatorAccordion";

const Calculadoras = () => {
  const [openCalculator, setOpenCalculator] = useState<HomeCalculatorId | null>(
    INITIAL_OPEN_CALCULATOR,
  );

  const toggle = (calculator: HomeCalculatorId) => {
    setOpenCalculator((current) => toggleOpenCalculator(current, calculator));
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-center">Calculadoras de Saúde</h2>
      <CalculatorIMC
        expanded={openCalculator === "imc"}
        onToggle={() => toggle("imc")}
      />
      <CalculatorTMB
        expanded={openCalculator === "tmb"}
        onToggle={() => toggle("tmb")}
      />
      <CalculatorTDEE
        expanded={openCalculator === "tdee"}
        onToggle={() => toggle("tdee")}
      />
      <CalculatorMacronutrients
        expanded={openCalculator === "macros"}
        onToggle={() => toggle("macros")}
      />
      <CalculatorWater
        expanded={openCalculator === "water"}
        onToggle={() => toggle("water")}
      />
    </div>
  );
};

export default Calculadoras;
