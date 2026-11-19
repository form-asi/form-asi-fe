"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import {
  SURVEY_DURATION_MINUTES,
  type SurveyRegisterValues,
} from "@/features/my-survey/register/survey-register-schema";
import { formatHelpTime } from "@/lib/format-help-time";

export function SurveyDurationField() {
  const { control } = useFormContext<SurveyRegisterValues>();
  const durationList = useRef<HTMLDivElement | null>(null);

  function scrollDurations(direction: -1 | 1) {
    const list = durationList.current;
    if (list) list.scrollBy({ left: direction * list.clientWidth, behavior: "smooth" });
  }

  return (
    <FormField
      control={control}
      name="durationMinutes"
      label={REGISTER_MESSAGES.duration}
      description={REGISTER_MESSAGES.durationHint}
      required
      render={({ field, controlProps }) => (
        <div className="flex min-w-0 items-center gap-field-gap">
          <div className="hidden md:block">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={REGISTER_MESSAGES.previousDurations}
              onClick={() => scrollDurations(-1)}
            >
              <ChevronLeftIcon />
            </Button>
          </div>
          <ToggleGroup
            {...controlProps}
            ref={(list) => {
              durationList.current = list;
              field.ref(list);
            }}
            value={field.value === "" ? [] : [String(field.value)]}
            onValueChange={(selectedDurations) => {
              const selectedDuration = selectedDurations[0];
              field.onChange(selectedDuration === undefined ? "" : Number(selectedDuration));
            }}
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
          <div className="hidden md:block">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={REGISTER_MESSAGES.nextDurations}
              onClick={() => scrollDurations(1)}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      )}
    />
  );
}
