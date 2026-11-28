"use client";

import localFont from "next/font/local";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CircleCloseIcon from "@/assets/icons/circle-close.svg";
import KakaoIcon from "@/assets/icons/kakao.svg";
import { Button } from "@/components/ui/button";
import {
  getLoginErrorMessage,
  KAKAO_LOGIN_MESSAGES,
} from "@/features/onboarding/kakao-login-messages";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const brandFont = localFont({
  src: "../../assets/fonts/jua-brand.ttf",
  weight: "400",
  display: "swap",
});

export function KakaoLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginError] = useState(() => getLoginErrorMessage(searchParams.get("error")));

  useEffect(() => {
    if (searchParams.has("error")) router.replace(ROUTES.login, { scroll: false });
  }, [router, searchParams]);

  function handleKakaoLogin() {
    // OAuth는 서버 리다이렉트와 쿠키 설정이 필요하므로 전체 페이지로 이동한다.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/v1/auth/login/kakao`);
  }

  return (
    <section data-slot="kakao-login" className="flex flex-1 flex-col bg-brand px-page-inset pb-8">
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="flex -translate-y-6 flex-col items-center gap-4 text-center">
          {/* shortcut: 로고·카피 미확정, 디자인 확정 시 자리표시자 교체 */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-15.5 w-19.75 items-center justify-center bg-inverse-foreground text-caption-lg text-foreground">
              {KAKAO_LOGIN_MESSAGES.logoPlaceholder}
            </div>
            <h1 className={cn(brandFont.className, "text-display-lg text-inverse-foreground")}>
              {KAKAO_LOGIN_MESSAGES.title}
            </h1>
          </div>
          <p className="text-caption-lg text-inverse-foreground-secondary">
            {KAKAO_LOGIN_MESSAGES.copyPlaceholder}
          </p>
        </div>
      </div>
      <div className="relative pt-3">
        {loginError && (
          <div
            role="alert"
            className="absolute inset-x-0 bottom-full flex items-center gap-2 rounded-lg bg-inverse px-4 py-1.5 text-inverse-foreground"
          >
            <span className="relative shrink-0">
              <span className="absolute inset-1/4 rounded-md bg-inverse-foreground" />
              <CircleCloseIcon className="relative text-destructive" />
            </span>
            <p className="min-w-0 px-0.5 py-1 text-body-md whitespace-pre-line opacity-88">
              {loginError}
            </p>
          </div>
        )}
        <Button
          type="button"
          size="lg"
          fullWidth
          className="gap-2.5 bg-kakao text-kakao-foreground hover:bg-kakao/90"
          style={{ height: "var(--kakao-button-height)" }}
          onClick={handleKakaoLogin}
        >
          <KakaoIcon className="size-5" />
          <span className="text-kakao-label">{KAKAO_LOGIN_MESSAGES.continueWithKakao}</span>
        </Button>
      </div>
    </section>
  );
}
