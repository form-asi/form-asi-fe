import { createEmptyProfile, type ProfileValues, profileSchema } from "./profile-schema";

// shortcut: 새로고침 시 초기화되는 mock 저장소, API 명세 확정 후 Orval 훅으로 교체
let currentProfile: ProfileValues = {
  ...createEmptyProfile(29),
  nickname: "품앗이1",
  gender: "FEMALE",
  occupation: "EMPLOYEE",
  fields: ["DESIGN"],
  region: "SEOUL",
};

const takenNicknames = new Set(["pumasi", "formasi", "폼앗이"]);
const waitForMockResponse = () => new Promise((resolve) => setTimeout(resolve, 200));

export async function getCurrentProfileMock(): Promise<ProfileValues> {
  await waitForMockResponse();
  return structuredClone(currentProfile);
}

export async function checkNicknameMock(nickname: string) {
  await waitForMockResponse();
  return { available: !takenNicknames.has(nickname.toLowerCase()) };
}

export async function saveProfileMock(profile: ProfileValues): Promise<ProfileValues> {
  await waitForMockResponse();
  const validatedProfile = profileSchema.parse(profile);
  if (takenNicknames.has(validatedProfile.nickname.toLowerCase())) {
    throw new Error("NICKNAME_DUPLICATE");
  }
  currentProfile = structuredClone(validatedProfile);
  return structuredClone(currentProfile);
}
