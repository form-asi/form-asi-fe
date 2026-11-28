import { test } from "bun:test";
import assert from "node:assert/strict";
import { parseMyPageSummary } from "./my-page-summary";

test("홈은 서버 닉네임과 잔액을 그대로 사용하고 0분·음수를 허용", () => {
  for (const helpTimeMinutes of [-5, 0, 4, 5, 90]) {
    assert.deepEqual(parseMyPageSummary({ data: { nickname: "테스트1", helpTimeMinutes } }), {
      nickname: "테스트1",
      helpTimeBalance: helpTimeMinutes,
    });
  }
});

test("홈 필수 응답 누락·잘못된 잔액을 UNKNOWN_ERROR로 처리", () => {
  for (const response of [
    {},
    { data: { helpTimeMinutes: 10 } },
    { data: { nickname: " " } },
    { data: { nickname: "테스트1", helpTimeMinutes: NaN } },
    { data: { nickname: "테스트1", helpTimeMinutes: 1.5 } },
  ]) {
    assert.throws(() => parseMyPageSummary(response), /UNKNOWN_ERROR/);
  }
});
