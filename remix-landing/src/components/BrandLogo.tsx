import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  className = '', 
  variant = 'full',
  size = 'md' 
}) => {
  const heightMap = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Symbol: 5 Isometric Green Pillars forming 'C' */}
      <svg 
        viewBox="0 0 120 100" 
        className={`${heightMap[size]} w-auto shrink-0`} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pillar 1 - Far Left Smallest */}
        <path d="M10 40L18 35V65L10 60V40Z" fill="#049A41" opacity="0.7" />
        {/* Pillar 2 */}
        <path d="M22 34L30 29V71L22 66V34Z" fill="#049A41" opacity="0.85" />
        {/* Pillar 3 */}
        <path d="M34 27L42 22V78L34 73V27Z" fill="#049A41" />
        {/* Pillar 4 - Main Vertical Spine */}
        <path d="M46 20L56 14V86L46 80V20Z" fill="#049A41" />
        {/* Outer C-Frame Top Bar */}
        <path d="M56 14L105 28V40L56 26V14Z" fill="#049A41" />
        {/* Outer C-Frame Bottom Bar */}
        <path d="M56 86L105 72V60L56 74V86Z" fill="#049A41" />
      </svg>

      {variant === 'full' && (
        <div className="flex flex-col justify-center">
          <span 
            className="font-extrabold tracking-tight text-[#082028] leading-none"
            style={{ 
              fontFamily: "'Geist', sans-serif",
              fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.25rem' : '1.5rem',
              letterSpacing: '-0.03em'
            }}
          >
            Grupo Comunicarte
          </span>
          <span 
            className="text-[9px] font-bold text-[#40515A] uppercase tracking-[0.2em] mt-0.5 leading-none"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Publicidad Exterior • LED
          </span>
        </div>
      )}
    </div>
  );
};
