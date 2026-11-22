import { cn } from "cn";
import Link from "next/link";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import { formatHelpTime } from "@/lib/format-help-time";
import { ROUTES } from "@/lib/routes";
import { UI_MESSAGES } from "@/lib/ui-messages";

type HelpTimeChipProps = {
  helpTimeBalance: number;
};

/** @description 서버에서 받은 잔액 표시와 S-41 진입용 C-01 칩 */
function HelpTimeChip({ helpTimeBalance }: HelpTimeChipProps) {
  return (
    <Link
      href={ROUTES.helpTime}
      data-slot="help-time-chip"
      className="flex shrink-0 items-center rounded-full py-1.5 pr-1.5 pl-2 text-foreground-quaternary"
    >
      <span className="flex items-end gap-1">
        <span className="text-emphasis-caption-sm">{UI_MESSAGES.myHelpTime}</span>
        <span
          className={cn(
            "text-emphasis-label-md",
            helpTimeBalance < 0 ? "text-destructive" : "text-brand",
          )}
        >
          {formatHelpTime(helpTimeBalance)}
        </span>
      </span>
      <ChevronRightIcon />
    </Link>
  );
}

export { HelpTimeChip };
