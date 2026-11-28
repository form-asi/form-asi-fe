"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SurveyAgeFields } from "@/features/my-survey/register/components/survey-age-fields";
import { SurveyMultiSelectField } from "@/features/my-survey/register/components/survey-multi-select-field";
import { SurveySection } from "@/features/my-survey/register/components/survey-section";
import { SurveyTextField } from "@/features/my-survey/register/components/survey-text-field";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
import {
  createEmptyTarget,
  type SurveyRegisterValues,
  TARGET_AUDIENCES,
  type TargetAudience,
} from "@/features/my-survey/register/survey-register-schema";
import { type SurveyTargetOptions } from "@/features/my-survey/register/survey-target-options";

const BASIC_FIELDS = ["gender", "occupation", "fields"] as const;
const LIVING_FIELDS = [
  "region",
  "household",
  "householdSize",
  "maritalStatus",
  "children",
  "petExperience",
  "petTypes",
  "drivingLicense",
] as const;
const AUDIENCE_LABELS = {
  ANYONE: REGISTER_MESSAGES.audienceAnyone,
  CONDITIONAL: REGISTER_MESSAGES.audienceConditional,
} satisfies Record<TargetAudience, string>;

function isTargetAudience(value: string | undefined): value is TargetAudience {
  return TARGET_AUDIENCES.some((audience) => audience === value);
}

function toSelectedSummary(count: number) {
  return count > 0 ? REGISTER_MESSAGES.selectedCount(count) : undefined;
}

export function SurveyTargetStep({ options }: { options: SurveyTargetOptions }) {
  const { control, setValue } = useFormContext<SurveyRegisterValues>();
  const target = useWatch({ control, name: "target" });
  const hasAgeRange = target.minimumAge !== "" || target.maximumAge !== "";
  const basicCount =
    Number(hasAgeRange) + BASIC_FIELDS.filter((name) => target[name].length > 0).length;
  const livingCount = LIVING_FIELDS.filter((name) => target[name].length > 0).length;

  // "누구나"로 바꾸면 숨겨진 조건이 남아 등록되지 않도록 조건을 비운다
  function handleChangeAudience(selectedAudiences: string[]) {
    const [audience] = selectedAudiences;
    if (!isTargetAudience(audience)) return;
    if (audience === "ANYONE") {
      setValue("target", createEmptyTarget(), { shouldDirty: true, shouldValidate: true });
      return;
    }
    setValue("target.audience", audience, { shouldDirty: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        variant="segmented"
        size="segmented"
        className="w-full p-0"
        value={[target.audience]}
        onValueChange={handleChangeAudience}
      >
        {TARGET_AUDIENCES.map((audience) => (
          <ToggleGroupItem key={audience} value={audience}>
            {AUDIENCE_LABELS[audience]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {target.audience === "CONDITIONAL" && (
        <>
          <div className="flex flex-col gap-2">
            <p className="pl-0.5 text-caption-lg font-medium text-muted-foreground">
              {REGISTER_MESSAGES.profileConditionHint}
            </p>
            <SurveySection
              title={REGISTER_MESSAGES.basicConditions}
              summary={toSelectedSummary(basicCount)}
            >
              <SurveyAgeFields />
              {BASIC_FIELDS.map((name) => (
                <SurveyMultiSelectField
                  key={name}
                  name={`target.${name}`}
                  label={REGISTER_MESSAGES.targetLabels[name]}
                  options={options[name]}
                />
              ))}
            </SurveySection>
            <SurveySection
              title={REGISTER_MESSAGES.livingConditions}
              summary={toSelectedSummary(livingCount)}
            >
              {LIVING_FIELDS.map((name) => (
                <SurveyMultiSelectField
                  key={name}
                  name={`target.${name}`}
                  label={REGISTER_MESSAGES.targetLabels[name]}
                  options={options[name]}
                />
              ))}
            </SurveySection>
          </div>
          <div className="flex flex-col gap-2">
            <p className="pl-0.5 text-caption-lg font-medium text-muted-foreground">
              {REGISTER_MESSAGES.freeConditionHint}
            </p>
            <SurveySection
              title={REGISTER_MESSAGES.targetDescription}
              summary={target.description ? REGISTER_MESSAGES.hasInput : undefined}
            >
              <SurveyTextField
                name="target.description"
                label={REGISTER_MESSAGES.targetDescription}
                placeholder={REGISTER_MESSAGES.targetDescriptionPlaceholder}
                limit={200}
                multiline
                hideLabel
              />
            </SurveySection>
          </div>
        </>
      )}
    </div>
  );
}
