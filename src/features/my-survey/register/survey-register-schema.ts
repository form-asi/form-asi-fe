import { z } from "zod";
import { SURVEY_PURPOSE_OPTIONS } from "@/features/my-survey/register/survey-purpose-options";
import { SURVEY_REGISTER_MESSAGES as REGISTER_MESSAGES } from "@/features/my-survey/register/survey-register-messages";
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
} from "@/features/my-survey/register/survey-target-options";

export const SURVEY_DURATION_MINUTES = [1, 2, 3, 5, 7, 10, 15, 20, 30, 40, 50, 60] as const;
const optionalAge = z.union([
  z.literal(""),
  z
    .number()
    .int(REGISTER_MESSAGES.integerError)
    .min(14, REGISTER_MESSAGES.ageMinimumError)
    .max(100, REGISTER_MESSAGES.ageMaximumError),
]);
const targetSchema = z
  .object({
    minimumAge: optionalAge,
    maximumAge: optionalAge,
    gender: z.array(z.enum(GENDER_OPTIONS.map((option) => option.value))),
    occupation: z.array(z.enum(OCCUPATION_OPTIONS.map((option) => option.value))),
    fields: z.array(z.enum(FIELD_OPTIONS.map((option) => option.value))),
    region: z.array(z.enum(REGION_OPTIONS.map((option) => option.value))),
    household: z.array(z.enum(HOUSEHOLD_OPTIONS.map((option) => option.value))),
    householdSize: z.array(z.enum(HOUSEHOLD_SIZE_OPTIONS.map((option) => option.value))),
    maritalStatus: z.array(z.enum(MARITAL_STATUS_OPTIONS.map((option) => option.value))),
    children: z.array(z.enum(CHILDREN_OPTIONS.map((option) => option.value))),
    petExperience: z.array(z.enum(PET_EXPERIENCE_OPTIONS.map((option) => option.value))),
    petTypes: z.array(z.enum(PET_TYPE_OPTIONS.map((option) => option.value))),
    drivingLicense: z.array(z.enum(DRIVING_LICENSE_OPTIONS.map((option) => option.value))),
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
  surveyUrl: z.string().startsWith("https://", REGISTER_MESSAGES.surveyUrlError),
  purposes: z
    .array(z.enum(SURVEY_PURPOSE_OPTIONS.map((option) => option.value)))
    .min(1, REGISTER_MESSAGES.requiredError),
  target: targetSchema,
  title: z
    .string()
    .max(100, REGISTER_MESSAGES.lengthError(100))
    .refine((title) => title.trim().length > 0, REGISTER_MESSAGES.requiredError),
  description: z.string().max(700, REGISTER_MESSAGES.lengthError(700)),
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
  info: ["surveyUrl", "purposes"],
  target: ["target"],
  intro: ["title", "description", "reward"],
  scale: ["respondentCount", "durationMinutes"],
} as const;

const stepSchemas = {
  info: surveyRegisterSchema.pick({ surveyUrl: true, purposes: true }),
  target: surveyRegisterSchema.pick({ target: true }),
  intro: surveyRegisterSchema.pick({ title: true, description: true, reward: true }),
  scale: surveyRegisterSchema.pick({ respondentCount: true, durationMinutes: true }),
};

export function isSurveyStepValid(step: SurveyRegisterStep, draft: unknown) {
  return stepSchemas[step].safeParse(draft).success;
}

export function createEmptySurvey(): SurveyRegisterValues {
  return {
    surveyUrl: "",
    purposes: [],
    title: "",
    description: "",
    reward: "",
    respondentCount: "",
    durationMinutes: "",
    target: {
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
    },
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
