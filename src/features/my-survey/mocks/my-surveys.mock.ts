import { type SurveyCreateResponseStatus } from "@/api/generated/models";

type SurveyId = number;

export type MySurveySummary = {
  surveyId: SurveyId;
  title: string;
  status: SurveyCreateResponseStatus;
  targetRespondentCount: number;
  confirmedRespondentCount: number;
  answeringRespondentCount: number;
};

// shortcut: 서버에 내 설문 목록 API가 없어 데모용 고정 데이터, 목록 API가 나오면 Orval 훅으로 교체
export const MY_SURVEYS_MOCK: MySurveySummary[] = [
  {
    surveyId: 3,
    title: "대학생 아침 식사 습관 조사",
    status: "OPEN",
    targetRespondentCount: 10,
    confirmedRespondentCount: 4,
    answeringRespondentCount: 2,
  },
  {
    surveyId: 2,
    title: "1인 가구 반려동물 양육 경험 설문",
    status: "OPEN",
    targetRespondentCount: 10,
    confirmedRespondentCount: 10,
    answeringRespondentCount: 0,
  },
  {
    surveyId: 1,
    title: "캠퍼스 공유 킥보드 이용 만족도",
    status: "CLOSED",
    targetRespondentCount: 10,
    confirmedRespondentCount: 8,
    answeringRespondentCount: 0,
  },
];
