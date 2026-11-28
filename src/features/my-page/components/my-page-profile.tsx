import { UserRound } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button.styles";
import { MY_PAGE_MESSAGES } from "@/features/my-page/my-page-messages";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function MyPageProfile({ nickname }: { nickname: string }) {
  return (
    <div className="flex items-center gap-3 px-1.5">
      <div
        aria-hidden="true"
        className="flex size-12.5 shrink-0 items-center justify-center rounded-full bg-muted text-foreground-tertiary"
      >
        <UserRound className="size-6" />
      </div>
      <p className="min-w-0 flex-1 text-label-lg font-semibold break-all">{nickname}</p>
      <Link
        href={ROUTES.profileEdit}
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "sm",
            className: "rounded-sm border-line-strong px-3 text-label-sm font-semibold",
          }),
        )}
      >
        {MY_PAGE_MESSAGES.editProfile}
      </Link>
    </div>
  );
}
