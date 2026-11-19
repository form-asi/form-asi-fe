import {
  type SurveyRegisterValues,
  surveyRegisterSchema,
} from "@/features/my-survey/register/model/survey-register-schema";

// shortcut: 새로고침 시 초기화되는 잔액·등록 mock, API 명세 확정 후 Orval 훅으로 교체
let helpTimeBalance = 30;
const waitForMockResponse = () => new Promise((resolve) => setTimeout(resolve, 200));

export async function getHelpTimeBalanceMock() {
  await waitForMockResponse();
  return helpTimeBalance;
}

export async function publishSurveyMock(survey: SurveyRegisterValues) {
  await waitForMockResponse();
  const validatedSurvey = surveyRegisterSchema.safeParse(survey);
  if (!validatedSurvey.success) throw new Error("SURVEY_INVALID");
  const { respondentCount, durationMinutes } = validatedSurvey.data;
  if (typeof respondentCount !== "number" || typeof durationMinutes !== "number") {
    throw new Error("SURVEY_INVALID");
  }
  const requiredHelpTime = respondentCount * durationMinutes;
  if (!Number.isSafeInteger(requiredHelpTime) || requiredHelpTime <= 0) {
    throw new Error("SURVEY_INVALID");
  }
  if (helpTimeBalance < 0 || helpTimeBalance < requiredHelpTime) {
    throw new Error("HELP_TIME_INSUFFICIENT");
  }
  helpTimeBalance -= requiredHelpTime;
  return { helpTimeBalance };
}
