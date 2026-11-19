import { test } from "bun:test";
import assert from "node:assert/strict";
import { checkNicknameMock, getCurrentProfileMock, saveProfileMock } from "./profile-api.mock";
import {
  createEmptyProfile,
  nicknameSchema,
  type ProfileValues,
  profileSchema,
} from "./profile-schema";

const validProfile: ProfileValues = {
  ...createEmptyProfile(29),
  nickname: "테스트1",
  gender: "FEMALE",
  occupation: "EMPLOYED",
  fields: ["DESIGN"],
};

test("닉네임의 길이·문자 제한", () => {
  for (const nickname of ["가나", "Ab12", "가나다라마바사아자차"]) {
    assert.ok(nicknameSchema.safeParse(nickname).success, nickname);
  }
  for (const nickname of ["", "가", "abcdefghijk", "품앗이 1", "hello!", " name", "name\n"]) {
    assert.equal(nicknameSchema.safeParse(nickname).success, false, nickname);
  }
});

test("선택 항목은 비워도 유효하고 필수 항목과 알 수 없는 코드는 거부", () => {
  assert.ok(profileSchema.safeParse(validProfile).success);
  for (const invalidFields of [
    { gender: "" },
    { occupation: "" },
    { fields: [] },
    { gender: "UNKNOWN" },
    { fields: ["UNKNOWN"] },
    { petTypes: ["UNKNOWN"] },
  ]) {
    assert.equal(profileSchema.safeParse({ ...validProfile, ...invalidFields }).success, false);
  }
});

test("기타 선택 시 필수·선택 항목 모두 내용 필요, 공백 포함 최대 20자", () => {
  const otherSelections = [
    [{ occupation: "ETC" }, "occupationOther"],
    [{ fields: ["ETC"] }, "fieldsOther"],
    [{ household: "ETC" }, "householdOther"],
    [{ maritalStatus: "ETC" }, "maritalStatusOther"],
  ] as const;

  for (const [selection, otherFieldName] of otherSelections) {
    for (const invalidText of ["", "   ", `${"가".repeat(19)}  `]) {
      const result = profileSchema.safeParse({
        ...validProfile,
        ...selection,
        [otherFieldName]: invalidText,
      });
      assert.equal(result.success, false);
      if (!result.success)
        assert.ok(result.error.issues.some((issue) => issue.path[0] === otherFieldName));
    }
    assert.ok(
      profileSchema.safeParse({
        ...validProfile,
        ...selection,
        [otherFieldName]: `${"가".repeat(19)} `,
      }).success,
    );
  }
});

test("반려동물 종류의 기타는 직접 입력 불필요", () => {
  assert.ok(
    profileSchema.safeParse({ ...validProfile, petExperience: "PAST", petTypes: ["ETC"] }).success,
  );
});

test("mock 중복 확인의 대소문자 처리와 저장 실패 시 기존 값 유지", async () => {
  assert.deepEqual(await checkNicknameMock("PuMaSi"), { available: false });
  assert.deepEqual(await checkNicknameMock(validProfile.nickname), { available: true });
  const savedProfile = await saveProfileMock(validProfile);
  savedProfile.fields.push("ETC");
  assert.deepEqual(await getCurrentProfileMock(), validProfile);
  await assert.rejects(
    saveProfileMock({ ...validProfile, nickname: "PUMASI" }),
    /NICKNAME_DUPLICATE/,
  );
  assert.deepEqual(await getCurrentProfileMock(), validProfile);
});
