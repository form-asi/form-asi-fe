export const KAKAO_LOGIN_MESSAGES = {
  title: "폼앗이",
  logoPlaceholder: "로고 심볼",
  copyPlaceholder: "카피 - 추후 지정",
  continueWithKakao: "카카오로 계속하기",
  failed: "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.",
} as const;

const LOGIN_ERRORS = new Map([
  [
    "UNDER_MINIMUM_AGE",
    "만 14세 미만은 가입할 수 없어요.\n법정대리인 동의가 필요한 나이라서 서비스를 이용할 수 없어요.",
  ],
  ["KAKAO_LOGIN_CANCELLED", "카카오 로그인이 취소됐어요. 다시 시도해 주세요."],
  ["OAUTH_STATE_INVALID", "로그인 요청이 만료됐어요. 카카오 로그인을 처음부터 다시 시작해 주세요."],
  ["KAKAO_AUTH_UNAVAILABLE", "카카오 로그인에 연결할 수 없어요. 잠시 후 다시 시도해 주세요."],
  ["BIRTH_DATE_UNAVAILABLE", "생년월일을 확인할 수 없어요. 유효한 생년월일을 입력해 주세요."],
  ["ACCOUNT_SUSPENDED", "정지된 계정이에요. 서비스를 이용할 수 없어요."],
  ["ACCOUNT_WITHDRAWN", "탈퇴한 계정이에요. 서비스를 이용할 수 없어요."],
]);

export function getLoginErrorMessage(errorCode: string | null) {
  return errorCode === null ? null : (LOGIN_ERRORS.get(errorCode) ?? KAKAO_LOGIN_MESSAGES.failed);
}
