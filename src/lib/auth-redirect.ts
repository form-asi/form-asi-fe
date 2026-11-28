import { CurrentUserResponseStatus } from "@/api/generated/models/currentUserResponseStatus";
import { type AppRoute, ROUTES } from "@/lib/routes";

export type AuthSession = { kind: "guest" } | { kind: "member"; status: CurrentUserResponseStatus };

/** @description 회원 상태에 맞는 화면으로 이동하며, 이미 허용된 화면이면 이동하지 않는다. */
export function getAuthRedirect(session: AuthSession, pathname: string): AppRoute | null {
  if (pathname === ROUTES.login) return null;
  if (
    session.kind === "guest" ||
    session.status === CurrentUserResponseStatus.SUSPENDED ||
    session.status === CurrentUserResponseStatus.WITHDRAWN
  ) {
    return ROUTES.login;
  }
  if (session.status === CurrentUserResponseStatus.PENDING) {
    return pathname === ROUTES.onboardingProfile ? null : ROUTES.onboardingProfile;
  }
  return pathname === ROUTES.authCallback || pathname === ROUTES.onboardingProfile
    ? ROUTES.explore
    : null;
}
