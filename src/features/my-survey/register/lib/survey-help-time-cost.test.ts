import { test } from "bun:test";
import assert from "node:assert/strict";
import { parseDigitsInput } from "@/features/my-survey/register/lib/parse-digits-input";
import { getHelpTimeCost } from "@/features/my-survey/register/lib/survey-help-time-cost";

test("숫자 입력은 숫자·빈 값만 받음", () => {
  assert.deepEqual(parseDigitsInput("20"), { accepted: true, fieldValue: 20 });
  assert.deepEqual(parseDigitsInput(""), { accepted: true, fieldValue: "" });
  for (const input of ["2a", "-1", "1.5", " 3"]) {
    assert.deepEqual(parseDigitsInput(input), { accepted: false });
  }
});

test("도움 시간 상태: 미입력·마이너스·부족·충분", () => {
  const scale = { respondentCount: 5, durationMinutes: 10 };
  assert.equal(
    getHelpTimeCost({ respondentCount: "", durationMinutes: 10 }, 80).status,
    "incomplete",
  );
  assert.equal(
    getHelpTimeCost({ respondentCount: 0, durationMinutes: 10 }, 80).status,
    "incomplete",
  );
  assert.equal(getHelpTimeCost(scale, -10).status, "negativeBalance");
  assert.deepEqual(getHelpTimeCost(scale, 30), {
    status: "insufficient",
    missingHelpTime: 20,
    respondentCount: 5,
    durationMinutes: 10,
    requiredHelpTime: 50,
  });
  assert.equal(getHelpTimeCost(scale, 50).status, "affordable");
});
