"use client";

import { usePathname } from "next/navigation";
import { NavigationLink } from "@/components/ui/navigation-link";
import { UI_MESSAGES } from "@/lib/ui-messages";

const APP_TABS = [
  { href: "/", label: "홈" },
  { href: "/explore", label: "탐색" },
  { href: "/my-survey", label: "내 설문" },
  { href: "/my-page", label: "마이페이지" },
] as const;

function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label={UI_MESSAGES.mainNavigation}
      className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-app -translate-x-1/2 border-t bg-muted pr-safe-right pb-safe-bottom pl-safe-left"
    >
      {APP_TABS.map((tab) => {
        const isCurrentTab =
          pathname === tab.href || (tab.href !== "/" && pathname.startsWith(`${tab.href}/`));
        return (
          <NavigationLink key={tab.href} href={tab.href} active={isCurrentTab}>
            {tab.label}
          </NavigationLink>
        );
      })}
    </nav>
  );
}

export { TabBar };
