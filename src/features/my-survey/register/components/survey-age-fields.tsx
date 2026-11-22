"use client";

import { useController, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { parseDigitsInput } from "@/features/my-survey/register/lib/parse-digits-input";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

const AGE_FIELD_NAMES = ["target.minimumAge", "target.maximumAge"] as const;
type AgeFieldName = (typeof AGE_FIELD_NAMES)[number];

/** 나이 범위(최소~최대). 한 라벨 아래 두 칸이라 FormField 대신 fieldset으로 묶는다 */
export function SurveyAgeFields() {
  const { formState } = useFormContext<SurveyRegisterValues>();
  const ageErrors = formState.errors.target;
  const errorMessage = ageErrors?.minimumAge?.message ?? ageErrors?.maximumAge?.message;
  return (
    <fieldset className="flex flex-col gap-field-gap">
      <legend className="mb-field-gap pl-0.5 text-label-md font-semibold">
        {REGISTER_MESSAGES.targetLabels.age}
      </legend>
      <div className="flex items-center gap-4">
        <AgeInput
          name="target.minimumAge"
          label={REGISTER_MESSAGES.minimumAge}
          placeholder={REGISTER_MESSAGES.minimumAgePlaceholder}
        />
        <span aria-hidden="true" className="text-label-md font-medium">
          {REGISTER_MESSAGES.ageRangeSeparator}
        </span>
        <AgeInput
          name="target.maximumAge"
          label={REGISTER_MESSAGES.maximumAge}
          placeholder={REGISTER_MESSAGES.maximumAgePlaceholder}
        />
      </div>
      {errorMessage && (
        <p role="alert" className="text-caption-lg text-destructive">
          {errorMessage}
        </p>
      )}
    </fieldset>
  );
}

function AgeInput({
  name,
  label,
  placeholder,
}: {
  name: AgeFieldName;
  label: string;
  placeholder: string;
}) {
  const { control, trigger } = useFormContext<SurveyRegisterValues>();
  const { field, fieldState } = useController({ control, name });

  // 최소·최대는 서로를 기준으로 검증하므로 한쪽이 바뀌면 둘 다 다시 검사한다
  function handleAgeInputChange(ageInput: string) {
    const parsedAge = parseDigitsInput(ageInput);
    if (!parsedAge.accepted) return;
    field.onChange(parsedAge.fieldValue);
    void trigger([...AGE_FIELD_NAMES]);
  }

  return (
    <label className="flex min-w-0 flex-1 items-center gap-1.5">
      <span className="sr-only">{label}</span>
      <Input
        {...field}
        onChange={(event) => handleAgeInputChange(event.target.value)}
        inputMode="numeric"
        placeholder={placeholder}
        aria-invalid={fieldState.invalid}
        className="[&_input]:text-center"
      />
      <span className="shrink-0 text-label-md font-medium">{REGISTER_MESSAGES.ageUnit}</span>
    </label>
  );
}
