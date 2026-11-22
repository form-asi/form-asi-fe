"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { SurveyChoiceWithEtcField } from "@/features/my-survey/register/components/survey-choice-with-etc-field";
import {
  SURVEY_FORMAT_OPTIONS,
  SURVEY_PURPOSE_OPTIONS,
} from "@/features/my-survey/register/survey-info-options";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

export function SurveyInfoStep() {
  const { control } = useFormContext<SurveyRegisterValues>();
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={control}
        name="surveyUrl"
        label={REGISTER_MESSAGES.surveyUrl}
        description={REGISTER_MESSAGES.surveyUrlError}
        required
        render={({ field, controlProps }) => (
          <Input
            {...field}
            {...controlProps}
            inputMode="url"
            autoCapitalize="none"
            placeholder={REGISTER_MESSAGES.surveyUrlPlaceholder}
          />
        )}
      />
      <SurveyChoiceWithEtcField
        name="purpose"
        label={REGISTER_MESSAGES.purpose}
        options={SURVEY_PURPOSE_OPTIONS}
      />
      <SurveyChoiceWithEtcField
        name="format"
        label={REGISTER_MESSAGES.format}
        options={SURVEY_FORMAT_OPTIONS}
      />
    </div>
  );
}
