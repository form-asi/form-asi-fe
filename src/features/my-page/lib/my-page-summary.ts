import { type BaseResponseCurrentUserResponse } from "@/api/generated/models";
import { MY_PAGE_MESSAGES } from "@/features/my-page/my-page-messages";

export type MyPageSummary = { nickname: string; helpTimeBalance: number };

export function parseMyPageSummary(response: BaseResponseCurrentUserResponse): MyPageSummary {
  const nickname = response.data?.nickname;
  const helpTimeBalance = response.data?.helpTimeMinutes;
  if (
    typeof nickname !== "string" ||
    !nickname.trim() ||
    typeof helpTimeBalance !== "number" ||
    !Number.isSafeInteger(helpTimeBalance)
  ) {
    throw new Error(MY_PAGE_MESSAGES.unknownError);
  }
  return { nickname, helpTimeBalance };
}
