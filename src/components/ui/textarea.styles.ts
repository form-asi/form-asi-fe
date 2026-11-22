import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  "flex field-sizing-content min-h-24 w-full resize-y rounded-md border border-input bg-background p-3 text-body-md transition-colors outline-none placeholder:text-foreground-quaternary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
);
