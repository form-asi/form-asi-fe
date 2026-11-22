"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { SurveyDurationField } from "@/features/my-survey/register/components/survey-duration-field";
import { SurveyRespondentStepper } from "@/features/my-survey/register/components/survey-respondent-stepper";
import { getHelpTimeCost } from "@/features/my-survey/register/lib/survey-help-time-cost";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";
import { formatHelpTime } from "@/lib/format-help-time";

export function SurveyScaleStep({ helpTimeBalance }: { helpTimeBalance: number }) {
  return (
    <div className="flex flex-col gap-7">
      <SurveyDurationField />
      <SurveyRespondentStepper />
      <SurveyHelpTimeSummary helpTimeBalance={helpTimeBalance} />
    </div>
  );
}

function SurveyHelpTimeSummary({ helpTimeBalance }: { helpTimeBalance: number }) {
  const { control } = useFormContext<SurveyRegisterValues>();
  const [respondentCount, durationMinutes] = useWatch({
    control,
    name: ["respondentCount", "durationMinutes"],
  });
  const helpTimeCost = getHelpTimeCost({ respondentCount, durationMinutes }, helpTimeBalance);
  const requiredHelpTime = helpTimeCost.status === "incomplete" ? 0 : helpTimeCost.requiredHelpTime;

  return (
    <section
      aria-live="polite"
      className="flex flex-col gap-2.5 rounded-sm bg-muted p-4 text-label-md"
    >
      <div className="flex items-center justify-between">
        <span>{REGISTER_MESSAGES.requiredHelpTime}</span>
        <span className="flex items-center gap-2">
          {helpTimeCost.status !== "incomplete" && (
            <span className="text-label-sm text-foreground-quaternary">
              {REGISTER_MESSAGES.costFormula(
                helpTimeCost.durationMinutes,
                helpTimeCost.respondentCount,
              )}
            </span>
          )}
          <span className="text-title-lg font-semibold">{formatHelpTime(requiredHelpTime)}</span>
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span>{REGISTER_MESSAGES.myHelpTime}</span>
        <span className="text-label-lg font-medium">{formatHelpTime(helpTimeBalance)}</span>
      </div>
      {helpTimeCost.status === "insufficient" && (
        <>
          <hr className="border-line-subtle" />
          <div className="flex items-center justify-between text-destructive">
            <span className="font-medium">{REGISTER_MESSAGES.shortfallHelpTime}</span>
            <span className="text-title-lg font-semibold">
              {formatHelpTime(helpTimeCost.missingHelpTime)}
            </span>
          </div>
          <p className="text-right text-caption-lg whitespace-pre-line text-destructive">
            {REGISTER_MESSAGES.shortfallGuide}
          </p>
        </>
      )}
    </section>
  );
}
