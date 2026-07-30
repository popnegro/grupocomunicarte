import React from "react";

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
      <span className="inline-block text-[10px] bg-[#06434a]/10 border border-[#06434a]/20 text-[#06434a] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full font-sans">
        {badge}
      </span>
      <h2 className="text-3xl md:text-4xl tracking-tight text-stone-900 font-display font-semibold">
        {title}
      </h2>
      <p className="text-stone-500 text-sm md:text-base leading-relaxed font-sans font-normal">
        {description}
      </p>
    </div>
  );
};
