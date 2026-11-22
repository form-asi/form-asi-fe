import { type SurveyRegisterValues } from "@/features/my-survey/register/survey-register-schema";

type SurveyScale = Partial<Pick<SurveyRegisterValues, "respondentCount" | "durationMinutes">>;

type CountedScale = { respondentCount: number; durationMinutes: number; requiredHelpTime: number };

export type HelpTimeCost =
  | { status: "incomplete" }
  | ({ status: "negativeBalance" } & CountedScale)
  | ({ status: "insufficient"; missingHelpTime: number } & CountedScale)
  | ({ status: "affordable" } & CountedScale);

/**
 * @description 필요한 도움 시간(소요 시간 × 응답 수)과 잔액으로 등록 가능 상태를 판정한다. 화면 안내용이며 최종 판정은 서버가 한다.
 */
export function getHelpTimeCost(scale: SurveyScale, helpTimeBalance: number): HelpTimeCost {
  const { respondentCount, durationMinutes } = scale;
  if (typeof respondentCount !== "number" || typeof durationMinutes !== "number") {
    return { status: "incomplete" };
  }

  const requiredHelpTime = respondentCount * durationMinutes;
  const isCountable = Number.isSafeInteger(requiredHelpTime) && requiredHelpTime > 0;
  if (!isCountable) return { status: "incomplete" };

  const countedScale = { respondentCount, durationMinutes, requiredHelpTime };
  if (helpTimeBalance < 0) return { status: "negativeBalance", ...countedScale };

  const missingHelpTime = requiredHelpTime - helpTimeBalance;
  if (missingHelpTime > 0) return { status: "insufficient", missingHelpTime, ...countedScale };
  return { status: "affordable", ...countedScale };
}
