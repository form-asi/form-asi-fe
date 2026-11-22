"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { SurveyMultiSelectField } from "@/features/my-survey/register/components/survey-multi-select-field";
import { SURVEY_PURPOSE_OPTIONS } from "@/features/my-survey/register/survey-purpose-options";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

export function SurveyInfoStep() {
  const { control } = useFormContext<SurveyRegisterValues>();
  return (
    <>
      <FormField
        control={control}
        name="surveyUrl"
        label={REGISTER_MESSAGES.surveyUrl}
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
      <SurveyMultiSelectField
        name="purposes"
        label={REGISTER_MESSAGES.purposes}
        options={SURVEY_PURPOSE_OPTIONS}
        placeholder={REGISTER_MESSAGES.purposePlaceholder}
        required
      />
    </>
  );
}
