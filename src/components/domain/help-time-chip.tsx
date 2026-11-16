import { cn } from "cn";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge.styles";
import { formatHelpTime } from "@/lib/format-help-time";
import { UI_MESSAGES } from "@/lib/ui-messages";

type HelpTimeChipProps = {
  helpTimeBalance: number;
};

/** @description 서버에서 받은 잔액 표시와 S-41 진입용 C-01 칩 */
function HelpTimeChip({ helpTimeBalance }: HelpTimeChipProps) {
  return (
    <Link
      href="/my-page/help-time"
      data-slot="help-time-chip"
      className={cn(
        badgeVariants({
          variant: helpTimeBalance < 0 ? "destructive-outline" : "muted-outline",
          size: "chip",
        }),
      )}
    >
      {UI_MESSAGES.helpTime} {formatHelpTime(helpTimeBalance)}
      <ChevronRight aria-hidden="true" />
    </Link>
  );
}

export { HelpTimeChip };
