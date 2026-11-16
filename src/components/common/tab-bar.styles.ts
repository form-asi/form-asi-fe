import { cva } from "class-variance-authority";

export const tabLinkVariants = cva(
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

export const tabBarStyles = {
  navigation:
    "fixed bottom-0 left-1/2 z-20 flex w-full max-w-app -translate-x-1/2 border-t bg-muted pr-safe-right pb-safe-bottom pl-safe-left",
} as const;
