export const MY_SURVEY_MESSAGES = {
  title: "내 설문",
  statusLabels: { recruiting: "모집 중", goalReached: "목표 달성", closed: "마감" },
  respondentProgress: (target: number, confirmed: number, answering: number) =>
    answering > 0
      ? `${target}명 중 ${confirmed}명 확정 · ${answering}명 참여 중`
      : `${target}명 중 ${confirmed}명 확정`,
  closedShortfall: (shortfall: number) => `목표보다 ${shortfall}명 모자란 채로 마감했어요`,
} as const;
