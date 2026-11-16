export const UI_MESSAGES = {
  comingSoon: "준비 중",
  back: "뒤로 가기",
  mainNavigation: "주요 메뉴",
  optionalField: "선택",
  invalidField: "입력 내용을 확인해 주세요",
  notifications: "알림",
  retry: "다시 시도",
  toast: {
    saved: "저장했어요",
    surveyPublished: "설문을 올렸어요",
    helpTimeEarned: (minutes: number) => `${minutes}분이 쌓였어요`,
  },
  emptyState: {
    noSurveys: {
      title: "지금 모집 중인 설문이 없어요",
      description: "잠시 뒤에 다시 확인해 주세요",
    },
    noMatches: {
      title: "조건에 맞는 설문이 없어요",
      description: "필터를 바꿔 보세요",
    },
    loadFailed: {
      title: "불러오지 못했어요",
      description: "네트워크를 확인하고 다시 시도해 주세요",
    },
  },
} as const;
