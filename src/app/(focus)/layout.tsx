import { AppShell } from "@/components/common/app-shell";
import { AuthGate } from "@/providers/auth-gate";

export default function FocusLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
