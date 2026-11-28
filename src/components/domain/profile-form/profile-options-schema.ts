import { z } from "zod";
import {
  type BaseResponseProfileOptionsResponse,
  OnboardingRequestChildrenCount,
  OnboardingRequestDriverLicense,
  OnboardingRequestFieldsItem,
  OnboardingRequestGender,
  OnboardingRequestHouseholdComposition,
  OnboardingRequestHouseholdSize,
  OnboardingRequestMaritalStatus,
  OnboardingRequestOccupation,
  OnboardingRequestPetExperience,
  OnboardingRequestPetsItem,
  OnboardingRequestRegion,
} from "@/api/generated/models";
import { PROFILE_MESSAGES } from "./profile-messages";

function choices<Codes extends Record<string, string>>(codes: Codes) {
  return z
    .array(
      z
        .object({ code: z.enum(codes), label: z.string().min(1) })
        .transform(({ code, label }) => ({ value: code, label })),
    )
    .min(1);
}

const profileOptionsSchema = z.object({
  genders: choices(OnboardingRequestGender),
  occupations: choices(OnboardingRequestOccupation),
  fields: choices(OnboardingRequestFieldsItem),
  regions: choices(OnboardingRequestRegion),
  householdCompositions: choices(OnboardingRequestHouseholdComposition),
  householdSizes: choices(OnboardingRequestHouseholdSize),
  maritalStatuses: choices(OnboardingRequestMaritalStatus),
  childrenCounts: choices(OnboardingRequestChildrenCount),
  petExperiences: choices(OnboardingRequestPetExperience),
  petTypes: choices(OnboardingRequestPetsItem),
  driverLicenses: choices(OnboardingRequestDriverLicense),
});

export type ProfileOptions = z.infer<typeof profileOptionsSchema>;

/** @description 서버 선택지 코드·라벨을 검증하고 SelectSheet 형식으로 전달한다. */
export function parseProfileOptions(response: BaseResponseProfileOptionsResponse): ProfileOptions {
  const result = profileOptionsSchema.safeParse(response.data);
  if (!result.success) throw new Error(PROFILE_MESSAGES.unknownError);
  return result.data;
}
