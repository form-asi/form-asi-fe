"use client";

import Link from "next/link";
import { useMe } from "@/api/generated/endpoints/user/user";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg";
import { EmptyState } from "@/components/common/empty-state";
import { MyHelpTimeCard } from "@/features/my-page/components/my-help-time-card";
import { MyPageProfile } from "@/features/my-page/components/my-page-profile";
import { type MyPageSummary, parseMyPageSummary } from "@/features/my-page/lib/my-page-summary";
import { MY_PAGE_MESSAGES } from "@/features/my-page/my-page-messages";
import { ROUTES } from "@/lib/routes";
import { UI_MESSAGES } from "@/lib/ui-messages";

export function MyPage() {
  const currentUserQuery = useMe<MyPageSummary, Error>({ query: { select: parseMyPageSummary } });
  return (
    <div className="flex flex-col gap-5 p-page-inset pb-10">
      <h1 className="text-title-md font-semibold">{MY_PAGE_MESSAGES.title}</h1>
      {currentUserQuery.isPending && (
        <p role="status" className="text-body-sm text-muted-foreground">
          {MY_PAGE_MESSAGES.loading}
        </p>
      )}
      {currentUserQuery.isError && (
        <EmptyState
          title={MY_PAGE_MESSAGES.loadFailed}
          description={currentUserQuery.error.message}
          action={{
            label: UI_MESSAGES.retry,
            onClick: () => currentUserQuery.refetch(),
            disabled: currentUserQuery.isFetching,
          }}
        />
      )}
      {currentUserQuery.isSuccess && (
        <>
          <MyPageProfile nickname={currentUserQuery.data.nickname} />
          <MyHelpTimeCard helpTimeBalance={currentUserQuery.data.helpTimeBalance} />
          <Link
            href={ROUTES.settings}
            className="flex min-h-control-lg items-center justify-between gap-3 border-b border-line-subtle p-3 text-label-lg focus-visible:outline-2 focus-visible:outline-ring"
          >
            {MY_PAGE_MESSAGES.settings}
            <ChevronRightIcon className="size-6 shrink-0 text-foreground-tertiary" />
          </Link>
        </>
      )}
    </div>
  );
}
