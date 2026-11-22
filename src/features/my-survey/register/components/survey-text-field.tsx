"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

type SurveyTextFieldProps = {
  name: "title" | "description" | "reward" | "target.description";
  label: string;
  limit: number;
  placeholder?: string;
  description?: string;
  multiline?: boolean;
  required?: boolean;
  hideLabel?: boolean;
};

export function SurveyTextField({
  name,
  label,
  limit,
  placeholder = REGISTER_MESSAGES.textPlaceholder,
  description,
  multiline,
  required,
  hideLabel,
}: SurveyTextFieldProps) {
  const { control } = useFormContext<SurveyRegisterValues>();
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      hideLabel={hideLabel}
      showOptionalTag={false}
      render={({ field, controlProps }) => (
        <div className="flex flex-col gap-1.5">
          {multiline ? (
            <Textarea {...field} {...controlProps} maxLength={limit} placeholder={placeholder} />
          ) : (
            <Input {...field} {...controlProps} maxLength={limit} placeholder={placeholder} />
          )}
          <p className="text-right text-caption-lg text-muted-foreground">
            {REGISTER_MESSAGES.characterCount(field.value.length, limit)}
          </p>
        </div>
      )}
    />
  );
}
