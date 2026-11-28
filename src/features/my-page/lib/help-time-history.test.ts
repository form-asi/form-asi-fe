import { test } from "bun:test";
import assert from "node:assert/strict";
import { type HelpTimeTransactionResponse } from "@/api/generated/models";
import { HELP_TIME_REASONS } from "@/features/my-page/help-time-history-messages";
import { parseHelpTimeHistory } from "./help-time-history";

const transaction: HelpTimeTransactionResponse = {
  createdAt: "2026-11-28T03:35:00Z",
  reason: HELP_TIME_REASONS.surveyRegistered,
  surveyTitle: "설문 제목",
  changeMinutes: -30,
  balanceAfter: -10,
};

test("서버의 내역 순서·잔액을 유지하며 적립·차감 부호와 사유 표시", () => {
  const history = parseHelpTimeHistory({
    data: {
      helpTimeMinutes: -10,
      items: [
        transaction,
        {
          ...transaction,
          reason: HELP_TIME_REASONS.signupBonus,
          changeMinutes: 20,
          balanceAfter: 20,
        },
      ],
    },
  });
  assert.equal(history.helpTimeBalance, -10);
  assert.deepEqual(
    history.entries.map(({ changeLabel, balanceLabel, reasonLabel }) => ({
      changeLabel,
      balanceLabel,
      reasonLabel,
    })),
    [
      { changeLabel: "−30분", balanceLabel: "−10분", reasonLabel: "설문 등록" },
      { changeLabel: "+20분", balanceLabel: "20분", reasonLabel: "가입 혜택" },
    ],
  );
});

test("제목이 없으면 생략하고 가입 혜택에만 유효기간 표시", () => {
  const history = parseHelpTimeHistory({
    data: {
      helpTimeMinutes: 0,
      items: [
        {
          ...transaction,
          reason: HELP_TIME_REASONS.signupBonus,
          surveyTitle: undefined,
          expiresAt: "2026-12-28T03:35:00Z",
        },
        { ...transaction, expiresAt: "2026-12-28T03:35:00Z" },
      ],
    },
  });
  assert.equal(history.entries[0]?.surveyTitle, null);
  const expiryDate = new Intl.DateTimeFormat("sv-SE")
    .format(new Date("2026-12-28T03:35:00Z"))
    .replaceAll("-", ".");
  assert.equal(history.entries[0]?.expiryLabel, `유효기간 ${expiryDate}까지`);
  assert.equal(history.entries[1]?.expiryLabel, null);
});

test("모르는 사유는 코드 그대로 표시하고 같은 시각의 UTC·오프셋 표현을 동일하게 표시", () => {
  const history = parseHelpTimeHistory({
    data: {
      helpTimeMinutes: 0,
      items: [
        { ...transaction, reason: "FUTURE_REFUND" },
        { ...transaction, createdAt: "2026-11-28T12:35:00+09:00" },
      ],
    },
  });
  assert.equal(history.entries[0]?.reasonLabel, "FUTURE_REFUND");
  assert.equal(history.entries[0]?.dateLabel, history.entries[1]?.dateLabel);
  assert.match(history.entries[0]?.dateLabel ?? "", /^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/);
});

test("빈 내역과 마이너스 잔액은 독립적으로 유지", () => {
  assert.deepEqual(parseHelpTimeHistory({ data: { helpTimeMinutes: -10, items: [] } }), {
    helpTimeBalance: -10,
    entries: [],
  });
});

test("필수 응답·날짜·금액이 잘못되면 가짜 내역 대신 오류 처리", () => {
  for (const response of [JSON.parse("null"), {}, { data: {} }, { data: { helpTimeMinutes: 0 } }])
    assert.throws(() => parseHelpTimeHistory(response), /UNKNOWN_ERROR/);
  for (const invalid of [
    { createdAt: undefined },
    { createdAt: "invalid" },
    { createdAt: "2026-02-30T00:00:00Z" },
    { reason: "" },
    { changeMinutes: undefined },
    { changeMinutes: 1.5 },
    { balanceAfter: undefined },
    { balanceAfter: NaN },
    { expiresAt: "invalid" },
  ]) {
    assert.throws(
      () =>
        parseHelpTimeHistory({
          data: { helpTimeMinutes: 0, items: [{ ...transaction, ...invalid }] },
        }),
      /UNKNOWN_ERROR/,
    );
  }
});
