import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'full' | 'icon' | 'monochrome' | 'app-icon';
}

/**
 * Authentic Palate Logomark Icon
 * Colors:
 * - Outer 'P' stem/loop: Forest Green (#0F5132)
 * - Inner droplet core: Tomato Red (#EF4E3A)
 * - Sprouting accent leaves: Mango Yellow (#F6B21A)
 */
export const PalateIcon: React.FC<{
  className?: string;
  size?: number;
  monochrome?: boolean;
}> = ({ className = '', size = 36, monochrome = false }) => {
  const green = monochrome ? '#3A2E28' : '#0F5132';
  const red = monochrome ? '#3A2E28' : '#EF4E3A';
  const yellow = monochrome ? '#3A2E28' : '#F6B21A';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Palate Logo Mark"
    >
      {/* Mango Yellow Sprouting Leaves at top right */}
      <g id="palate-leaves">
        <path
          d="M 66 22 C 60 14, 63 6, 70 3 C 77 0, 81 7, 78 15 C 75 22, 69 25, 66 22 Z"
          fill={yellow}
        />
        <path
          d="M 76 31 C 73 24, 78 18, 86 17 C 93 17, 95 24, 91 30 C 86 36, 79 36, 76 31 Z"
          fill={yellow}
        />
      </g>

      {/* Forest Green Outer 'P' Stem and Loop */}
      <path
        id="palate-spine"
        d="M 28 32
           C 28 17, 44 9, 62 16
           C 78 23, 84 39, 81 54
           C 77 70, 60 76, 46 74
           C 41 73, 38 78, 38 88
           C 38 98, 38 104, 28 104
           C 20 104, 20 96, 20 86
           C 20 62, 20 44, 28 32 Z"
        fill={green}
      />

      {/* Tomato Red Inner Core / Flavor Droplet */}
      <path
        id="palate-core"
        d="M 46 38
           C 46 38, 63 39, 64 51
           C 64 61, 52 64, 46 57
           C 41 51, 46 38, 46 38 Z"
        fill={red}
      />
    </svg>
  );
};

/**
 * Palate App Icon (Squircle badge matching the official App Icon)
 */
export const PalateAppIcon: React.FC<{
  className?: string;
  size?: number;
}> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Palate App Icon"
    >
      {/* Forest Green Rounded Container */}
      <rect width="120" height="120" rx="30" fill="#0F5132" />

      {/* Yellow Sprouting Leaves */}
      <path
        d="M 77 28 C 72 21, 75 14, 81 11 C 87 9, 90 15, 88 22 C 85 28, 80 30, 77 28 Z"
        fill="#F6B21A"
      />
      <path
        d="M 86 36 C 83 30, 87 25, 94 24 C 100 24, 102 30, 98 35 C 94 40, 88 40, 86 36 Z"
        fill="#F6B21A"
      />

      {/* White 'P' Contour */}
      <path
        d="M 43 38
           C 43 25, 57 18, 73 24
           C 87 30, 92 44, 89 57
           C 86 71, 71 76, 59 74
           C 54 73, 51 77, 51 86
           C 51 94, 51 99, 43 99
           C 36 99, 36 92, 36 84
           C 36 63, 36 48, 43 38 Z"
        fill="#FFFFFF"
      />

      {/* Tomato Red Inner Droplet */}
      <path
        d="M 58 43
           C 58 43, 73 44, 74 54
           C 74 63, 63 66, 58 60
           C 54 54, 58 43, 58 43 Z"
        fill="#EF4E3A"
      />
    </svg>
  );
};

/**
 * Main Palate Brand Logo
 * Combines Icon + Organic Wordmark + Tagline
 */
export const PalateLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  variant = 'full',
}) => {
  if (variant === 'app-icon') {
    const iconSize = size === 'sm' ? 32 : size === 'md' ? 44 : size === 'lg' ? 56 : 72;
    return <PalateAppIcon size={iconSize} className={className} />;
  }

  if (variant === 'icon') {
    const iconSize = size === 'sm' ? 28 : size === 'md' ? 36 : size === 'lg' ? 48 : 64;
    return <PalateIcon size={iconSize} className={className} />;
  }

  const isMonochrome = variant === 'monochrome';
  const iconPixelSize = size === 'sm' ? 28 : size === 'md' ? 36 : size === 'lg' ? 48 : 58;

  const titleSizeClass =
    size === 'sm'
      ? 'text-lg tracking-tight'
      : size === 'md'
      ? 'text-2xl tracking-tight'
      : size === 'lg'
      ? 'text-3xl sm:text-4xl tracking-tight'
      : 'text-4xl sm:text-5xl tracking-tight';

  const taglineSizeClass =
    size === 'sm'
      ? 'text-[7.5px] tracking-[0.2em]'
      : size === 'md'
      ? 'text-[9px] tracking-[0.25em]'
      : size === 'lg'
      ? 'text-[11px] tracking-[0.28em]'
      : 'text-[13px] tracking-[0.3em]';

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* Icon Mark */}
      <PalateIcon size={iconPixelSize} monochrome={isMonochrome} />

      {/* Wordmark & Tagline */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-black font-sans leading-none ${
            isMonochrome ? 'text-[#3A2E28]' : 'text-[#0F5132]'
          } ${titleSizeClass}`}
          style={{ letterSpacing: '-0.03em' }}
        >
          palate
        </span>
        {showTagline && (
          <span
            className={`font-extrabold uppercase mt-1 text-[#3A2E28]/70 ${taglineSizeClass}`}
          >
            FOOD WORTH TALKING ABOUT
          </span>
        )}
      </div>
    </div>
  );
};

export default PalateLogo;
