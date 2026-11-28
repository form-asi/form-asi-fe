"use client";

import { redirect, useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { AuthGate } from "@/providers/auth-gate";

export function KakaoCallback() {
  const errorCode = useSearchParams().get("error");
  if (errorCode !== null) {
    redirect(`${ROUTES.login}?${new URLSearchParams({ error: errorCode })}`);
  }
  return <AuthGate>{null}</AuthGate>;
}
