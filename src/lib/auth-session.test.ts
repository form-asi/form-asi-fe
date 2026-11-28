import { afterEach, beforeEach, expect, mock, test } from "bun:test";
import { QueryClient } from "@tanstack/react-query";
import { ApiError, setAccessToken } from "@/api/fetcher";
import {
  getAuthState,
  restoreCurrentUser,
  shouldRetryQuery,
  subscribeToUnauthorized,
} from "./auth-session";

const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status });

beforeEach(() => {
  globalThis.window = globalThis as never;
});
afterEach(() => {
  setAccessToken(null);
  globalThis.fetch = originalFetch;
  globalThis.window = originalWindow;
});

test("새로고침 후 refresh → Bearer me 순서로 세션 복구", async () => {
  const calls: string[] = [];
  globalThis.fetch = mock(async (input: string | URL | Request, options?: RequestInit) => {
    const url = String(input);
    calls.push(url);
    expect(options?.credentials).toBe("include");
    if (url.endsWith("/auth/refresh")) return json(200, { data: { accessToken: "session-token" } });
    expect(new Headers(options?.headers).get("Authorization")).toBe("Bearer session-token");
    return json(200, { success: true, data: { status: "ACTIVE", helpTimeMinutes: -30 } });
  }) as unknown as typeof fetch;
  const response = await restoreCurrentUser({ signal: new AbortController().signal });
  expect(getAuthState(response, null, false)).toEqual({ kind: "member", status: "ACTIVE" });
  expect(calls.map((url) => new URL(url, "http://localhost").pathname)).toEqual([
    "/api/v1/auth/refresh",
    "/api/v1/users/me",
  ]);
});

test("이미 토큰이 있으면 refresh 없이 me 조회", async () => {
  setAccessToken("existing-token");
  const fetchMock = mock(async () => json(200, { data: { status: "PENDING" } }));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  const response = await restoreCurrentUser({ signal: new AbortController().signal });
  expect(getAuthState(response, null, false)).toEqual({ kind: "member", status: "PENDING" });
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test("refresh 거절 시 me를 호출하지 않고 guest 처리", async () => {
  const fetchMock = mock(async () => json(401, { error: { code: "UNAUTHORIZED" } }));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  const error = await restoreCurrentUser({ signal: new AbortController().signal }).catch(
    (caught: unknown) => caught,
  );
  expect(getAuthState(undefined, error, false)).toEqual({ kind: "guest" });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(shouldRetryQuery(0, error)).toBe(false);
});

test("서버·네트워크 오류와 알 수 없는 회원 상태는 보호 화면을 열지 않는다", () => {
  expect(getAuthState(undefined, null, true)).toEqual({ kind: "checking" });
  expect(getAuthState(undefined, new ApiError(500, null), false)).toEqual({ kind: "error" });
  expect(getAuthState(undefined, new TypeError("Failed to fetch"), false)).toEqual({
    kind: "error",
  });
  expect(getAuthState({ data: {} }, null, false)).toEqual({ kind: "error" });
  expect(getAuthState(JSON.parse('{"data":{"status":"UNKNOWN"}}'), null, false)).toEqual({
    kind: "error",
  });
});

test("4xx 재시도 제외, 서버·네트워크 오류는 한 번만 재시도", () => {
  for (const status of [400, 401, 403, 404, 409, 429])
    expect(shouldRetryQuery(0, new ApiError(status, null))).toBe(false);
  expect(shouldRetryQuery(0, new ApiError(500, null))).toBe(true);
  expect(shouldRetryQuery(0, new TypeError("Failed to fetch"))).toBe(true);
  expect(shouldRetryQuery(1, new ApiError(500, null))).toBe(false);
});

test("조회·저장의 최종 401만 세션 만료 처리하고 구독 해제 후에는 호출하지 않는다", async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const handleExpired = mock(() => {});
  const unsubscribe = subscribeToUnauthorized(queryClient, handleExpired);
  async function requestWithError(status: number) {
    throw new ApiError(status, null);
  }
  await queryClient
    .fetchQuery({ queryKey: ["server-failure"], queryFn: () => requestWithError(500) })
    .catch(() => {});
  expect(handleExpired).toHaveBeenCalledTimes(0);
  await queryClient
    .fetchQuery({ queryKey: ["expired-query"], queryFn: () => requestWithError(401) })
    .catch(() => {});
  const mutation = queryClient
    .getMutationCache()
    .build(queryClient, { mutationFn: () => requestWithError(401) });
  await mutation.execute(undefined).catch(() => {});
  expect(handleExpired).toHaveBeenCalledTimes(2);
  unsubscribe();
  await queryClient
    .fetchQuery({ queryKey: ["unsubscribed"], queryFn: () => requestWithError(401) })
    .catch(() => {});
  expect(handleExpired).toHaveBeenCalledTimes(2);
  queryClient.clear();
});
