"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { parseDigitsInput } from "@/features/my-survey/register/lib/parse-digits-input";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

const AGE_FIELDS = [
  { name: "target.minimumAge", label: REGISTER_MESSAGES.minimumAge },
  { name: "target.maximumAge", label: REGISTER_MESSAGES.maximumAge },
] as const;
const AGE_FIELD_NAMES = AGE_FIELDS.map(({ name }) => name);

export function SurveyAgeFields() {
  const { control, trigger } = useFormContext<SurveyRegisterValues>();

  // 최소·최대는 서로를 기준으로 검증하므로 한쪽이 바뀌면 둘 다 다시 검사한다
  function handleAgeInputChange(ageInput: string, updateAge: (age: number | "") => void) {
    const parsedAge = parseDigitsInput(ageInput);
    if (!parsedAge.accepted) return;
    updateAge(parsedAge.fieldValue);
    void trigger(AGE_FIELD_NAMES);
  }

  return (
    <div className="grid grid-cols-2 gap-layout-gap">
      {AGE_FIELDS.map(({ name, label }) => (
        <FormField
          key={name}
          control={control}
          name={name}
          label={label}
          render={({ field, controlProps }) => (
            <Input
              {...field}
              {...controlProps}
              inputMode="numeric"
              endAdornment={REGISTER_MESSAGES.ageUnit}
              onChange={(event) => handleAgeInputChange(event.target.value, field.onChange)}
            />
          )}
        />
      ))}
    </div>
  );
}
