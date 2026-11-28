import Link from "next/link";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import ClockIcon from "@/assets/icons/clock.svg";
import { Card } from "@/components/ui/card";
import { MY_PAGE_MESSAGES } from "@/features/my-page/my-page-messages";
import { formatHelpTime } from "@/lib/format-help-time";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function MyHelpTimeCard({ helpTimeBalance }: { helpTimeBalance: number }) {
  const surveyCount = Math.floor(helpTimeBalance / 5);
  return (
    <Link
      href={ROUTES.helpTime}
      className="rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
    >
      <Card className="flex-row items-center gap-3 border-0 bg-linear-to-r from-brand-subtle/50 to-(--background-neutral-secondary) px-4 pt-4 pb-5">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <h2 className="text-label-md font-medium">{MY_PAGE_MESSAGES.helpTime}</h2>
          <div className="flex flex-col gap-1.5">
            <p
              className={cn(
                "flex items-center gap-1 text-emphasis-heading-lg font-bold",
                helpTimeBalance < 0 ? "text-destructive" : "text-brand",
              )}
            >
              <ClockIcon className="shrink-0" />
              {formatHelpTime(helpTimeBalance)}
            </p>
            {surveyCount > 0 && (
              <p className="text-label-sm font-medium text-foreground-tertiary">
                {MY_PAGE_MESSAGES.surveyCount(surveyCount)}
              </p>
            )}
          </div>
        </div>
        <ChevronRightIcon className="size-4 shrink-0 text-foreground-tertiary" />
      </Card>
    </Link>
  );
}
