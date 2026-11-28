"use client";

import { useMe } from "@/api/generated/endpoints/user/user";
import { HelpTimeChip } from "@/components/domain/help-time-chip";

/** @description 인증 가드에서 조회한 내 정보 캐시의 도움 시간을 표시한다. */
export function CurrentHelpTime() {
  const currentUserQuery = useMe();
  const helpTimeBalance = currentUserQuery.data?.data?.helpTimeMinutes;
  if (typeof helpTimeBalance !== "number" || !Number.isFinite(helpTimeBalance)) return null;
  return <HelpTimeChip helpTimeBalance={helpTimeBalance} />;
}
