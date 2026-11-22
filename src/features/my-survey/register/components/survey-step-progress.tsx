import { type Ref } from "react";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import {
  SURVEY_STEPS,
  type SurveyRegisterStep,
} from "@/features/my-survey/register/survey-register-schema";
import { cn } from "@/lib/utils";

export function SurveyStepProgress({
  step,
  headingRef,
}: {
  step: SurveyRegisterStep;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const currentStepNumber = SURVEY_STEPS[step].number;
  return (
    <div className="flex flex-col gap-4">
      <div
        role="img"
        aria-label={REGISTER_MESSAGES.stepProgress(currentStepNumber)}
        className="grid grid-cols-4 gap-2"
      >
        {Object.entries(SURVEY_STEPS).map(([stepName, { number }]) => (
          <span
            key={stepName}
            className={cn(
              "h-progress rounded-full",
              number <= currentStepNumber ? "bg-brand" : "bg-secondary",
            )}
          />
        ))}
      </div>
      <h2
        ref={headingRef}
        tabIndex={-1}
        data-survey-step-title
        className="text-heading-sm font-semibold outline-none"
      >
        {REGISTER_MESSAGES.stepQuestions[step]}
      </h2>
    </div>
  );
}
