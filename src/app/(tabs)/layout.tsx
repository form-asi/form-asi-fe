import { AppShell } from "@/components/common/app-shell";
import { TabBar } from "@/components/common/tab-bar";
import { AuthGate } from "@/providers/auth-gate";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthGate>
      <AppShell navigation={<TabBar />}>{children}</AppShell>
    </AuthGate>
  );
}
