import React from "react";

export const BrandBrainIcon = ({ className = "w-11 h-11", size }) => {
  const customStyle = size ? { width: size, height: size } : undefined;
  
  return (
    <svg
      viewBox="85 85 330 280"
      className={className}
      style={customStyle}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
    >
      <defs>
        {/* Left Navy Gradient - High Contrast */}
        <linearGradient id="brandLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#001438" />
          <stop offset="50%" stopColor="#001F54" />
          <stop offset="100%" stopColor="#003580" />
        </linearGradient>

        {/* Right Azure/Cyan Gradient - Vibrant & Clear */}
        <linearGradient id="brandRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0072B5" />
          <stop offset="50%" stopColor="#0091D5" />
          <stop offset="100%" stopColor="#00B8EB" />
        </linearGradient>

        <filter id="brandBrainShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#001438" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter="url(#brandBrainShadow)">
        {/* LEFT HEMISPHERE (DEEP NAVY) */}
        <g fill="url(#brandLeftGrad)">
          {/* Multi-lobed brain outer contour */}
          <path d="M 235 95 
                   C 215 92, 195 98, 180 115 
                   C 155 110, 130 130, 125 155 
                   C 105 165, 95 195, 105 220 
                   C 92 238, 95 270, 110 290 
                   C 105 315, 125 345, 155 355 
                   C 185 365, 215 350, 235 330 
                   L 235 285 
                   L 190 285 
                   L 190 215 
                   L 235 215 
                   Z" />
          
          {/* Crisp White Circuit lines & terminal nodes */}
          <path d="M 160 170 C 185 170, 205 145, 215 125" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="160" cy="170" r="7" fill="#FFFFFF" />
          
          <path d="M 135 230 C 160 230, 185 210, 195 200" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="135" cy="230" r="7" fill="#FFFFFF" />
          
          <path d="M 145 295 C 170 295, 195 310, 215 320" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="145" cy="295" r="7" fill="#FFFFFF" />

          {/* Peripheral crisp nodes */}
          <circle cx="120" cy="180" r="5.5" fill="#FFFFFF" />
          <circle cx="115" cy="260" r="5.5" fill="#FFFFFF" />
          <circle cx="180" cy="340" r="5.5" fill="#FFFFFF" />

          {/* Lower accent arc */}
          <path d="M 125 310 C 135 325, 150 330, 160 330" stroke="#94A3B8" strokeWidth="5.5" strokeLinecap="round" opacity="0.75" />
        </g>

        {/* RIGHT HEMISPHERE (VIBRANT SKY BLUE) */}
        <g fill="url(#brandRightGrad)">
          {/* Multi-lobed brain outer contour */}
          <path d="M 265 95 
                   C 285 92, 305 98, 320 115 
                   C 345 110, 370 130, 375 155 
                   C 395 165, 405 195, 395 220 
                   C 408 238, 405 270, 390 290 
                   C 395 315, 375 345, 345 355 
                   C 315 365, 285 350, 265 330 
                   L 265 285 
                   L 310 285 
                   L 310 215 
                   L 265 215 
                   Z" />

          {/* Crisp White Circuit lines & terminal nodes */}
          <path d="M 340 170 C 315 170, 295 145, 285 125" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="340" cy="170" r="7" fill="#FFFFFF" />

          <path d="M 365 230 C 340 230, 315 210, 305 200" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="365" cy="230" r="7" fill="#FFFFFF" />

          <path d="M 355 295 C 330 295, 305 310, 285 320" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="355" cy="295" r="7" fill="#FFFFFF" />

          {/* Peripheral crisp nodes */}
          <circle cx="380" cy="180" r="5.5" fill="#FFFFFF" />
          <circle cx="385" cy="260" r="5.5" fill="#FFFFFF" />
          <circle cx="320" cy="340" r="5.5" fill="#FFFFFF" />

          {/* Lower accent arc */}
          <path d="M 375 310 C 365 325, 350 330, 340 330" stroke="#CBD5E1" strokeWidth="5.5" strokeLinecap="round" opacity="0.75" />
        </g>

        {/* CENTER MEDICAL CROSS (PURE WHITE WITH CRISP ROUNDED CAPS) */}
        <g fill="#FFFFFF">
          <rect x="233" y="170" width="34" height="160" rx="17" />
          <rect x="170" y="233" width="160" height="34" rx="17" />
        </g>
      </g>
    </svg>
  );
};

export const BrandLogo = ({
  showText = true,
  iconSize = "w-11 h-11 sm:w-12 sm:h-12",
  textClassName = "text-[#001F54] font-bold text-lg sm:text-xl lg:text-2xl tracking-[0.06em] uppercase font-serif",
  tagline = null,
  className = "flex items-center gap-2.5 sm:gap-3"
}) => {
  return (
    <div className={className}>
      <div className={`${iconSize} flex items-center justify-center shrink-0 drop-shadow-sm transition-transform duration-200`}>
        <BrandBrainIcon className="w-full h-full" />
      </div>
      {showText && (
        <div className="shrink-0 flex flex-col justify-center">
          <span className={textClassName}>
            SMRITI SATHI
          </span>
          {tagline && (
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest block">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
