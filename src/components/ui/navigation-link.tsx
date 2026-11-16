import { cva } from "class-variance-authority";
import Link from "next/link";
import { type ComponentProps } from "react";

const navigationLinkVariants = cva(
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

function NavigationLink({
  active = false,
  ...props
}: Omit<ComponentProps<typeof Link>, "className" | "aria-current"> & { active?: boolean }) {
  return (
    <Link
      className={navigationLinkVariants({ active })}
      aria-current={active ? "page" : undefined}
      {...props}
    />
  );
}

export { NavigationLink };
