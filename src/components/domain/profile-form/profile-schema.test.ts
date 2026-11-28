import { test } from "bun:test";
import assert from "node:assert/strict";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "@/lib/dayjs";
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
  occupation: "EMPLOYEE",
  fields: ["DESIGN"],
};

test("최초 입력은 실제 생년월일 필수, 저장된 나이는 읽기 전용 값으로 유지", async () => {
  const profile = { ...validProfile, age: undefined, birthDate: "2000-02-29" };
  assert.ok(profileSchema.safeParse(profile).success);
  assert.ok(profileSchema.safeParse(validProfile).success);
  assert.equal(profileSchema.safeParse({ ...profile, age: 29 }).success, false);
  assert.equal(profileSchema.safeParse({ ...validProfile, age: undefined }).success, false);
  for (const birthDate of [
    "",
    "2001-02-29",
    "2000-02-30",
    "2000-2-1",
    "20000201",
    dayjs().add(1, "day").format("YYYY-MM-DD"),
  ]) {
    const result = await zodResolver(profileSchema)({ ...profile, birthDate }, undefined, {
      fields: {},
      shouldUseNativeValidation: false,
    });
    assert.ok(result.errors.birthDate, birthDate);
  }
  // 만 14세 미만 여부는 서버가 판정한다.
  assert.ok(
    profileSchema.safeParse({ ...profile, birthDate: dayjs().format("YYYY-MM-DD") }).success,
  );
});

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
    [{ occupation: "OTHER" }, "occupationOther"],
    [{ fields: ["OTHER"] }, "fieldsOther"],
    [{ household: "OTHER" }, "householdOther"],
    [{ maritalStatus: "OTHER" }, "maritalStatusOther"],
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
    profileSchema.safeParse({ ...validProfile, petExperience: "PAST", petTypes: ["OTHER"] })
      .success,
  );
});
