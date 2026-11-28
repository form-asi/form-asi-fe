import { type BaseResponseUserProfileResponse } from "@/api/generated/models";
import { PROFILE_MESSAGES } from "@/components/domain/profile-form/profile-messages";
import { type ProfileValues, profileSchema } from "@/components/domain/profile-form/profile-schema";

/** @description 서버 프로필을 수정 폼의 나이·선택 항목으로 변환한다. */
export function parseCurrentProfile(response: BaseResponseUserProfileResponse): ProfileValues {
  const profile = response.data;
  if (!profile) throw new Error(PROFILE_MESSAGES.unknownError);
  const result = profileSchema.safeParse({
    nickname: profile.nickname,
    age: profile.age,
    gender: profile.gender ?? "",
    occupation: profile.occupation ?? "",
    occupationOther: profile.occupationOther ?? "",
    fields: profile.fields ?? [],
    fieldsOther: profile.fieldOther ?? "",
    region: profile.region ?? "",
    household: profile.householdComposition ?? "",
    householdOther: profile.householdCompositionOther ?? "",
    householdSize: profile.householdSize ?? "",
    maritalStatus: profile.maritalStatus ?? "",
    maritalStatusOther: profile.maritalStatusOther ?? "",
    children: profile.childrenCount ?? "",
    petExperience: profile.petExperience ?? "",
    petTypes: profile.pets ?? [],
    drivingLicense: profile.driverLicense ?? "",
  });
  if (!result.success) throw new Error(PROFILE_MESSAGES.unknownError);
  return result.data;
}
