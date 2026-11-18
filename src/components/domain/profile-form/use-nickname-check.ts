"use client";

import { useRef, useState } from "react";
import { PROFILE_MESSAGES } from "./profile-messages";

type NicknameCheckState =
  | { status: "unchecked" }
  | { status: "checking"; nickname: string }
  | { status: "available"; nickname: string }
  | { status: "taken"; nickname: string }
  | { status: "error"; nickname: string; code: string };

type NicknameCheck = (nickname: string) => Promise<{ available: boolean }>;

/** @description 입력 변경 이전 요청의 응답을 무시하는 닉네임 중복 확인 */
export function useNicknameCheck(checkNickname: NicknameCheck) {
  const [nicknameCheck, setNicknameCheck] = useState<NicknameCheckState>({ status: "unchecked" });
  const requestVersion = useRef(0);

  function invalidateNicknameCheck() {
    requestVersion.current += 1;
    setNicknameCheck({ status: "unchecked" });
  }

  async function handleCheckNickname(nickname: string) {
    const currentVersion = ++requestVersion.current;
    setNicknameCheck({ status: "checking", nickname });

    try {
      const { available } = await checkNickname(nickname);
      if (currentVersion !== requestVersion.current) return;
      setNicknameCheck({ status: available ? "available" : "taken", nickname });
    } catch (error) {
      if (currentVersion !== requestVersion.current) return;
      const code = error instanceof Error ? error.message : PROFILE_MESSAGES.unknownError;
      setNicknameCheck({ status: "error", nickname, code });
    }
  }

  return { nicknameCheck, invalidateNicknameCheck, handleCheckNickname };
}
