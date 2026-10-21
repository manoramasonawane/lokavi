import React from 'react';

interface LokaviLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'light' | 'monochrome';
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const LokaviLogo: React.FC<LokaviLogoProps> = ({
  size = 'md',
  variant = 'default',
  showTagline = true,
  className = '',
  iconOnly = false,
}) => {
  // Color tokens according to Lokavi brand identity:
  // Forest green: #354D43, Soft sage: #E8EBE2, Warm ivory: #F7F4ED, Sand: #C9A982, Charcoal: #29323A
  const isLight = variant === 'light';

  // Sizing definitions
  const iconSize = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const wordmarkSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }[size];

  const taglineSize = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[10px] tracking-wide',
    lg: 'text-xs tracking-wider',
    xl: 'text-sm tracking-wider',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Lokavi Minimal Elegant Logo Mark: Location Pin + Compass/Map Symbol */}
      <div
        className={`relative ${iconSize} shrink-0 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
          isLight
            ? 'bg-[#E8EBE2]/10 border border-[#E8EBE2]/25 shadow-inner'
            : 'bg-[#354D43] border border-[#354D43]/20 shadow-xs'
        }`}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5"
          aria-hidden="true"
        >
          {/* Subtle Outer Compass Horizon Ring */}
          <circle
            cx="20"
            cy="18"
            r="12"
            stroke={isLight ? '#C9A982' : '#C9A982'}
            strokeWidth="1.25"
            strokeDasharray="2 3"
            opacity="0.65"
          />

          {/* Minimal Location Pin Shape */}
          <path
            d="M20 5C13.9249 5 9 9.92487 9 16C9 23.2 18.2 31.8 19.35 32.85C19.72 33.19 20.28 33.19 20.65 32.85C21.8 31.8 31 23.2 31 16C31 9.92487 26.0751 5 20 5Z"
            fill={isLight ? '#E8EBE2' : '#354D43'}
            stroke={isLight ? '#F7F4ED' : '#C9A982'}
            strokeWidth="1.5"
          />

          {/* Elegant Compass Star & Diamond embedded in the Pin head */}
          {/* North Point */}
          <path
            d="M20 9L21.8 15.8L20 17.5L18.2 15.8L20 9Z"
            fill="#C9A982"
          />
          {/* South Point */}
          <path
            d="M20 23L18.2 17.5L20 16.5L21.8 17.5L20 23Z"
            fill={isLight ? '#354D43' : '#E8EBE2'}
          />
          {/* East Point */}
          <path
            d="M26 16.5L20.5 17.8L19.5 16.5L20.5 15.2L26 16.5Z"
            fill={isLight ? '#C9A982' : '#C9A982'}
            opacity="0.85"
          />
          {/* West Point */}
          <path
            d="M14 16.5L19.5 15.2L20.5 16.5L19.5 17.8L14 16.5Z"
            fill={isLight ? '#C9A982' : '#C9A982'}
            opacity="0.85"
          />

          {/* Central Compass Pivot Dot */}
          <circle
            cx="20"
            cy="16.5"
            r="2"
            fill={isLight ? '#354D43' : '#F7F4ED'}
            stroke="#C9A982"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Refined lowercase "lokavi" wordmark + Tagline */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-sans font-extrabold lowercase tracking-tight leading-none ${wordmarkSize} ${
                isLight ? 'text-[#F7F4ED]' : 'text-[#29323A]'
              }`}
              style={{ letterSpacing: '-0.04em' }}
            >
              lokavi
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLight ? 'bg-[#C9A982]' : 'bg-[#354D43]'
              }`}
            />
          </div>

          {showTagline && (
            <span
              className={`font-medium ${taglineSize} ${
                isLight ? 'text-[#C9A982]' : 'text-[#354D43]/85'
              } mt-0.5`}
            >
              Discover the Local Within.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
