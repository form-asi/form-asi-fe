import { type OnboardingRequest } from "@/api/generated/models";
import { toProfileUpdateRequest } from "@/components/domain/profile-form/profile-request";
import { type ProfileValues } from "@/components/domain/profile-form/profile-schema";

export function toOnboardingRequest(profile: ProfileValues): OnboardingRequest {
  return { ...toProfileUpdateRequest(profile), birthDate: profile.birthDate };
}
