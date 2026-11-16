import { cva } from "class-variance-authority";

export const radioVariants = cva(
  "relative flex shrink-0 items-center border border-input outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "size-4 rounded-full",
        card: "min-h-control w-full rounded-lg bg-background px-2.5 py-2 text-left text-sm",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
