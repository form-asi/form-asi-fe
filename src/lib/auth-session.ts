import { type QueryClient } from "@tanstack/react-query";
import { ApiError, hasAccessToken, refreshAccessToken } from "@/api/fetcher";
import { me } from "@/api/generated/endpoints/user/user";
import { type BaseResponseCurrentUserResponse } from "@/api/generated/models/baseResponseCurrentUserResponse";
import { CurrentUserResponseStatus } from "@/api/generated/models/currentUserResponseStatus";
import { type AuthSession } from "@/lib/auth-redirect";

export type AuthState = AuthSession | { kind: "checking" } | { kind: "error" };

/** @description 최초 진입 시 쿠키로 세션을 복구한 뒤 생성된 API로 회원 정보를 조회한다. */
export async function restoreCurrentUser({ signal }: { signal: AbortSignal }) {
  if (!hasAccessToken() && !(await refreshAccessToken())) {
    throw new ApiError(401, { error: { code: "UNAUTHORIZED" } });
  }
  signal.throwIfAborted();
  return me({ signal });
}

/** @description 상태 누락·알 수 없는 회원 상태는 보호 화면을 열지 않고 조회 오류로 처리한다. */
export function getAuthState(
  currentUserResponse: BaseResponseCurrentUserResponse | undefined,
  error: unknown,
  isPending: boolean,
): AuthState {
  if (isUnauthorized(error)) return { kind: "guest" };
  if (error) return { kind: "error" };
  if (isPending) return { kind: "checking" };
  const status = currentUserResponse?.data?.status;
  if (!status || !Object.values(CurrentUserResponseStatus).includes(status))
    return { kind: "error" };
  return { kind: "member", status };
}

/** @description fetcher의 재발급 시도까지 실패한 인증 오류만 세션 만료로 처리한다. */
export function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

/** @description 조회·저장 요청의 최종 401을 구독하고 해제 함수를 반환한다. */
export function subscribeToUnauthorized(
  queryClient: QueryClient,
  handleSessionExpired: () => void,
) {
  const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
    if (
      event.type === "updated" &&
      event.action.type === "error" &&
      isUnauthorized(event.action.error)
    ) {
      handleSessionExpired();
    }
  });
  const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
    if (
      event.type === "updated" &&
      event.action.type === "error" &&
      isUnauthorized(event.action.error)
    ) {
      handleSessionExpired();
    }
  });
  return () => {
    unsubscribeQueries();
    unsubscribeMutations();
  };
}

/** @description 4xx는 재시도하지 않고, 네트워크·서버 오류는 한 번 재시도한다. */
export function shouldRetryQuery(failureCount: number, error: unknown) {
  return (
    failureCount < 1 && !(error instanceof ApiError && error.status >= 400 && error.status < 500)
  );
}
