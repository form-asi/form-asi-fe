"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { PROFILE_MESSAGES } from "@/components/domain/profile-form/profile-messages";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SurveyAgeFields } from "../components/survey-age-fields";
import { SurveyMultiSelectField } from "../components/survey-multi-select-field";
import { SurveySection } from "../components/survey-section";
import { SurveyTextField } from "../components/survey-text-field";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "../model/survey-register-messages";
import { type SurveyRegisterValues } from "../model/survey-register-schema";
import * as options from "../model/survey-target-options";

const BASIC_FIELDS = [
  { name: "gender", options: options.GENDER_OPTIONS },
  { name: "occupation", options: options.OCCUPATION_OPTIONS },
  { name: "fields", options: options.FIELD_OPTIONS },
] as const;
const LIVING_FIELDS = [
  { name: "region", options: options.REGION_OPTIONS },
  { name: "household", options: options.HOUSEHOLD_OPTIONS },
  { name: "householdSize", options: options.HOUSEHOLD_SIZE_OPTIONS },
  { name: "maritalStatus", options: options.MARITAL_STATUS_OPTIONS },
  { name: "children", options: options.CHILDREN_OPTIONS },
  { name: "petExperience", options: options.PET_EXPERIENCE_OPTIONS },
  { name: "petTypes", options: options.PET_TYPE_OPTIONS },
  { name: "drivingLicense", options: options.DRIVING_LICENSE_OPTIONS },
] as const;

export function SurveyTargetStep() {
  const { control } = useFormContext<SurveyRegisterValues>();
  const target = useWatch({ control, name: "target" });
  const hasAgeRange = target.minimumAge !== "" || target.maximumAge !== "";
  const basicCount =
    Number(hasAgeRange) + BASIC_FIELDS.filter(({ name }) => target[name].length > 0).length;
  const livingCount = LIVING_FIELDS.filter(({ name }) => target[name].length > 0).length;
  return (
    <>
      <SurveySection
        title={REGISTER_MESSAGES.basicConditions}
        summary={
          basicCount ? REGISTER_MESSAGES.selectedCount(basicCount) : REGISTER_MESSAGES.noRestriction
        }
      >
        <SurveyAgeFields />
        {BASIC_FIELDS.map(({ name, options: fieldOptions }) => (
          <SurveyMultiSelectField
            key={name}
            name={`target.${name}`}
            label={PROFILE_MESSAGES[name]}
            options={fieldOptions}
            placeholder={REGISTER_MESSAGES.noRestriction}
          />
        ))}
      </SurveySection>
      <SurveySection
        title={REGISTER_MESSAGES.livingConditions}
        summary={
          livingCount
            ? REGISTER_MESSAGES.selectedCount(livingCount)
            : REGISTER_MESSAGES.noRestriction
        }
      >
        {LIVING_FIELDS.map(({ name, options: fieldOptions }) => (
          <SurveyMultiSelectField
            key={name}
            name={`target.${name}`}
            label={PROFILE_MESSAGES[name]}
            options={fieldOptions}
            placeholder={REGISTER_MESSAGES.noRestriction}
          />
        ))}
      </SurveySection>
      <SurveySection
        title={REGISTER_MESSAGES.targetDescription}
        summary={target.description ? REGISTER_MESSAGES.hasInput : REGISTER_MESSAGES.noInput}
      >
        <SurveyTextField
          name="target.description"
          label={REGISTER_MESSAGES.targetDescription}
          limit={200}
          multiline
        />
      </SurveySection>
      <Alert variant="notice">
        <AlertDescription>{REGISTER_MESSAGES.targetHint}</AlertDescription>
      </Alert>
    </>
  );
}
