import { MyHelpTimeFilter } from "@/api/generated/models";

export const HELP_TIME_REASONS = {
  signupBonus: "SIGNUP_BONUS_GRANTED",
  surveyRegistered: "SURVEY_REGISTERED",
} as const;

export const HELP_TIME_REASON_LABELS = new Map<string, string>([
  [HELP_TIME_REASONS.signupBonus, "가입 혜택"],
  [HELP_TIME_REASONS.surveyRegistered, "설문 등록"],
]);

export const HELP_TIME_FILTER_OPTIONS = [
  { code: MyHelpTimeFilter.ALL, label: "전체", emptyTitle: "아직 내역이 없어요" },
  { code: MyHelpTimeFilter.EARNED, label: "적립", emptyTitle: "적립 내역이 없어요" },
  { code: MyHelpTimeFilter.SPENT, label: "차감", emptyTitle: "차감 내역이 없어요" },
] as const;

export const HELP_TIME_HISTORY_MESSAGES = {
  title: "내 도움 시간 내역",
  filterLabel: "도움 시간 내역 필터",
  loading: "도움 시간 내역을 불러오는 중이에요",
  loadFailed: "도움 시간 내역을 불러오지 못했어요",
  emptyDescription: "도움 시간이 쌓이거나 사용되면 여기에 표시돼요",
  negativeBalance: "도움 시간이 마이너스예요. 마이너스인 동안은 설문을 올릴 수 없어요.",
  balanceAfter: "변동 후 잔액",
  expiresOn: (date: string) => `유효기간 ${date}까지`,
} as const;
