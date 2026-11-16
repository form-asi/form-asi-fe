import { AppShell } from "@/components/common/app-shell";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
