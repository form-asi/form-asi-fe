import { expect, test } from "bun:test";
import { getLoginErrorMessage, KAKAO_LOGIN_MESSAGES } from "./kakao-login-messages";

test("오류가 없으면 안내 없이, 미정의·빈 코드는 공통 실패 문구 표시", () => {
  expect(getLoginErrorMessage(null)).toBeNull();
  for (const errorCode of ["", "INTERNAL_SERVER_ERROR", "UNKNOWN", "__proto__"]) {
    expect(getLoginErrorMessage(errorCode)).toBe(KAKAO_LOGIN_MESSAGES.failed);
  }
});

test("만 14세 미만·취소·만료·연결 실패·생년월일·제한 계정 안내", () => {
  expect(getLoginErrorMessage("UNDER_MINIMUM_AGE")).toContain("법정대리인 동의");
  for (const errorCode of [
    "KAKAO_LOGIN_CANCELLED",
    "OAUTH_STATE_INVALID",
    "KAKAO_AUTH_UNAVAILABLE",
    "BIRTH_DATE_UNAVAILABLE",
    "ACCOUNT_SUSPENDED",
    "ACCOUNT_WITHDRAWN",
  ]) {
    expect(getLoginErrorMessage(errorCode)).not.toBe(KAKAO_LOGIN_MESSAGES.failed);
  }
});
