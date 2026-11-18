import { Bell } from "lucide-react";
import { AppHeader } from "@/components/common/app-header";
import { HelpTimeChip } from "@/components/domain/help-time-chip";
import { UI_MESSAGES } from "@/lib/ui-messages";

export default function BalanceHeaderLayout({ children }: LayoutProps<"/">) {
  // shortcut: 잔액 API 연결 전 임시 값
  const helpTimeBalance = 30;

  return (
    <>
      <AppHeader
        rightSlot={
          <>
            <HelpTimeChip helpTimeBalance={helpTimeBalance} />
            <Bell role="img" aria-label={UI_MESSAGES.notifications} className="size-4 shrink-0" />
          </>
        }
      />
      {children}
    </>
  );
}
