import { z } from "zod";
import {
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
import dayjs from "@/lib/dayjs";
import { PROFILE_MESSAGES } from "./profile-messages";

export const nicknameSchema = z
  .string()
  .min(1, PROFILE_MESSAGES.requiredField)
  .min(2, PROFILE_MESSAGES.nicknameTooShort)
  .max(10, PROFILE_MESSAGES.nicknameTooLong)
  .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/, PROFILE_MESSAGES.nicknameCharacters);

const otherTextSchema = z.string().max(20, PROFILE_MESSAGES.otherTooLong);
const birthDateSchema = z
  .string()
  .min(1, PROFILE_MESSAGES.requiredField)
  .pipe(z.iso.date({ error: PROFILE_MESSAGES.birthDateInvalid }))
  .refine(
    (birthDate) => birthDate <= dayjs().format("YYYY-MM-DD"),
    PROFILE_MESSAGES.birthDateFuture,
  );

export const profileSchema = z
  .object({
    nickname: nicknameSchema,
    gender: z
      .enum(["", ...Object.values(OnboardingRequestGender)])
      .refine((gender): boolean => gender !== "", PROFILE_MESSAGES.requiredField),
    occupation: z
      .enum(["", ...Object.values(OnboardingRequestOccupation)])
      .refine((occupation): boolean => occupation !== "", PROFILE_MESSAGES.requiredField),
    occupationOther: otherTextSchema,
    fields: z.array(z.enum(OnboardingRequestFieldsItem)).min(1, PROFILE_MESSAGES.requiredField),
    fieldsOther: otherTextSchema,
    region: z.enum(["", ...Object.values(OnboardingRequestRegion)]),
    household: z.enum(["", ...Object.values(OnboardingRequestHouseholdComposition)]),
    householdOther: otherTextSchema,
    householdSize: z.enum(["", ...Object.values(OnboardingRequestHouseholdSize)]),
    maritalStatus: z.enum(["", ...Object.values(OnboardingRequestMaritalStatus)]),
    maritalStatusOther: otherTextSchema,
    children: z.enum(["", ...Object.values(OnboardingRequestChildrenCount)]),
    petExperience: z.enum(["", ...Object.values(OnboardingRequestPetExperience)]),
    petTypes: z.array(z.enum(OnboardingRequestPetsItem)),
    drivingLicense: z.enum(["", ...Object.values(OnboardingRequestDriverLicense)]),
  })
  .and(
    z.union([
      z.object({ birthDate: birthDateSchema, age: z.never().optional() }),
      z.object({ age: z.number().int().nonnegative(), birthDate: z.never().optional() }),
    ]),
  )
  .superRefine((profile, context) => {
    const otherFields = [
      [profile.occupation === OnboardingRequestOccupation.OTHER, "occupationOther"],
      [profile.fields.includes(OnboardingRequestFieldsItem.OTHER), "fieldsOther"],
      [profile.household === OnboardingRequestHouseholdComposition.OTHER, "householdOther"],
      [profile.maritalStatus === OnboardingRequestMaritalStatus.OTHER, "maritalStatusOther"],
    ] as const;

    for (const [requiresOtherText, fieldName] of otherFields) {
      if (requiresOtherText && !profile[fieldName].trim()) {
        context.addIssue({
          code: "custom",
          path: [fieldName],
          message: PROFILE_MESSAGES.requiredField,
        });
      }
    }
  });

export type ProfileValues = z.infer<typeof profileSchema>;

/** @description 저장된 나이가 없으면 생년월일을 직접 입력하는 최초 프로필 값 */
export function createEmptyProfile(age?: number): ProfileValues {
  return {
    nickname: "",
    ...(age === undefined ? { birthDate: "" } : { age }),
    gender: "",
    occupation: "",
    occupationOther: "",
    fields: [],
    fieldsOther: "",
    region: "",
    household: "",
    householdOther: "",
    householdSize: "",
    maritalStatus: "",
    maritalStatusOther: "",
    children: "",
    petExperience: "",
    petTypes: [],
    drivingLicense: "",
  };
}
