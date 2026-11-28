"use client";

import { useQueryClient } from "@tanstack/react-query";
import { getNicknameAvailabilityQueryOptions } from "@/api/generated/endpoints/user/user";
import { PROFILE_MESSAGES } from "./profile-messages";

/** @description 온보딩·프로필 수정에서 닉네임 중복 여부를 서버에 새로 확인한다. */
export function useNicknameAvailability() {
  const queryClient = useQueryClient();
  return async function checkNickname(nickname: string) {
    const response = await queryClient.fetchQuery({
      ...getNicknameAvailabilityQueryOptions({ nickname }),
      staleTime: 0,
    });
    const available = response.data?.available;
    if (typeof available !== "boolean") throw new Error(PROFILE_MESSAGES.unknownError);
    return { available };
  };
}
