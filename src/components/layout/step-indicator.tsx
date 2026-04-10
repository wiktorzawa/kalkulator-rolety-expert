import { Button } from "@heroui/react";
import { STEP_LABELS, TOTAL_STEPS } from "@/context/wizard-types";
import { useWizard } from "@/context/wizard-context";

export function StepIndicator() {
  const { state, dispatch } = useWizard();

  return (
    <nav aria-label="Kroki konfiguracji" className="w-full">
      <ol className="flex items-center gap-1 md:gap-2">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = state.step === stepNumber;
          const isCompleted = state.step > stepNumber;
          const isLast = stepNumber === TOTAL_STEPS;

          return (
            <li
              key={label}
              className={`flex items-center ${isLast ? "" : "flex-1"}`}
            >
              <Button
                isIconOnly
                size="sm"
                variant={
                  isCompleted ? "primary" : isActive ? "secondary" : "ghost"
                }
                onPress={() =>
                  dispatch({ type: "GO_TO_STEP", step: stepNumber })
                }
                className={`min-h-[44px] min-w-[44px] rounded-full ${
                  isActive ? "ring-2 ring-sage-400" : ""
                }`}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Krok ${stepNumber}: ${label}`}
              >
                {isCompleted ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </Button>
              {!isLast && (
                <div
                  className={`mx-1 h-0.5 flex-1 transition-colors duration-200 md:mx-2 ${
                    isCompleted ? "bg-sage-600" : "bg-brand-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-1 text-center text-xs text-brand-500">
        {STEP_LABELS[state.step - 1]}
      </div>
    </nav>
  );
}
