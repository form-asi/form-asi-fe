"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { SurveySection } from "@/features/my-survey/register/components/survey-section";
import { SurveyTextField } from "@/features/my-survey/register/components/survey-text-field";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

export function SurveyIntroStep() {
  const { control } = useFormContext<SurveyRegisterValues>();
  const [description, reward] = useWatch({ control, name: ["description", "reward"] });
  return (
    <>
      <SurveyTextField name="title" label={REGISTER_MESSAGES.surveyTitle} limit={100} required />
      <SurveySection
        title={REGISTER_MESSAGES.description}
        summary={description ? REGISTER_MESSAGES.hasInput : REGISTER_MESSAGES.noInput}
      >
        <SurveyTextField
          name="description"
          label={REGISTER_MESSAGES.description}
          limit={700}
          multiline
        />
      </SurveySection>
      <SurveySection
        title={REGISTER_MESSAGES.reward}
        summary={reward ? REGISTER_MESSAGES.hasInput : REGISTER_MESSAGES.noInput}
      >
        <SurveyTextField name="reward" label={REGISTER_MESSAGES.reward} limit={100} />
      </SurveySection>
    </>
  );
}
