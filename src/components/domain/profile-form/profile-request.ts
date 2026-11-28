import {
  OnboardingRequestFieldsItem,
  OnboardingRequestHouseholdComposition,
  OnboardingRequestMaritalStatus,
  OnboardingRequestOccupation,
  OnboardingRequestPetExperience,
  type ProfileUpdateRequest,
} from "@/api/generated/models";
import { PROFILE_MESSAGES } from "@/components/domain/profile-form/profile-messages";
import { type ProfileValues, profileSchema } from "@/components/domain/profile-form/profile-schema";

/** @description 온보딩·수정의 프로필 항목 매핑. 숨겨진 기타 입력과 반려동물 종류는 제외한다. */
export function toProfileUpdateRequest(profile: ProfileValues): ProfileUpdateRequest {
  const validatedProfile = profileSchema.parse(profile);
  const { gender, occupation, petExperience } = validatedProfile;
  if (gender === "" || occupation === "") throw new Error(PROFILE_MESSAGES.requiredField);
  const hasPetExperience =
    petExperience === OnboardingRequestPetExperience.PAST ||
    petExperience === OnboardingRequestPetExperience.CURRENT;
  return {
    nickname: validatedProfile.nickname,
    gender,
    occupation,
    occupationOther:
      occupation === OnboardingRequestOccupation.OTHER
        ? validatedProfile.occupationOther
        : undefined,
    fields: validatedProfile.fields,
    fieldOther: validatedProfile.fields.includes(OnboardingRequestFieldsItem.OTHER)
      ? validatedProfile.fieldsOther
      : undefined,
    region: validatedProfile.region || undefined,
    householdComposition: validatedProfile.household || undefined,
    householdCompositionOther:
      validatedProfile.household === OnboardingRequestHouseholdComposition.OTHER
        ? validatedProfile.householdOther
        : undefined,
    householdSize: validatedProfile.householdSize || undefined,
    maritalStatus: validatedProfile.maritalStatus || undefined,
    maritalStatusOther:
      validatedProfile.maritalStatus === OnboardingRequestMaritalStatus.OTHER
        ? validatedProfile.maritalStatusOther
        : undefined,
    childrenCount: validatedProfile.children || undefined,
    petExperience: petExperience || undefined,
    pets: hasPetExperience ? validatedProfile.petTypes : [],
    driverLicense: validatedProfile.drivingLicense || undefined,
  };
}
