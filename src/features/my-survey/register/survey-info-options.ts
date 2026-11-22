// shortcut: 디자인 메모 기준 선택지와 임시 코드, API 명세 확정 후 백엔드 enum 값으로 교체
export const SURVEY_PURPOSE_OPTIONS = [
  { value: "SCHOOL_ASSIGNMENT", label: "학교 과제" },
  { value: "ACADEMIC_RESEARCH", label: "학위·학술 연구" },
  { value: "CONTEST_CAREER", label: "공모전·대외활동·취업 준비" },
  { value: "MARKET_RESEARCH", label: "창업·시장·소비자 조사" },
  { value: "ETC", label: "기타" },
] as const;

export const SURVEY_FORMAT_OPTIONS = [
  { value: "SIMPLE_CHOICE", label: "객관식 중심의 단순 설문" },
  { value: "OPEN_ENDED", label: "주관식·장문 위주 (인터뷰 대체)" },
  { value: "PARTICIPATORY", label: "참여형 (사용성 테스트, 서비스 체험 후 응답 등)" },
  { value: "EXPERIMENT", label: "실험·과제형 (영상 시청, 시나리오 수행 후 응답 등)" },
  { value: "ETC", label: "기타" },
] as const;

export const ETC_OPTION_VALUE = "ETC";
