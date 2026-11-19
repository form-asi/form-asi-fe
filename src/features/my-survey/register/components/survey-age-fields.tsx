"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/model/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/model/survey-register-schema";

const AGE_FIELDS = [
  { name: "target.minimumAge", label: REGISTER_MESSAGES.minimumAge },
  { name: "target.maximumAge", label: REGISTER_MESSAGES.maximumAge },
] as const;

export function SurveyAgeFields() {
  const { control, trigger } = useFormContext<SurveyRegisterValues>();

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
              onChange={(event) => {
                const ageInput = event.target.value;
                if (!/^\d*$/.test(ageInput)) return;
                field.onChange(ageInput === "" ? "" : Number(ageInput));
                void trigger(["target.minimumAge", "target.maximumAge"]);
              }}
            />
          )}
        />
      ))}
    </div>
  );
}
