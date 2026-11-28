import { expect, test } from "bun:test";
import { CurrentUserResponseStatus } from "@/api/generated/models/currentUserResponseStatus";
import { type AuthSession, getAuthRedirect } from "./auth-redirect";
import { ROUTES } from "./routes";

const cases = [
  [{ kind: "guest" }, [ROUTES.login, ROUTES.login, ROUTES.login]],
  [
    { kind: "member", status: CurrentUserResponseStatus.PENDING },
    [ROUTES.onboardingProfile, null, ROUTES.onboardingProfile],
  ],
  [
    { kind: "member", status: CurrentUserResponseStatus.ACTIVE },
    [ROUTES.explore, ROUTES.explore, null],
  ],
  [
    { kind: "member", status: CurrentUserResponseStatus.SUSPENDED },
    [ROUTES.login, ROUTES.login, ROUTES.login],
  ],
  [
    { kind: "member", status: CurrentUserResponseStatus.WITHDRAWN },
    [ROUTES.login, ROUTES.login, ROUTES.login],
  ],
] as const satisfies readonly (readonly [AuthSession, readonly (string | null)[]])[];

for (const [session, [fromCallback, fromOnboarding, fromProtected]] of cases) {
  const sessionName = session.kind === "guest" ? "guest" : session.status;
  test(`${sessionName} 회원의 콜백·온보딩·보호 화면 이동과 로그인 공개 접근`, () => {
    expect(getAuthRedirect(session, ROUTES.login)).toBeNull();
    expect(getAuthRedirect(session, ROUTES.authCallback)).toBe(fromCallback);
    expect(getAuthRedirect(session, ROUTES.onboardingProfile)).toBe(fromOnboarding);
    for (const pathname of [
      ROUTES.home,
      ROUTES.explore,
      ROUTES.mySurvey,
      ROUTES.surveyRegister,
      ROUTES.profileEdit,
    ]) {
      expect(getAuthRedirect(session, pathname)).toBe(fromProtected);
    }
    if (fromProtected) expect(getAuthRedirect(session, fromProtected)).toBeNull();
  });
}
