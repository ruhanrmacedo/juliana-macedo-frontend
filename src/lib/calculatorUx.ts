type CalculatorUiInput = {
  isAuthenticated: boolean;
  isPatientMode: boolean;
  hasStoredMetrics: boolean;
  hasResult: boolean;
};

export function getCalculatorUiState({
  isAuthenticated,
  isPatientMode,
  hasStoredMetrics,
  hasResult,
}: CalculatorUiInput) {
  const canUseAccountFeatures = isAuthenticated || isPatientMode;

  return {
    showUseStoredMetrics: canUseAccountFeatures && hasStoredMetrics,
    showSave: canUseAccountFeatures && hasResult,
    showEducationalNotice: hasResult,
  };
}
