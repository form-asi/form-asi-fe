import { AppShell } from "@/components/common/app-shell";

export default function FocusLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
