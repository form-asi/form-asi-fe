import { getHelpTimeCost } from "@/features/my-survey/register/lib/survey-help-time-cost";
import {
  type SurveyRegisterValues,
  surveyRegisterSchema,
} from "@/features/my-survey/register/survey-register-schema";

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
  const helpTimeCost = getHelpTimeCost(validatedSurvey.data, helpTimeBalance);
  if (helpTimeCost.status === "incomplete") throw new Error("SURVEY_INVALID");
  if (helpTimeCost.status !== "affordable") throw new Error("HELP_TIME_INSUFFICIENT");
  helpTimeBalance -= helpTimeCost.requiredHelpTime;
  return { helpTimeBalance };
}
