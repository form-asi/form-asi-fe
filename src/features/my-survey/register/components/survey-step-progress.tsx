import { type Ref } from "react";
import { Progress } from "@/components/ui/progress";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/model/survey-register-messages";
import {
  SURVEY_STEPS,
  type SurveyRegisterStep,
} from "@/features/my-survey/register/model/survey-register-schema";

export function SurveyStepProgress({
  step,
  headingRef,
}: {
  step: SurveyRegisterStep;
  headingRef: Ref<HTMLHeadingElement>;
}) {
  const currentStep = SURVEY_STEPS[step];
  return (
    <div className="flex flex-col gap-layout-gap p-page-inset">
      <div className="grid grid-cols-4 gap-1" aria-hidden="true">
        {Object.entries(SURVEY_STEPS).map(([stepName, { number }]) => (
          <Progress key={stepName} value={number <= currentStep.number ? 1 : 0} max={1} />
        ))}
      </div>
      <h2 ref={headingRef} className="text-label-md" tabIndex={-1} data-survey-step-title>
        <span className="font-bold">{currentStep.number}/4</span> {REGISTER_MESSAGES.steps[step]}
      </h2>
      {step === "target" && (
        <p className="text-caption-lg text-muted-foreground">{REGISTER_MESSAGES.targetStepHint}</p>
      )}
      {step === "intro" && (
        <p className="text-caption-lg text-muted-foreground">{REGISTER_MESSAGES.introStepHint}</p>
      )}
    </div>
  );
}
