"use client";

import { useEffect, useEffectEvent, useId, useRef } from "react";

const GUARD_STATE_KEY = "formasiSurveyLeaveGuard";

/** @description 같은 URL의 표시용 history 항목으로 기기 뒤로가기를 이탈 확인에 연결 */
export function useLeaveGuard(onRequestLeave: () => void) {
  const guardId = useId();
  const isGuardActive = useRef(false);
  const finishRelease = useRef<(() => void) | null>(null);
  const requestLeave = useEffectEvent(onRequestLeave);

  useEffect(() => {
    const guardedUrl = window.location.href;
    isGuardActive.current = true;

    function pushGuardEntry() {
      window.history.pushState(
        { ...window.history.state, [GUARD_STATE_KEY]: guardId },
        "",
        guardedUrl,
      );
    }

    function handleBrowserBack() {
      const finishPendingRelease = finishRelease.current;
      if (finishPendingRelease) {
        finishRelease.current = null;
        finishPendingRelease();
        return;
      }
      if (!isGuardActive.current) return;
      pushGuardEntry();
      requestLeave();
    }

    // Strict Mode와 Activity 재활성화 시 표시용 항목의 중복 생성 방지
    if (window.history.state?.[GUARD_STATE_KEY] !== guardId) pushGuardEntry();
    window.addEventListener("popstate", handleBrowserBack);
    return () => {
      isGuardActive.current = false;
      window.removeEventListener("popstate", handleBrowserBack);
      finishRelease.current?.();
      finishRelease.current = null;
    };
  }, [guardId]);

  async function releaseLeaveGuard() {
    isGuardActive.current = false;
    if (window.history.state?.[GUARD_STATE_KEY] !== guardId) return;
    const unguardedState = { ...window.history.state };
    delete unguardedState[GUARD_STATE_KEY];
    window.history.replaceState(unguardedState, "");
    await new Promise<void>((resolve) => {
      finishRelease.current = resolve;
      window.history.back();
    });
  }

  return { releaseLeaveGuard };
}
