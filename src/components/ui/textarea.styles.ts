import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  "flex field-sizing-content min-h-16 w-full resize-y rounded-lg border border-input bg-background px-2.5 py-2 text-label-lg transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
);
