import React from "react";
import { Badge } from "../design-system";

interface SectionHeadingProps {
  id?: string;
  badge: string;
  title: string;
  description: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  badge,
  title,
  description,
  className = "",
}) => {
  return (
    <div id={id} className={`text-center max-w-2xl mx-auto space-y-3.5 ${className}`}>
      <Badge variant="primary">
        {badge}
      </Badge>
      <h2 className="text-3xl md:text-4xl tracking-tight text-stone-900 font-display font-semibold">
        {title}
      </h2>
      <p className="text-stone-500 text-sm md:text-base leading-relaxed font-sans font-normal">
        {description}
      </p>
    </div>
  );
};
