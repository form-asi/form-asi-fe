import { type ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  description?: string;
  id?: string;
};

function SectionLabel({ children, description, id }: SectionLabelProps) {
  return (
    <h2
      id={id}
      className="flex flex-wrap items-baseline gap-field-gap rounded-sm bg-secondary px-section-label-x py-section-label-y text-caption-lg font-bold text-secondary-foreground"
    >
      {children}
      {description && <span className="font-normal text-muted-foreground">{description}</span>}
    </h2>
  );
}

export { SectionLabel };
