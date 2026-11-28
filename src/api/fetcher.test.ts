import { afterEach, expect, mock, test } from "bun:test";
import { ApiError, fetcher, setAccessToken } from "./fetcher";

const originalFetch = globalThis.fetch;
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

afterEach(() => {
  globalThis.fetch = originalFetch;
  setAccessToken(null);
});

test("401이면 토큰을 한 번만 재발급하고 원래 요청들을 다시 보낸다", async () => {
  // setAccessToken은 브라우저에서만 저장하므로 window를 흉내 낸다
  globalThis.window ??= globalThis as never;
  const calls: { url: string; authorization: string | null }[] = [];
  globalThis.fetch = mock(async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    const authorization = new Headers(init?.headers).get("Authorization");
    calls.push({ url, authorization });
    if (url.endsWith("/auth/refresh")) {
      return json(200, { success: true, data: { accessToken: "new-token" } });
    }
    return authorization === "Bearer new-token"
      ? json(200, { success: true, data: { ok: true } })
      : json(401, { success: false, error: { code: "UNAUTHORIZED" } });
  }) as unknown as typeof fetch;

  const results = await Promise.all([fetcher("/api/v1/users/me"), fetcher("/api/v1/users/me")]);

  expect(results).toEqual([
    { success: true, data: { ok: true } },
    { success: true, data: { ok: true } },
  ]);
  expect(calls.filter((call) => call.url.endsWith("/auth/refresh"))).toHaveLength(1);
});

test("실패 응답은 서버 error.code를 메시지로 담은 ApiError로 던진다", async () => {
  globalThis.fetch = mock(async () =>
    json(409, { success: false, error: { code: "NICKNAME_DUPLICATED" } }),
  ) as unknown as typeof fetch;

  const error = await fetcher("/api/v1/users/me/onboarding").catch((caught: unknown) => caught);

  expect(error).toBeInstanceOf(ApiError);
  expect(error).toMatchObject({ status: 409, message: "NICKNAME_DUPLICATED" });
});
