import { cva } from "class-variance-authority";

export const alertDialogContentVariants = cva(
  "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid max-h-dialog-height w-dialog-width -translate-1/2 gap-dialog-gap overflow-y-auto rounded-xl border bg-popover p-dialog-inset text-popover-foreground duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      size: { default: "max-w-dialog", sm: "max-w-dialog-sm" },
    },
    defaultVariants: { size: "default" },
  },
);

export const alertDialogStyles = {
  overlay:
    "fixed inset-0 isolate z-50 bg-overlay duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
  media:
    "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
  title:
    "font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
  description:
    "text-sm whitespace-pre-line text-popover-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
} as const;
