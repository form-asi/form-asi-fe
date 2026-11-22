"use client";

import { useState } from "react";
import { type FieldPathByValue, useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

type SurveyMultiSelectFieldProps = {
  name: FieldPathByValue<SurveyRegisterValues, string[]>;
  label: string;
  options: readonly { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
};

export function SurveyMultiSelectField({
  name,
  label,
  options,
  placeholder,
  required,
}: SurveyMultiSelectFieldProps) {
  const { control } = useFormContext<SurveyRegisterValues>();
  const [open, setOpen] = useState(false);
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      required={required}
      render={({ field, controlProps }) => (
        <Select<string, true>
          multiple
          open={open}
          onOpenChange={setOpen}
          items={options}
          value={field.value}
          onValueChange={(selectedCodes) => {
            field.onChange(selectedCodes);
            setOpen(false);
          }}
        >
          <SelectTrigger ref={field.ref} onBlur={field.onBlur} {...controlProps}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
