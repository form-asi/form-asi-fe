/**
 * @description 화면 경로. `src/app` 폴더 구조를 바꾸면 여기도 함께 바꾼다.
 */
export const ROUTES = {
  home: "/",
  login: "/login",
  authCallback: "/auth/callback",
  onboardingProfile: "/onboarding/profile",
  explore: "/explore",
  mySurvey: "/my-survey",
  surveyRegister: "/my-survey/new",
  myPage: "/my-page",
  helpTime: "/my-page/help-time",
  profileEdit: "/my-page/profile",
  settings: "/my-page/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
