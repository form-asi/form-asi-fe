"use client";

import { type FieldPathByValue, useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { SelectSheet, type SelectSheetOption } from "@/components/common/select-sheet";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

type SurveyMultiSelectFieldProps = {
  name: FieldPathByValue<SurveyRegisterValues, string[]>;
  label: string;
  options: readonly SelectSheetOption<string>[];
};

/** 대상 조건 묶음 안의 여러 개 선택 항목. 묶음 제목에 "선택"이 있어 항목에는 표시하지 않는다 */
export function SurveyMultiSelectField({ name, label, options }: SurveyMultiSelectFieldProps) {
  const { control } = useFormContext<SurveyRegisterValues>();
  return (
    <FormField
      control={control}
      name={name}
      label={label}
      showOptionalTag={false}
      render={({ field, controlProps }) => (
        <SelectSheet
          {...controlProps}
          ref={field.ref}
          multiple
          title={label}
          options={options}
          value={field.value}
          onValueChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
