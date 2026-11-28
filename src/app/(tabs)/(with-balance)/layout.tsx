import { Bell } from "lucide-react";
import { AppHeader } from "@/components/common/app-header";
import { CurrentHelpTime } from "@/components/domain/current-help-time";
import { UI_MESSAGES } from "@/lib/ui-messages";

export default function BalanceHeaderLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AppHeader
        rightSlot={
          <>
            <CurrentHelpTime />
            <Bell role="img" aria-label={UI_MESSAGES.notifications} className="size-4 shrink-0" />
          </>
        }
      />
      {children}
    </>
  );
}
