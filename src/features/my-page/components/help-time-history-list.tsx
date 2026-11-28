import { HELP_TIME_HISTORY_MESSAGES as MESSAGES } from "@/features/my-page/help-time-history-messages";
import { type HelpTimeHistoryData } from "@/features/my-page/lib/help-time-history";

export function HelpTimeHistoryList({ entries }: Pick<HelpTimeHistoryData, "entries">) {
  return (
    <ul>
      {entries.map((entry, index) => (
        <li
          key={`${entry.occurredAt}-${index}`}
          className="flex items-end gap-2.5 border-b border-line-subtle px-1 pt-2.5 pb-3 last:border-0"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 wrap-break-word">
            <time dateTime={entry.occurredAt} className="text-caption-sm text-foreground-tertiary">
              {entry.dateLabel}
            </time>
            <div className="flex flex-col gap-0.5">
              <p className="text-body-md font-medium">{entry.reasonLabel}</p>
              {entry.surveyTitle && (
                <p className="text-caption-sm text-foreground-tertiary">{entry.surveyTitle}</p>
              )}
              {entry.expiryLabel && (
                <p className="text-caption-sm text-foreground-tertiary">{entry.expiryLabel}</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-0.5 text-right whitespace-nowrap">
            <p className="text-body-md font-medium">{entry.changeLabel}</p>
            <p className="text-caption-sm text-foreground-tertiary">
              <span className="sr-only">{MESSAGES.balanceAfter} </span>
              {entry.balanceLabel}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
