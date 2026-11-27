const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
// 생성 코드(auth.ts)가 이 파일을 import하므로 순환을 피해 경로를 직접 둔다
const REFRESH_PATH = "/api/v1/auth/refresh";
const UNKNOWN_ERROR_CODE = "UNKNOWN_ERROR";

type ErrorBody = { error?: { code?: string } } | null;

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
  ) {
    super((data as ErrorBody)?.error?.code ?? UNKNOWN_ERROR_CODE);
  }
}

// 브라우저 메모리에만 둔다. 서버에서 공유되면 다른 사용자 요청에 섞이므로 저장하지 않는다
let accessToken: string | null = null;
let refreshInFlight: Promise<boolean> | null = null;

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  accessToken = token;
}

async function request(url: string, options?: RequestInit) {
  return fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    },
  });
}

/** refresh 쿠키로 access token을 다시 받는다. 동시에 여러 401이 와도 한 번만 호출 */
export function refreshAccessToken(): Promise<boolean> {
  refreshInFlight ??= request(REFRESH_PATH, { method: "POST" })
    .then(async (response) => {
      const body = response.ok ? await response.json().catch(() => null) : null;
      const token: unknown = body?.data?.accessToken;
      setAccessToken(typeof token === "string" ? token : null);
      return typeof token === "string";
    })
    .catch(() => {
      setAccessToken(null);
      return false;
    })
    .finally(() => {
      refreshInFlight = null;
    });
  return refreshInFlight;
}

/** Orval mutator. 응답 본문(BaseResponse)을 돌려주고, 실패 응답은 error.code를 담은 ApiError로 던진다 */
export async function fetcher<ResponseBody>(
  url: string,
  options?: RequestInit,
): Promise<ResponseBody> {
  let response = await request(url, options);
  if (response.status === 401 && url !== REFRESH_PATH && (await refreshAccessToken())) {
    response = await request(url, options);
  }
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok || body?.success === false) throw new ApiError(response.status, body);
  return body as ResponseBody;
}
