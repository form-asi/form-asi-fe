import { type ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  header?: ReactNode;
  navigation?: ReactNode;
};

/** @description navigation 유무에 따른 탭 바·하단 CTA 공간 확보 */
function AppShell({ children, header, navigation }: AppShellProps) {
  return (
    <div
      data-slot="app-shell"
      data-navigation={Boolean(navigation)}
      className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-background pt-safe-top pr-safe-right pb-app-bottom pl-safe-left"
    >
      {header}
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
      {navigation}
    </div>
  );
}

export { AppShell };
