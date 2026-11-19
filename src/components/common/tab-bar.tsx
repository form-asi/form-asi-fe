"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabBarStyles, tabLinkVariants } from "@/components/common/tab-bar.styles";
import { ROUTES } from "@/lib/routes";
import { UI_MESSAGES } from "@/lib/ui-messages";

const APP_TABS = [
  { href: ROUTES.home, label: "홈" },
  { href: ROUTES.explore, label: "탐색" },
  { href: ROUTES.mySurvey, label: "내 설문" },
  { href: ROUTES.myPage, label: "마이페이지" },
] as const;

function TabBar() {
  const pathname = usePathname();
  return (
    <nav aria-label={UI_MESSAGES.mainNavigation} className={tabBarStyles.navigation}>
      {APP_TABS.map((tab) => {
        const isCurrentTab =
          pathname === tab.href ||
          (tab.href !== ROUTES.home && pathname.startsWith(`${tab.href}/`));
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
