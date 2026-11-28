import { Suspense } from "react";
import { KakaoCallback } from "@/features/onboarding/kakao-callback";

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <KakaoCallback />
    </Suspense>
  );
}
