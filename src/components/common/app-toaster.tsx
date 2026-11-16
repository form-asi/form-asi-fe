"use client";

import { Toaster } from "@/components/ui/sonner";
import { UI_MESSAGES } from "@/lib/ui-messages";

/** @description safe-area·탭 바·하단 CTA 위에 표시하는 전역 토스트 */
function AppToaster() {
  const offset = {
    bottom: "var(--toast-bottom-offset)",
    left: "var(--toast-inset-inline)",
    right: "var(--toast-inset-inline)",
  };

  return (
    <Toaster
      position="bottom-center"
      offset={offset}
      mobileOffset={offset}
      containerAriaLabel={UI_MESSAGES.notifications}
    />
  );
}

export { AppToaster };
