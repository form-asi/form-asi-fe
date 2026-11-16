import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { UI_MESSAGES } from "@/lib/ui-messages";

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
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <ChevronLeft aria-hidden="true" />
      </Link>
    );
  }
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={UI_MESSAGES.back}
      onClick={action.onBack}
    >
      <ChevronLeft aria-hidden="true" />
    </Button>
  );
}

function AppHeader({ title, back, rightSlot }: AppHeaderProps) {
  return (
    <header className="flex min-h-header items-center gap-layout-gap border-b px-header-inset">
      {back && <HeaderBackControl action={back} />}
      {title && <h1 className="min-w-0 truncate text-sm font-bold">{title}</h1>}
      {rightSlot && (
        <div className="ml-auto flex shrink-0 items-center gap-layout-gap">{rightSlot}</div>
      )}
    </header>
  );
}

export { AppHeader };
