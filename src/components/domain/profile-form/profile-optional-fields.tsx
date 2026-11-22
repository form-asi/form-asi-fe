"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { PROFILE_MESSAGES } from "./profile-messages";
import {
  CHILDREN_OPTIONS,
  DRIVING_LICENSE_OPTIONS,
  HOUSEHOLD_OPTIONS,
  HOUSEHOLD_SIZE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PET_EXPERIENCE_OPTIONS,
  PET_TYPE_OPTIONS,
  REGION_OPTIONS,
} from "./profile-options";
import { type ProfileValues } from "./profile-schema";
import { ProfileSelectField } from "./profile-select-field";

export function ProfileOptionalFields() {
  const { control } = useFormContext<ProfileValues>();
  const petExperience = useWatch({ control, name: "petExperience" });
  const hasPetExperience = petExperience === "PAST" || petExperience === "CURRENT";

  return (
    <>
      <ProfileSelectField name="region" label={PROFILE_MESSAGES.region} options={REGION_OPTIONS} />
      <ProfileSelectField
        name="household"
        label={PROFILE_MESSAGES.household}
        options={HOUSEHOLD_OPTIONS}
        otherFieldName="householdOther"
      />
      <ProfileSelectField
        name="householdSize"
        label={PROFILE_MESSAGES.householdSize}
        options={HOUSEHOLD_SIZE_OPTIONS}
      />
      <ProfileSelectField
        name="maritalStatus"
        label={PROFILE_MESSAGES.maritalStatus}
        options={MARITAL_STATUS_OPTIONS}
        otherFieldName="maritalStatusOther"
      />
      <ProfileSelectField
        name="children"
        label={PROFILE_MESSAGES.children}
        options={CHILDREN_OPTIONS}
      />
      <ProfileSelectField
        name="petExperience"
        label={PROFILE_MESSAGES.petExperience}
        options={PET_EXPERIENCE_OPTIONS}
      />
      {hasPetExperience && (
        <ProfileSelectField
          name="petTypes"
          label={PROFILE_MESSAGES.petTypes}
          options={PET_TYPE_OPTIONS}
          multiple
        />
      )}
      <ProfileSelectField
        name="drivingLicense"
        label={PROFILE_MESSAGES.drivingLicense}
        options={DRIVING_LICENSE_OPTIONS}
      />
    </>
  );
}
