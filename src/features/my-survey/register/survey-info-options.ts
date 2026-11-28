import { SurveyCreateRequestMethod, SurveyCreateRequestPurpose } from "@/api/generated/models";

export const SURVEY_PURPOSE_OPTIONS = [
  { value: SurveyCreateRequestPurpose.SCHOOL_ASSIGNMENT, label: "학교 과제" },
  { value: SurveyCreateRequestPurpose.ACADEMIC_RESEARCH, label: "학위·학술 연구" },
  {
    value: SurveyCreateRequestPurpose.CONTEST_ACTIVITY_OR_CAREER,
    label: "공모전·대외활동·취업 준비",
  },
  {
    value: SurveyCreateRequestPurpose.STARTUP_MARKET_OR_CONSUMER_RESEARCH,
    label: "창업·시장·소비자 조사",
  },
  { value: SurveyCreateRequestPurpose.OTHER, label: "기타" },
] as const;

export const SURVEY_FORMAT_OPTIONS = [
  { value: SurveyCreateRequestMethod.MULTIPLE_CHOICE, label: "객관식 중심의 단순 설문" },
  { value: SurveyCreateRequestMethod.OPEN_ENDED, label: "주관식·장문 위주 (인터뷰 대체)" },
  {
    value: SurveyCreateRequestMethod.PARTICIPATORY,
    label: "참여형 (사용성 테스트, 서비스 체험 후 응답 등)",
  },
  {
    value: SurveyCreateRequestMethod.EXPERIMENT_OR_TASK,
    label: "실험·과제형 (영상 시청, 시나리오 수행 후 응답 등)",
  },
  { value: SurveyCreateRequestMethod.OTHER, label: "기타" },
] as const;

export const ETC_OPTION_VALUE = SurveyCreateRequestPurpose.OTHER;
