import {
  OnboardingRequestFieldsItem,
  OnboardingRequestHouseholdComposition,
  OnboardingRequestMaritalStatus,
  OnboardingRequestOccupation,
  OnboardingRequestPetsItem,
} from "@/api/generated/models";
import { type ProfileOptions } from "@/components/domain/profile-form/profile-options-schema";

export function getSurveyTargetOptions(options: ProfileOptions) {
  return {
    gender: options.genders,
    occupation: options.occupations.filter(
      ({ value }) => value !== OnboardingRequestOccupation.OTHER,
    ),
    fields: options.fields.filter(({ value }) => value !== OnboardingRequestFieldsItem.OTHER),
    region: options.regions,
    household: options.householdCompositions.filter(
      ({ value }) => value !== OnboardingRequestHouseholdComposition.OTHER,
    ),
    householdSize: options.householdSizes,
    maritalStatus: options.maritalStatuses.filter(
      ({ value }) => value !== OnboardingRequestMaritalStatus.OTHER,
    ),
    children: options.childrenCounts,
    petExperience: options.petExperiences,
    petTypes: options.petTypes.filter(({ value }) => value !== OnboardingRequestPetsItem.OTHER),
    drivingLicense: options.driverLicenses,
  };
}

export type SurveyTargetOptions = ReturnType<typeof getSurveyTargetOptions>;
