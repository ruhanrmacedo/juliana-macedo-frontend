import CalculatorIMC from "./calculators/CalculatorIMC";
import CalculatorTMB from "./calculators/CalculatorTMB";
import CalculatorTDEE from "./calculators/CalculatorTDEE";
import CalculatorMacronutrients from "./calculators/CalculatorMacronutrients";
import CalculatorWater from "./calculators/CalculatorWater";

const Calculadoras = () => {
    return (
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-center">Calculadoras de Saúde</h2>
        <CalculatorIMC />
        <CalculatorTMB />
        <CalculatorTDEE />
        <CalculatorMacronutrients />
        <CalculatorWater />
      </div>
    );
  };

export default Calculadoras;
