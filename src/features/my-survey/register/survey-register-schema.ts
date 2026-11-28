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
import {
  ETC_OPTION_VALUE,
  SURVEY_FORMAT_OPTIONS,
  SURVEY_PURPOSE_OPTIONS,
} from "@/features/my-survey/register/survey-info-options";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";

// shortcut: 디자인에 1~20분까지만 보여 30분 이후는 기존 목록 유지, 기획 확정 후 갱신
export const SURVEY_DURATION_MINUTES = [1, 3, 5, 10, 15, 20, 30, 40, 50, 60] as const;
export const ETC_TEXT_LIMIT = 20;

/** 하나를 고르고, "기타"면 직접 입력이 필요한 항목 */
function choiceWithEtc<Code extends string>(options: readonly { value: Code }[]) {
  return z
    .object({
      code: z.union([z.literal(""), z.enum(options.map((option) => option.value))]),
      etcText: z.string().max(ETC_TEXT_LIMIT, REGISTER_MESSAGES.lengthError(ETC_TEXT_LIMIT)),
    })
    .superRefine((choice, context) => {
      if (choice.code === "") {
        context.addIssue({
          code: "custom",
          path: ["code"],
          message: REGISTER_MESSAGES.requiredError,
        });
      }
      const isEtcTextMissing = choice.code === ETC_OPTION_VALUE && choice.etcText.trim() === "";
      if (isEtcTextMissing) {
        context.addIssue({
          code: "custom",
          path: ["etcText"],
          message: REGISTER_MESSAGES.requiredError,
        });
      }
    });
}

const requiredText = (limit: number) =>
  z
    .string()
    .max(limit, REGISTER_MESSAGES.lengthError(limit))
    .refine((text) => text.trim().length > 0, REGISTER_MESSAGES.requiredError);
const optionalAge = z.union([
  z.literal(""),
  z
    .number()
    .int(REGISTER_MESSAGES.integerError)
    .min(14, REGISTER_MESSAGES.ageMinimumError)
    .max(100, REGISTER_MESSAGES.ageMaximumError),
]);
export const TARGET_AUDIENCES = ["ANYONE", "CONDITIONAL"] as const;
export type TargetAudience = (typeof TARGET_AUDIENCES)[number];

const targetSchema = z
  .object({
    audience: z.enum(TARGET_AUDIENCES),
    minimumAge: optionalAge,
    maximumAge: optionalAge,
    gender: z.array(z.enum(OnboardingRequestGender)),
    occupation: z.array(
      z.enum(OnboardingRequestOccupation).exclude([OnboardingRequestOccupation.OTHER]),
    ),
    fields: z.array(
      z.enum(OnboardingRequestFieldsItem).exclude([OnboardingRequestFieldsItem.OTHER]),
    ),
    region: z.array(z.enum(OnboardingRequestRegion)),
    household: z.array(
      z
        .enum(OnboardingRequestHouseholdComposition)
        .exclude([OnboardingRequestHouseholdComposition.OTHER]),
    ),
    householdSize: z.array(z.enum(OnboardingRequestHouseholdSize)),
    maritalStatus: z.array(
      z.enum(OnboardingRequestMaritalStatus).exclude([OnboardingRequestMaritalStatus.OTHER]),
    ),
    children: z.array(z.enum(OnboardingRequestChildrenCount)),
    petExperience: z.array(z.enum(OnboardingRequestPetExperience)),
    petTypes: z.array(z.enum(OnboardingRequestPetsItem).exclude([OnboardingRequestPetsItem.OTHER])),
    drivingLicense: z.array(z.enum(OnboardingRequestDriverLicense)),
    description: z.string().max(200, REGISTER_MESSAGES.lengthError(200)),
  })
  .superRefine((target, context) => {
    if (
      target.minimumAge !== "" &&
      target.maximumAge !== "" &&
      target.minimumAge > target.maximumAge
    ) {
      context.addIssue({
        code: "custom",
        path: ["minimumAge"],
        message: REGISTER_MESSAGES.ageOrderError,
      });
    }
  });

export const surveyRegisterSchema = z.object({
  surveyUrl: z
    .string()
    .startsWith("https://", REGISTER_MESSAGES.surveyUrlError)
    .pipe(z.url({ protocol: /^https$/, error: REGISTER_MESSAGES.surveyUrlError })),
  purpose: choiceWithEtc(SURVEY_PURPOSE_OPTIONS),
  format: choiceWithEtc(SURVEY_FORMAT_OPTIONS),
  target: targetSchema,
  title: requiredText(100),
  description: requiredText(700),
  reward: z.string().max(100, REGISTER_MESSAGES.lengthError(100)),
  respondentCount: z
    .union([
      z.literal(""),
      z
        .number()
        .int(REGISTER_MESSAGES.integerError)
        .min(1, REGISTER_MESSAGES.respondentMinimumError),
    ])
    .refine((count): boolean => count !== "", REGISTER_MESSAGES.requiredError),
  durationMinutes: z
    .union([z.literal(""), z.number()])
    .refine(
      (minutes) => SURVEY_DURATION_MINUTES.some((duration) => duration === minutes),
      REGISTER_MESSAGES.requiredError,
    ),
});

export type SurveyRegisterValues = z.infer<typeof surveyRegisterSchema>;
export type SurveyRegisterStep = "info" | "target" | "intro" | "scale";

export const SURVEY_STEP_FIELDS = {
  info: ["surveyUrl", "purpose", "format"],
  target: ["target"],
  intro: ["title", "description", "reward"],
  scale: ["respondentCount", "durationMinutes"],
} as const;

const stepSchemas = {
  info: surveyRegisterSchema.pick({ surveyUrl: true, purpose: true, format: true }),
  target: surveyRegisterSchema.pick({ target: true }),
  intro: surveyRegisterSchema.pick({ title: true, description: true, reward: true }),
  scale: surveyRegisterSchema.pick({ respondentCount: true, durationMinutes: true }),
};

export function isSurveyStepValid(step: SurveyRegisterStep, draft: unknown) {
  return stepSchemas[step].safeParse(draft).success;
}

export function createEmptyTarget(): SurveyRegisterValues["target"] {
  return {
    audience: "ANYONE",
    minimumAge: "",
    maximumAge: "",
    gender: [],
    occupation: [],
    fields: [],
    region: [],
    household: [],
    householdSize: [],
    maritalStatus: [],
    children: [],
    petExperience: [],
    petTypes: [],
    drivingLicense: [],
    description: "",
  };
}

export function createEmptySurvey(): SurveyRegisterValues {
  return {
    surveyUrl: "",
    purpose: { code: "", etcText: "" },
    format: { code: "", etcText: "" },
    title: "",
    description: "",
    reward: "",
    respondentCount: "",
    durationMinutes: "",
    target: createEmptyTarget(),
  };
}

export const SURVEY_STEPS = {
  info: { number: 1, previous: null, next: "target" },
  target: { number: 2, previous: "info", next: "intro" },
  intro: { number: 3, previous: "target", next: "scale" },
  scale: { number: 4, previous: "intro", next: null },
} satisfies Record<
  SurveyRegisterStep,
  { number: number; previous: SurveyRegisterStep | null; next: SurveyRegisterStep | null }
>;
