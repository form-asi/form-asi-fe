export const MY_PAGE_MESSAGES = {
  title: "마이페이지",
  editProfile: "프로필 수정",
  helpTime: "내 도움 시간",
  surveyCount: (count: number) => `5분짜리 설문 ${count}개를 모을 수 있어요`,
  settings: "설정",
  loading: "내 정보를 불러오는 중이에요",
  loadFailed: "내 정보를 불러오지 못했어요",
  unknownError: "UNKNOWN_ERROR",
} as const;
