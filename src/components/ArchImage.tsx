'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ArchImageProps {
  src?: string;
  alt: string;
  size?: 'card' | 'hero' | 'thumb';
  isVeg?: boolean;
  isSaved?: boolean;
  onToggleSave?: (e: React.MouseEvent) => void;
  categoryBadge?: string;
  priority?: boolean;
}

export const ArchImage: React.FC<ArchImageProps> = ({
  src,
  alt,
  size = 'card',
  isVeg,
  isSaved = false,
  onToggleSave,
  categoryBadge,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  // Geometry dimensions per size
  const isThumb = size === 'thumb';
  const isHero = size === 'hero';

  const outerRadius = isThumb 
    ? 'rounded-[999px_999px_12px_12px] p-[3px]' 
    : isHero 
    ? 'rounded-[999px_999px_26px_26px] p-[7px]' 
    : 'rounded-[999px_999px_22px_22px] p-[7px]';

  const innerRadius = isThumb 
    ? 'rounded-[999px_999px_9px_9px]' 
    : isHero 
    ? 'rounded-[999px_999px_20px_20px]' 
    : 'rounded-[999px_999px_16px_16px]';

  const aspectClass = isThumb 
    ? 'w-18 h-24 shrink-0' 
    : isHero 
    ? 'w-full aspect-[16/11]' 
    : 'w-full aspect-[4/3]';

  return (
    <div 
      className={`relative border border-gold-light bg-ivory shadow-arch flex items-center justify-center transition-transform ${outerRadius} ${aspectClass}`}
    >
      {/* Inner Arch Container with 1px Gold-Light hairline border */}
      <div className={`w-full h-full relative overflow-hidden border border-gold-light bg-card ${innerRadius}`}>
        {src && !hasError ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={isThumb ? '96px' : isHero ? '430px' : '400px'}
            className="object-cover transition-transform duration-700 hover:scale-105"
            priority={priority}
            onError={() => setHasError(true)}
          />
        ) : (
          /* Designed Fine-Dining Plate Placeholder (Never a wrong image) */
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none"
            style={{
              background: 'radial-gradient(circle at center, #FFFDF8 0%, #F4ECE0 70%, #E6DCBE 100%)',
            }}
          >
            <div className="w-16 h-16 rounded-full border border-gold-light/60 flex items-center justify-center shadow-subtle bg-white/40 mb-2">
              <span className="font-serif italic text-gold text-2xl font-bold">P.</span>
            </div>
            <span className="font-serif text-espresso text-xs font-semibold max-w-[130px] line-clamp-2 leading-tight">
              {alt}
            </span>
            <span className="text-[9px] uppercase tracking-overline text-muted mt-0.5">
              Curator Selection
            </span>
          </div>
        )}

        {/* Subtle Bottom Vignette on Card & Hero */}
        {!isThumb && (
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent pointer-events-none" />
        )}
      </div>

      {/* Veg / Non-Veg Badge (Shape + Color differentiated) */}
      {isVeg !== undefined && !isThumb && (
        <div className="absolute top-4 left-4 z-10">
          <div 
            className={`w-5 h-5 rounded-sm p-0.5 flex items-center justify-center backdrop-blur-md shadow-subtle ${
              isVeg 
                ? 'border border-god-tier/80 bg-[#FFFDF8]/90' 
                : 'border border-oxblood/80 bg-[#FFFDF8]/90'
            }`}
            title={isVeg ? 'Vegetarian (Green Circle)' : 'Non-Vegetarian (Red Triangle)'}
          >
            {isVeg ? (
              <span className="w-2.5 h-2.5 rounded-full bg-god-tier" />
            ) : (
              <span 
                className="w-0 h-0 border-x-[5px] border-x-transparent border-b-[8px] border-b-oxblood"
              />
            )}
          </div>
        </div>
      )}

      {/* Save Heart Button (Top-Right with tactile spring) */}
      {onToggleSave && !isThumb && (
        <motion.button
          type="button"
          onClick={onToggleSave}
          whileTap={{ scale: 0.85 }}
          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md shadow-subtle cursor-pointer transition-colors ${
            isSaved 
              ? 'bg-espresso border-gold text-gold-light' 
              : 'bg-card/90 border-hairline text-espresso/70 hover:text-espresso hover:border-gold'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save dish'}
        >
          <motion.div
            animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.25 }}
          >
            <Heart 
              className={`w-4 h-4 ${isSaved ? 'fill-gold-light text-gold-light' : ''}`} 
            />
          </motion.div>
        </motion.button>
      )}

      {/* Category Badge (Bottom-Center in Espresso / Gold) */}
      {categoryBadge && !isThumb && (
        <div className="absolute -bottom-2.5 inset-x-0 z-10 flex justify-center pointer-events-none">
          <span className="bg-espresso text-gold-light text-[10px] font-bold uppercase tracking-luxury px-3.5 py-0.5 rounded-full border border-gold-light/40 shadow-subtle">
            {categoryBadge}
          </span>
        </div>
      )}
    </div>
  );
};
