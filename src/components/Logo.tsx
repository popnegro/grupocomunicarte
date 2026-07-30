import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  variant?: "light" | "dark" | "auto";
  src?: string; // Optional dynamic logo image URL
  alt?: string; // Optional alt text for screen readers
  brandName?: string; // Optional dynamic brand name
  brandSubtitle?: string; // Optional dynamic subtitle
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  iconOnly = false,
  variant = "auto",
  src,
  alt = "Logo Grupo Comunicarte",
  brandName = "Grupo Comunicarte",
  brandSubtitle = "Medios & Vía Pública"
}) => {
  // Brand Green (exactly matches the uploaded image logo)
  const brandGreen = "#00A650";

  // Text color based on light/dark variant
  const textClass =
    variant === "light"
      ? "text-white"
      : variant === "dark"
      ? "text-slate-900"
      : "text-slate-900 dark:text-white";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon or Dynamic Image Container */}
      <div className="h-9 w-9 shrink-0 flex items-center justify-center overflow-hidden rounded-lg">
        {src ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain"
          />
        ) : (
          /* Accessible vector brand icon fallback */
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full"
            aria-hidden="true"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Three vertical rounded bars representing signal / communications (OOH impact) */}
            <rect x="12" y="42" width="7" height="36" rx="3.5" fill={brandGreen} />
            <rect x="25" y="30" width="7" height="60" rx="3.5" fill={brandGreen} />
            <rect x="38" y="18" width="7" height="84" rx="3.5" fill={brandGreen} />

            {/* Perspective 3D billboard frame / stylized 'C' representing media screens */}
            <path
              d="M 52 18
                 L 108 26
                 L 108 48
                 L 99 48
                 L 99 33
                 L 61 27
                 L 61 93
                 L 99 87
                 L 99 72
                 L 108 72
                 L 108 94
                 L 52 102
                 Z"
              fill={brandGreen}
            />
          </svg>
        )}
      </div>

      {/* Brand text */}
      {!iconOnly && (
        <div className="flex flex-col">
          <span className={`font-extrabold text-base md:text-lg tracking-tight font-sans leading-none ${textClass}`}>
            {brandName}
          </span>
          <span className="text-[9px] text-[#00A650] font-black uppercase tracking-widest mt-0.5 font-sans">
            {brandSubtitle}
          </span>
        </div>
      )}
    </div>
  );
};
