import { z } from "zod";
import { PROFILE_MESSAGES } from "./profile-messages";
import {
  CHILDREN_OPTIONS,
  DRIVING_LICENSE_OPTIONS,
  FIELD_OPTIONS,
  GENDER_OPTIONS,
  HOUSEHOLD_OPTIONS,
  HOUSEHOLD_SIZE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  OCCUPATION_OPTIONS,
  PET_EXPERIENCE_OPTIONS,
  PET_TYPE_OPTIONS,
  REGION_OPTIONS,
} from "./profile-options";

export const nicknameSchema = z
  .string()
  .min(2, PROFILE_MESSAGES.nicknameLength)
  .max(10, PROFILE_MESSAGES.nicknameLength)
  .regex(/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/, PROFILE_MESSAGES.nicknameCharacters);

const otherTextSchema = z.string().max(20, PROFILE_MESSAGES.otherTooLong);

export const profileSchema = z
  .object({
    nickname: nicknameSchema,
    age: z.number().int().nonnegative(),
    gender: z
      .enum(["", ...GENDER_OPTIONS.map((option) => option.value)])
      .refine((gender): boolean => gender !== "", PROFILE_MESSAGES.requiredField),
    occupation: z
      .enum(["", ...OCCUPATION_OPTIONS.map((option) => option.value)])
      .refine((occupation): boolean => occupation !== "", PROFILE_MESSAGES.requiredField),
    occupationOther: otherTextSchema,
    fields: z
      .array(z.enum(FIELD_OPTIONS.map((option) => option.value)))
      .min(1, PROFILE_MESSAGES.requiredField),
    fieldsOther: otherTextSchema,
    region: z.enum(["", ...REGION_OPTIONS.map((option) => option.value)]),
    household: z.enum(["", ...HOUSEHOLD_OPTIONS.map((option) => option.value)]),
    householdOther: otherTextSchema,
    householdSize: z.enum(["", ...HOUSEHOLD_SIZE_OPTIONS.map((option) => option.value)]),
    maritalStatus: z.enum(["", ...MARITAL_STATUS_OPTIONS.map((option) => option.value)]),
    maritalStatusOther: otherTextSchema,
    children: z.enum(["", ...CHILDREN_OPTIONS.map((option) => option.value)]),
    petExperience: z.enum(["", ...PET_EXPERIENCE_OPTIONS.map((option) => option.value)]),
    petTypes: z.array(z.enum(PET_TYPE_OPTIONS.map((option) => option.value))),
    drivingLicense: z.enum(["", ...DRIVING_LICENSE_OPTIONS.map((option) => option.value)]),
  })
  .superRefine((profile, context) => {
    const otherFields = [
      [profile.occupation === "ETC", "occupationOther"],
      [profile.fields.includes("ETC"), "fieldsOther"],
      [profile.household === "ETC", "householdOther"],
      [profile.maritalStatus === "ETC", "maritalStatusOther"],
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

/** @description 서버에서 받은 나이만 채운 최초 프로필 입력값 */
export function createEmptyProfile(age: number): ProfileValues {
  return {
    nickname: "",
    age,
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
