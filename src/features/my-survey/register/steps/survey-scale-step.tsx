"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormField } from "@/components/common/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatHelpTime } from "@/lib/format-help-time";
import { SurveyDurationField } from "../components/survey-duration-field";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "../model/survey-register-messages";
import { type SurveyRegisterValues } from "../model/survey-register-schema";

export function SurveyScaleStep({ helpTimeBalance }: { helpTimeBalance: number }) {
  const { control } = useFormContext<SurveyRegisterValues>();
  const [respondentCount, durationMinutes] = useWatch({
    control,
    name: ["respondentCount", "durationMinutes"],
  });
  const hasScale =
    typeof respondentCount === "number" &&
    respondentCount >= 1 &&
    typeof durationMinutes === "number";
  const requiredHelpTime = hasScale ? respondentCount * durationMinutes : 0;
  const missingHelpTime = requiredHelpTime - helpTimeBalance;
  return (
    <>
      <FormField
        control={control}
        name="respondentCount"
        label={REGISTER_MESSAGES.respondentCount}
        required
        render={({ field, controlProps }) => (
          <Input
            {...field}
            {...controlProps}
            inputMode="numeric"
            onChange={(event) => {
              const respondentInput = event.target.value;
              if (/^\d*$/.test(respondentInput))
                field.onChange(respondentInput === "" ? "" : Number(respondentInput));
            }}
            endAdornment={
              <>
                <span>{REGISTER_MESSAGES.respondentUnit}</span>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={REGISTER_MESSAGES.decreaseRespondents}
                  disabled={field.value === "" || field.value <= 1}
                  onClick={() => field.onChange(Number(field.value) - 1)}
                >
                  <MinusIcon />
                </Button>
                <Button
                  type="button"
                  size="icon-xs"
                  variant="ghost"
                  aria-label={REGISTER_MESSAGES.increaseRespondents}
                  disabled={Number(field.value) >= Number.MAX_SAFE_INTEGER}
                  onClick={() => field.onChange(Number(field.value) + 1)}
                >
                  <PlusIcon />
                </Button>
              </>
            }
          />
        )}
      />
      <SurveyDurationField />
      <Card>
        <CardContent>
          <div className="flex flex-col gap-layout-gap" aria-live="polite">
            <h3 className="text-label-md font-bold">{REGISTER_MESSAGES.requiredHelpTime}</h3>
            <p>
              {hasScale
                ? REGISTER_MESSAGES.cost(durationMinutes, respondentCount)
                : REGISTER_MESSAGES.incompleteCost}
            </p>
            <p>
              {REGISTER_MESSAGES.myHelpTime}{" "}
              <span className={helpTimeBalance < 0 ? "text-destructive" : undefined}>
                {formatHelpTime(helpTimeBalance)}
              </span>
            </p>
            <p className="text-caption-lg text-muted-foreground">{REGISTER_MESSAGES.debitHint}</p>
          </div>
        </CardContent>
      </Card>
      {hasScale && helpTimeBalance >= 0 && missingHelpTime > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            {REGISTER_MESSAGES.insufficientHelpTime(missingHelpTime)}
          </AlertDescription>
        </Alert>
      )}
      <Alert variant="notice">
        <AlertDescription>
          <ul className="list-disc space-y-field-gap pl-4">
            {REGISTER_MESSAGES.publishingNotices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    </>
  );
}
