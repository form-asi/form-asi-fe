"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "../model/survey-register-messages";
import { type SurveyRegisterValues } from "../model/survey-register-schema";

type SurveyTextFieldProps = {
  name: "title" | "description" | "reward" | "target.description";
  label: string;
  limit: number;
  multiline?: boolean;
  required?: boolean;
};

export function SurveyTextField({ name, label, limit, multiline, required }: SurveyTextFieldProps) {
  const { control } = useFormContext<SurveyRegisterValues>();
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      required={required}
      render={({ field, controlProps }) => (
        <>
          {multiline ? (
            <Textarea {...field} {...controlProps} maxLength={limit} />
          ) : (
            <Input {...field} {...controlProps} maxLength={limit} />
          )}
          <p className="text-right text-caption-lg text-muted-foreground">
            {REGISTER_MESSAGES.characterCount(field.value.length, limit)}
          </p>
        </>
      )}
    />
  );
}
