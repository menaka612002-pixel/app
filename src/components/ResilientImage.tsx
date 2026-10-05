import React, { useState } from 'react';
import { Scissors } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackSubtitle,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F4F1EA] via-[#EAE5DC] to-[#DFD8CC] text-[#141413] p-6 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <Scissors className="w-6 h-6 text-[#736E65] mb-3 stroke-[1.25]" />
        <span className="font-display text-lg font-normal tracking-tight text-[#141413]">
          {fallbackTitle || alt}
        </span>
        {fallbackSubtitle && (
          <span className="mt-1 text-xs text-[#6E6A63]">
            {fallbackSubtitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
