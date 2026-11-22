import Link from "next/link";
import { type ReactNode } from "react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import { UI_MESSAGES } from "@/lib/ui-messages";

// 32px 터치 영역 안의 16px 아이콘을 디자인 위치(좌측 여백 + 4px)에 맞춤
const BACK_OFFSET = "-ml-1";

type HeaderBackAction = { href: string; onBack?: never } | { href?: never; onBack: () => void };

type AppHeaderProps = {
  title?: string;
  back?: HeaderBackAction;
  rightSlot?: ReactNode;
};

function HeaderBackControl({ action }: { action: HeaderBackAction }) {
  if (action.href !== undefined) {
    return (
      <Link
        href={action.href}
        aria-label={UI_MESSAGES.back}
        className={buttonVariants({ variant: "ghost", size: "icon-sm", className: BACK_OFFSET })}
      >
        <ArrowLeftIcon />
      </Link>
    );
  }
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={BACK_OFFSET}
      aria-label={UI_MESSAGES.back}
      onClick={action.onBack}
    >
      <ArrowLeftIcon />
    </Button>
  );
}

function AppHeader({ title, back, rightSlot }: AppHeaderProps) {
  return (
    <header className="flex min-h-header items-center gap-0.5 bg-background px-header-inset">
      {back && <HeaderBackControl action={back} />}
      {title && <h1 className="min-w-0 truncate text-title-sm font-semibold">{title}</h1>}
      {rightSlot && (
        <div className="ml-auto flex shrink-0 items-center gap-layout-gap">{rightSlot}</div>
      )}
    </header>
  );
}

export { AppHeader };
