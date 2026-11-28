import { Suspense } from "react";
import { KakaoLogin } from "@/features/onboarding/kakao-login";

export default function LoginPage() {
  return (
    <Suspense>
      <KakaoLogin />
    </Suspense>
  );
}
