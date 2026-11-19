import * as profileOptions from "@/components/domain/profile-form/profile-options";

// shortcut: 설문 대상에서 기타 코드 제외, 백엔드 enum 확정 후 선택지 갱신
export const GENDER_OPTIONS = profileOptions.GENDER_OPTIONS;
export const OCCUPATION_OPTIONS = profileOptions.OCCUPATION_OPTIONS.filter(
  (option) => option.value !== "ETC",
);
export const FIELD_OPTIONS = profileOptions.FIELD_OPTIONS.filter(
  (option) => option.value !== "ETC",
);
export const REGION_OPTIONS = profileOptions.REGION_OPTIONS;
export const HOUSEHOLD_OPTIONS = profileOptions.HOUSEHOLD_OPTIONS.filter(
  (option) => option.value !== "ETC",
);
export const HOUSEHOLD_SIZE_OPTIONS = profileOptions.HOUSEHOLD_SIZE_OPTIONS;
export const MARITAL_STATUS_OPTIONS = profileOptions.MARITAL_STATUS_OPTIONS.filter(
  (option) => option.value !== "ETC",
);
export const CHILDREN_OPTIONS = profileOptions.CHILDREN_OPTIONS;
export const PET_EXPERIENCE_OPTIONS = profileOptions.PET_EXPERIENCE_OPTIONS;
export const PET_TYPE_OPTIONS = profileOptions.PET_TYPE_OPTIONS.filter(
  (option) => option.value !== "ETC",
);
export const DRIVING_LICENSE_OPTIONS = profileOptions.DRIVING_LICENSE_OPTIONS;
