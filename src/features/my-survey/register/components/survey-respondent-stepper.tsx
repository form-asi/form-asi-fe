"use client";

import { type ControllerRenderProps, useFormContext } from "react-hook-form";
import MinusIcon from "@/assets/icons/minus.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import { type FieldControlProps, FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseDigitsInput } from "@/features/my-survey/register/lib/parse-digits-input";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

const MINIMUM_RESPONDENTS = 1;
const STEPPER_BUTTON_CLASS =
  "size-control-lg rounded-md border-input text-foreground disabled:border-line-subtle disabled:bg-muted";

/** 응답 수 스테퍼(− 입력 +). 최소 1명, 최대 제한 없음 */
export function SurveyRespondentStepper() {
  const { control } = useFormContext<SurveyRegisterValues>();
  return (
    <FormField
      control={control}
      name="respondentCount"
      label={REGISTER_MESSAGES.respondentCount}
      required
      render={({ field, controlProps }) => (
        <RespondentStepperControl field={field} controlProps={controlProps} />
      )}
    />
  );
}

function RespondentStepperControl({
  field,
  controlProps,
}: {
  field: ControllerRenderProps<SurveyRegisterValues, "respondentCount">;
  controlProps: FieldControlProps;
}) {
  const respondentCount = field.value === "" ? 0 : field.value;
  const canDecrease = respondentCount > MINIMUM_RESPONDENTS;
  const canIncrease = respondentCount < Number.MAX_SAFE_INTEGER;

  function handleRespondentInputChange(respondentInput: string) {
    const parsedCount = parseDigitsInput(respondentInput);
    if (parsedCount.accepted) field.onChange(parsedCount.fieldValue);
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        aria-label={REGISTER_MESSAGES.decreaseRespondents}
        disabled={!canDecrease}
        className={STEPPER_BUTTON_CLASS}
        onClick={() => field.onChange(respondentCount - 1)}
      >
        <MinusIcon className="size-6" />
      </Button>
      <Input
        {...controlProps}
        {...field}
        onChange={(event) => handleRespondentInputChange(event.target.value)}
        role="spinbutton"
        inputMode="numeric"
        aria-valuemin={MINIMUM_RESPONDENTS}
        aria-valuenow={field.value === "" ? undefined : field.value}
        className="flex-1 [&_input]:text-center [&_input]:font-medium"
      />
      <Button
        type="button"
        variant="outline"
        aria-label={REGISTER_MESSAGES.increaseRespondents}
        disabled={!canIncrease}
        className={STEPPER_BUTTON_CLASS}
        onClick={() => field.onChange(respondentCount + 1)}
      >
        <PlusIcon className="size-6" />
      </Button>
    </div>
  );
}
