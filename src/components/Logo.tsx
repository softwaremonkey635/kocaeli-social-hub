import React, { useState } from 'react';

const BASE = import.meta.env.BASE_URL;

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark' | 'default';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'default',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const iconDimensions = {
    sm: 36,
    md: 46,
    lg: 64,
    xl: 84
  }[size];

  const titleSizeClass = {
    sm: 'text-base font-extrabold tracking-wider',
    md: 'text-xl font-black tracking-wider',
    lg: 'text-2xl font-black tracking-wider',
    xl: 'text-3xl font-black tracking-wider'
  }[size];

  const subtitleSizeClass = {
    sm: 'text-[9px] tracking-[0.2em] font-semibold',
    md: 'text-[11px] tracking-[0.22em] font-bold',
    lg: 'text-xs tracking-[0.25em] font-bold',
    xl: 'text-sm tracking-[0.28em] font-bold'
  }[size];

  const textColor = variant === 'light' ? 'text-white' : variant === 'dark' ? 'text-slate-900' : 'text-white';
  const subtitleColor = variant === 'light' ? 'text-slate-300' : variant === 'dark' ? 'text-slate-600' : 'text-slate-400';

  return (
    <div className={`group/logo flex items-center gap-2.5 select-none cursor-pointer ${className}`}>
      {/* Official Community Logo Image with Tasteful, Sleek Hover State */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Subtle, soft ambient glow on hover */}
        <div
          className="absolute -inset-1 rounded-full bg-[#009cb4]/20 opacity-0 group-hover:opacity-100 group-hover/logo:opacity-100 blur-xs transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />

        {/* Clean border ring with smooth hover shift */}
        <div className="relative rounded-full p-[1.5px] bg-slate-700/60 group-hover:bg-[#009cb4] group-hover/logo:bg-[#009cb4] transition-colors duration-300 shadow-sm">
          <div className="relative rounded-full overflow-hidden flex items-center justify-center bg-slate-950">
            {!imgError ? (
              <img
                src={`${BASE}images/logo/kocaeli-logo.jpeg`}
                alt="Kocaeli Social Hub Logo"
                width={iconDimensions}
                height={iconDimensions}
                onError={() => setImgError(true)}
                className="shrink-0 rounded-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover/logo:scale-105"
                style={{ width: iconDimensions, height: iconDimensions }}
              />
            ) : (
              /* Fallback SVG */
              <svg
                width={iconDimensions}
                height={iconDimensions}
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 transition-transform duration-300 group-hover:scale-105"
                role="img"
                aria-label="Kocaeli Social Hub Amblemi"
              >
                <circle cx="100" cy="100" r="94" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <circle cx="100" cy="100" r="76" stroke="#009cb4" strokeWidth="3" opacity="0.5" />
                <circle cx="100" cy="100" r="44" fill="#1e293b" stroke="#f27721" strokeWidth="3" />
                <path d="M100 60 L104 70 L96 70 Z" fill="#009cb4" />
                <rect x="91" y="75" width="18" height="18" rx="2" fill="#ffffff" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Brand Text - Clean natural Turkish 'İ' without any artificial overlapping dot */}
      {showText && (
        <div className="flex flex-col shrink-0 whitespace-nowrap transition-transform duration-200 group-hover:translate-x-0.5">
          <div className={`font-display ${titleSizeClass} ${textColor} leading-none flex items-center tracking-tight transition-colors duration-200`}>
            <span>KOCAEL</span>
            <span className="text-[#009cb4] group-hover:text-[#f27721] transition-colors">İ</span>
          </div>
          <span className={`font-sans ${subtitleSizeClass} ${subtitleColor} uppercase tracking-[0.22em] mt-0.5 transition-colors duration-200 group-hover:text-[#009cb4]`}>
            SOCIAL HUB
          </span>
        </div>
      )}
    </div>
  );
};
