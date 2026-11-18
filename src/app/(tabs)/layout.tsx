import { AppShell } from "@/components/common/app-shell";
import { TabBar } from "@/components/common/tab-bar";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return <AppShell navigation={<TabBar />}>{children}</AppShell>;
}
