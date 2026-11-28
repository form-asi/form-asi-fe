"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { OnboardingRequestPetExperience } from "@/api/generated/models";
import { PROFILE_MESSAGES } from "./profile-messages";
import { type ProfileOptions } from "./profile-options-schema";
import { type ProfileValues } from "./profile-schema";
import { ProfileSelectField } from "./profile-select-field";

export function ProfileOptionalFields({ options }: { options: ProfileOptions }) {
  const { control } = useFormContext<ProfileValues>();
  const petExperience = useWatch({ control, name: "petExperience" });
  const hasPetExperience =
    petExperience === OnboardingRequestPetExperience.PAST ||
    petExperience === OnboardingRequestPetExperience.CURRENT;

  return (
    <>
      <ProfileSelectField name="region" label={PROFILE_MESSAGES.region} options={options.regions} />
      <ProfileSelectField
        name="household"
        label={PROFILE_MESSAGES.household}
        options={options.householdCompositions}
        otherFieldName="householdOther"
      />
      <ProfileSelectField
        name="householdSize"
        label={PROFILE_MESSAGES.householdSize}
        options={options.householdSizes}
      />
      <ProfileSelectField
        name="maritalStatus"
        label={PROFILE_MESSAGES.maritalStatus}
        options={options.maritalStatuses}
        otherFieldName="maritalStatusOther"
      />
      <ProfileSelectField
        name="children"
        label={PROFILE_MESSAGES.children}
        options={options.childrenCounts}
      />
      <ProfileSelectField
        name="petExperience"
        label={PROFILE_MESSAGES.petExperience}
        options={options.petExperiences}
      />
      {hasPetExperience && (
        <ProfileSelectField
          name="petTypes"
          label={PROFILE_MESSAGES.petTypes}
          options={options.petTypes}
          multiple
        />
      )}
      <ProfileSelectField
        name="drivingLicense"
        label={PROFILE_MESSAGES.drivingLicense}
        options={options.driverLicenses}
      />
    </>
  );
}
