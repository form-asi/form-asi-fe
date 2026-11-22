"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { SelectSheet, type SelectSheetOption } from "@/components/common/select-sheet";
import { Input } from "@/components/ui/input";
import { ETC_OPTION_VALUE } from "@/features/my-survey/register/survey-info-options";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import {
  ETC_TEXT_LIMIT,
  type SurveyRegisterValues,
} from "@/features/my-survey/register/survey-register-schema";

type SurveyChoiceWithEtcFieldProps = {
  name: "purpose" | "format";
  label: string;
  options: readonly SelectSheetOption<string>[];
};

/** 하나를 고르는 필수 항목. "기타"를 고르면 아래에 직접 입력칸이 나온다 */
export function SurveyChoiceWithEtcField({ name, label, options }: SurveyChoiceWithEtcFieldProps) {
  const { control, setValue } = useFormContext<SurveyRegisterValues>();
  const selectedCode = useWatch({ control, name: `${name}.code` });
  const isEtcSelected = selectedCode === ETC_OPTION_VALUE;

  function handleSelectChoice(code: string, updateCode: (code: string) => void) {
    updateCode(code);
    if (code !== ETC_OPTION_VALUE) setValue(`${name}.etcText`, "", { shouldValidate: true });
  }

  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={control}
        name={`${name}.code`}
        label={label}
        required
        render={({ field, controlProps }) => (
          <SelectSheet
            {...controlProps}
            ref={field.ref}
            title={label}
            options={options}
            value={field.value}
            onValueChange={(code) => handleSelectChoice(code, field.onChange)}
            onBlur={field.onBlur}
          />
        )}
      />
      {isEtcSelected && (
        <FormField
          control={control}
          name={`${name}.etcText`}
          label={REGISTER_MESSAGES.etcTextLabel(label)}
          hideLabel
          required
          render={({ field, controlProps }) => (
            <Input
              {...field}
              {...controlProps}
              autoFocus
              maxLength={ETC_TEXT_LIMIT}
              placeholder={REGISTER_MESSAGES.etcTextPlaceholder}
            />
          )}
        />
      )}
    </div>
  );
}
