"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { setAccessToken } from "@/api/fetcher";
import { useMe } from "@/api/generated/endpoints/user/user";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { getAuthRedirect } from "@/lib/auth-redirect";
import { getAuthState, restoreCurrentUser, subscribeToUnauthorized } from "@/lib/auth-session";
import { UI_MESSAGES } from "@/lib/ui-messages";

/** @description 회원 상태 확인·이동 중에는 보호 화면을 마운트하지 않는다. */
export function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [expiredSession, setExpiredSession] = useState<{ kind: "guest" } | null>(null);
  const currentUserQuery = useMe({
    query: { queryFn: restoreCurrentUser, enabled: expiredSession === null, retryOnMount: false },
  });
  const authState =
    expiredSession ??
    getAuthState(currentUserQuery.data, currentUserQuery.error, currentUserQuery.isPending);
  const redirectTo =
    authState.kind === "guest" || authState.kind === "member"
      ? getAuthRedirect(authState, pathname)
      : null;

  useEffect(() => {
    return subscribeToUnauthorized(queryClient, () => {
      setExpiredSession({ kind: "guest" });
      setAccessToken(null);
      queryClient.clear();
    });
  }, [queryClient]);

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  if (authState.kind === "checking" || redirectTo) {
    return <LoadingSpinner label={UI_MESSAGES.checkingSession} className="min-h-dvh" />;
  }
  if (authState.kind === "error") {
    return (
      <div className="p-page-inset">
        <EmptyState
          {...UI_MESSAGES.emptyState.loadFailed}
          action={{
            label: UI_MESSAGES.retry,
            onClick: () => currentUserQuery.refetch(),
            disabled: currentUserQuery.isFetching,
          }}
        />
      </div>
    );
  }
  return children;
}
