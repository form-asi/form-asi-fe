import { cva } from "class-variance-authority";

export const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-label-md font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent data-pressed:bg-muted",
        chip: "h-control-sm rounded-full bg-secondary px-3 text-label-lg text-secondary-foreground hover:bg-secondary-hover data-pressed:bg-inverse data-pressed:text-inverse-foreground",
        segmented:
          "h-11 flex-1 rounded-lg border border-border bg-background px-5 text-label-lg text-foreground hover:bg-muted data-pressed:border-primary data-pressed:bg-primary data-pressed:font-semibold data-pressed:text-primary-foreground",
        outline: "border border-input bg-transparent hover:bg-muted data-pressed:bg-muted",
      },
      size: {
        default:
          "h-control-sm min-w-control-sm px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-control-xs min-w-control-xs px-2.5 text-label-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-control min-w-control px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
