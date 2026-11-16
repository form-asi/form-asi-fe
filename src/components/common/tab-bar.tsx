"use client";

import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UI_MESSAGES } from "@/lib/ui-messages";

const APP_TABS = [
  { href: "/", label: "홈" },
  { href: "/explore", label: "탐색" },
  { href: "/my-survey", label: "내 설문" },
  { href: "/my-page", label: "마이페이지" },
] as const;

const tabLinkVariants = cva(
  "flex min-h-tab-bar min-w-0 flex-1 items-center justify-center text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset",
  {
    variants: {
      active: {
        true: "font-bold text-foreground",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: { active: false },
  },
);

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
          <Link
            key={tab.href}
            href={tab.href}
            className={tabLinkVariants({ active: isCurrentTab })}
            aria-current={isCurrentTab ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export { TabBar };
