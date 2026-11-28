import { test } from "bun:test";
import assert from "node:assert/strict";
import { parseNotificationEnabled } from "./notification-settings";

test("알림을 끈 상태도 정상 값으로 받아 사용", () => {
  assert.equal(parseNotificationEnabled({ data: { notificationEnabled: false } }), false);
  assert.equal(parseNotificationEnabled({ data: { notificationEnabled: true } }), true);
});

test("알림 설정이 누락되거나 boolean이 아니면 오류 처리", () => {
  for (const response of [
    JSON.parse("null"),
    {},
    { data: {} },
    JSON.parse('{"data":{"notificationEnabled":"false"}}'),
  ])
    assert.throws(() => parseNotificationEnabled(response), /UNKNOWN_ERROR/);
});
