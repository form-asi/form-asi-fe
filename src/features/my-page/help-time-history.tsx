"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMyHelpTime } from "@/api/generated/endpoints/user/user";
import { MyHelpTimeFilter } from "@/api/generated/models";
import { AppHeader } from "@/components/common/app-header";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HelpTimeHistoryList } from "@/features/my-page/components/help-time-history-list";
import {
  HELP_TIME_FILTER_OPTIONS,
  HELP_TIME_HISTORY_MESSAGES as MESSAGES,
} from "@/features/my-page/help-time-history-messages";
import {
  type HelpTimeHistoryData,
  parseHelpTimeHistory,
} from "@/features/my-page/lib/help-time-history";
import { formatHelpTime } from "@/lib/format-help-time";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function HelpTimeHistory() {
  const router = useRouter();
  const [filter, setFilter] = useState<MyHelpTimeFilter>(MyHelpTimeFilter.ALL);
  const historyQuery = useMyHelpTime<HelpTimeHistoryData, Error>(
    { filter },
    { query: { select: parseHelpTimeHistory } },
  );
  const selectedFilter = HELP_TIME_FILTER_OPTIONS.find((option) => option.code === filter);

  return (
    <>
      <AppHeader title={MESSAGES.title} back={{ onBack: () => router.back() }} />
      <div className="px-page-inset pt-1 pb-10">
        {historyQuery.data && historyQuery.data.helpTimeBalance < 0 && (
          <Alert variant="destructive" className="my-2">
            <AlertTitle>{formatHelpTime(historyQuery.data.helpTimeBalance)}</AlertTitle>
            <AlertDescription>{MESSAGES.negativeBalance}</AlertDescription>
          </Alert>
        )}
        <ToggleGroup
          aria-label={MESSAGES.filterLabel}
          value={[filter]}
          onValueChange={(selectedFilters) => {
            const nextFilter = HELP_TIME_FILTER_OPTIONS.find(
              (option) => option.code === selectedFilters[0],
            );
            if (nextFilter) setFilter(nextFilter.code);
          }}
          size="chip"
          className="px-0 py-1.5"
        >
          {HELP_TIME_FILTER_OPTIONS.map((option) => (
            <ToggleGroupItem key={option.code} value={option.code} className="text-label-md">
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {historyQuery.isPending && <LoadingSpinner label={MESSAGES.loading} />}
        {historyQuery.isError && (
          <EmptyState
            title={MESSAGES.loadFailed}
            description={historyQuery.error.message}
            action={{
              label: UI_MESSAGES.retry,
              onClick: () => historyQuery.refetch(),
              disabled: historyQuery.isFetching,
            }}
          />
        )}
        {historyQuery.isSuccess &&
          (historyQuery.data.entries.length ? (
            <HelpTimeHistoryList entries={historyQuery.data.entries} />
          ) : (
            <EmptyState
              title={selectedFilter?.emptyTitle ?? HELP_TIME_FILTER_OPTIONS[0].emptyTitle}
              description={MESSAGES.emptyDescription}
            />
          ))}
      </div>
    </>
  );
}
