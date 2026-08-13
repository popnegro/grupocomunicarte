import { useState } from 'react';
import { Monitor } from 'lucide-react';

interface SupportImageProps {
  src?: string;
  alt: string;
  className?: string;
  supportName?: string;
  supportType?: string;
}

export function SupportImage({
  src,
  alt,
  className = '',
  supportName,
  supportType
}: SupportImageProps) {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <div className={`bg-[#082028] flex flex-col items-center justify-center p-3 text-center border border-[#7C3AED]/20 select-none ${className}`}>
        <div className="p-2 bg-[#7C3AED]/20 text-[#7C3AED] rounded-lg mb-1">
          <Monitor className="w-5 h-5" />
        </div>
        {supportType && (
          <span className="text-[8px] uppercase font-extrabold text-[#7C3AED] tracking-wider block">
            {supportType}
          </span>
        )}
        <span className="text-[10px] font-extrabold text-white line-clamp-1 max-w-[90%]">
          {supportName || alt || 'Soporte Publicitario'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}
