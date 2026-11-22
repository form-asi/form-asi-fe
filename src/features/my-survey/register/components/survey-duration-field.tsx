"use client";

import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import {
  SURVEY_DURATION_MINUTES,
  type SurveyRegisterValues,
} from "@/features/my-survey/register/survey-register-schema";
import { formatHelpTime } from "@/lib/format-help-time";

export function SurveyDurationField() {
  const { control } = useFormContext<SurveyRegisterValues>();

  function handleSelectDuration(
    selectedDurations: string[],
    updateDuration: (minutes: number | "") => void,
  ) {
    const [selectedDuration] = selectedDurations;
    updateDuration(selectedDuration === undefined ? "" : Number(selectedDuration));
  }

  return (
    <FormField
      control={control}
      name="durationMinutes"
      label={REGISTER_MESSAGES.duration}
      required
      render={({ field, controlProps }) => (
        // 칩이 화면 폭을 넘으면 가로로 밀고, 오른쪽 끝은 흐리게 잘라 더 있음을 보여 준다
        <div className="relative -mx-page-inset">
          <ToggleGroup
            {...controlProps}
            ref={field.ref}
            size="chip"
            className="scrollbar-none px-page-inset py-1.5"
            value={field.value === "" ? [] : [String(field.value)]}
            onValueChange={(selectedDurations) =>
              handleSelectDuration(selectedDurations, field.onChange)
            }
            onBlur={field.onBlur}
          >
            {SURVEY_DURATION_MINUTES.map((minutes) => (
              <ToggleGroupItem
                key={minutes}
                value={String(minutes)}
                onFocus={(event) =>
                  event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })
                }
              >
                {formatHelpTime(minutes)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-r from-transparent to-background"
          />
        </div>
      )}
    />
  );
}
