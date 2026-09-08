export const BrainBoostLogo = ({
  className = "",
  iconSize = "w-10 h-10",
  textSize = "text-xl"
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SMRITI SATHI Dual-Hemisphere Brain with Medical Cross */}
      <div className={`${iconSize} relative shrink-0 flex items-center justify-center drop-shadow-sm`}>
        <svg viewBox="85 85 330 280" className="w-full h-full" fill="none" shapeRendering="geometricPrecision">
          <defs>
            <linearGradient id="logoLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#001438" />
              <stop offset="50%" stopColor="#001F54" />
              <stop offset="100%" stopColor="#003580" />
            </linearGradient>
            <linearGradient id="logoRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0072B5" />
              <stop offset="50%" stopColor="#0091D5" />
              <stop offset="100%" stopColor="#00B8EB" />
            </linearGradient>
          </defs>
          <g>
            {/* Left Brain */}
            <g fill="url(#logoLeftGrad)">
              <path d="M 235 95 C 215 92, 195 98, 180 115 C 155 110, 130 130, 125 155 C 105 165, 95 195, 105 220 C 92 238, 95 270, 110 290 C 105 315, 125 345, 155 355 C 185 365, 215 350, 235 330 L 235 285 L 190 285 L 190 215 L 235 215 Z" />
              <path d="M 160 170 C 185 170, 205 145, 215 125" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
              <circle cx="160" cy="170" r="7" fill="#FFFFFF" />
              <path d="M 135 230 C 160 230, 185 210, 195 200" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
              <circle cx="135" cy="230" r="7" fill="#FFFFFF" />
              <path d="M 145 295 C 170 295, 195 310, 215 320" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
              <circle cx="145" cy="295" r="7" fill="#FFFFFF" />
              <circle cx="120" cy="180" r="5.5" fill="#FFFFFF" />
              <circle cx="115" cy="260" r="5.5" fill="#FFFFFF" />
              <circle cx="180" cy="340" r="5.5" fill="#FFFFFF" />
            </g>
            {/* Right Brain */}
            <g fill="url(#logoRightGrad)">
              <path d="M 265 95 C 285 92, 305 98, 320 115 C 345 110, 370 130, 375 155 C 395 165, 405 195, 395 220 C 408 238, 405 270, 390 290 C 395 315, 375 345, 345 355 C 315 365, 285 350, 265 330 L 265 285 L 310 285 L 310 215 L 265 215 Z" />
              <path d="M 340 170 C 315 170, 295 145, 285 125" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
              <circle cx="340" cy="170" r="7" fill="#FFFFFF" />
              <path d="M 365 230 C 340 230, 315 210, 305 200" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
              <circle cx="365" cy="230" r="7" fill="#FFFFFF" />
              <path d="M 355 295 C 330 295, 305 310, 285 320" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
              <circle cx="355" cy="295" r="7" fill="#FFFFFF" />
              <circle cx="380" cy="180" r="5.5" fill="#FFFFFF" />
              <circle cx="385" cy="260" r="5.5" fill="#FFFFFF" />
              <circle cx="320" cy="340" r="5.5" fill="#FFFFFF" />
            </g>
            {/* Medical Cross Center */}
            <g fill="#FFFFFF">
              <rect x="233" y="170" width="34" height="160" rx="17" />
              <rect x="170" y="233" width="160" height="34" rx="17" />
            </g>
          </g>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex items-center tracking-wide font-serif leading-none">
        <span className={`${textSize} text-[#001F54] font-bold uppercase`}>
          SMRITI SATHI
        </span>
      </div>
    </div>
  );
};
export const ElderlyAvatar = ({
  size = "w-12 h-12",
  className = ""
}) => {
  return <div
    className={`${size} rounded-full bg-[#FFE5D9] border-2 border-white shadow-xs overflow-hidden relative flex items-center justify-center shrink-0 ${className}`}
  >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {
    /* Background circle */
  }
        <circle cx="50" cy="50" r="48" fill="#FDE2D2" />
        
        {
    /* Grey curled hair back */
  }
        <path
    d="M20 50 Q16 28 40 22 Q50 18 60 22 Q84 28 80 50 Q88 65 78 72 Q70 78 50 78 Q30 78 22 72 Q12 65 20 50 Z"
    fill="#D8DCE3"
  />
        {
    /* Hair curls detail */
  }
        <circle cx="28" cy="36" r="10" fill="#CBD5E1" />
        <circle cx="42" cy="26" r="11" fill="#E2E8F0" />
        <circle cx="58" cy="26" r="11" fill="#CBD5E1" />
        <circle cx="72" cy="36" r="10" fill="#E2E8F0" />
        <circle cx="22" cy="48" r="9" fill="#CBD5E1" />
        <circle cx="78" cy="48" r="9" fill="#CBD5E1" />

        {
    /* Neck and shirt */
  }
        <path d="M40 76 L60 76 L66 98 L34 98 Z" fill="#F8C6AF" />
        <path d="M25 88 Q50 80 75 88 L85 100 L15 100 Z" fill="#60A5FA" />
        {
    /* Cardigan collar */
  }
        <path d="M35 88 Q50 96 65 88" fill="none" stroke="#2563EB" strokeWidth="2.5" />

        {
    /* Face */
  }
        <ellipse cx="50" cy="56" rx="22" ry="24" fill="#FBD0BE" />
        {
    /* Cheeks */
  }
        <circle cx="36" cy="62" r="5" fill="#FCA5A5" opacity="0.6" />
        <circle cx="64" cy="62" r="5" fill="#FCA5A5" opacity="0.6" />

        {
    /* Glasses frames (Brown/Red round glasses) */
  }
        <circle cx="40" cy="54" r="8.5" fill="none" stroke="#A85038" strokeWidth="2.5" />
        <circle cx="60" cy="54" r="8.5" fill="none" stroke="#A85038" strokeWidth="2.5" />
        <line x1="48.5" y1="54" x2="51.5" y2="54" stroke="#A85038" strokeWidth="2.5" />
        {
    /* Glasses side rims */
  }
        <line x1="31.5" y1="53" x2="26" y2="50" stroke="#A85038" strokeWidth="2" />
        <line x1="68.5" y1="53" x2="74" y2="50" stroke="#A85038" strokeWidth="2" />

        {
    /* Eyes behind glasses */
  }
        <circle cx="40" cy="54" r="2.5" fill="#334155" />
        <circle cx="60" cy="54" r="2.5" fill="#334155" />
        <circle cx="41" cy="53" r="0.8" fill="#FFFFFF" />
        <circle cx="61" cy="53" r="0.8" fill="#FFFFFF" />

        {
    /* Eyebrows */
  }
        <path d="M33 45 Q40 43 47 46" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <path d="M53 46 Q60 43 67 45" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

        {
    /* Nose */
  }
        <path d="M50 56 Q52 61 48 62" fill="none" stroke="#D97757" strokeWidth="2" strokeLinecap="round" />

        {
    /* Gentle Smiling Mouth */
  }
        <path d="M43 68 Q50 74 57 68" fill="none" stroke="#BE123C" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>;
};
export const RobotAvatar = ({
  size = "w-10 h-10",
  className = ""
}) => {
  return <div className={`${size} shrink-0 relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xs">
        {
    /* Antenna */
  }
        <line x1="50" y1="12" x2="50" y2="28" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="12" r="6" fill="#38BDF8" />
        <circle cx="50" cy="12" r="3" fill="#FFFFFF" />

        {
    /* Ears */
  }
        <rect x="14" y="44" width="8" height="16" rx="4" fill="#0284C7" />
        <rect x="78" y="44" width="8" height="16" rx="4" fill="#0284C7" />

        {
    /* Head */
  }
        <rect x="20" y="26" width="60" height="52" rx="18" fill="#E0F2FE" stroke="#0284C7" strokeWidth="4" />

        {
    /* Screen/Faceplate */
  }
        <rect x="28" y="34" width="44" height="34" rx="10" fill="#0F172A" />

        {
    /* Glowing Cheerful Eyes */
  }
        <circle cx="40" cy="48" r="5" fill="#38BDF8" />
        <circle cx="60" cy="48" r="5" fill="#38BDF8" />
        <circle cx="38.5" cy="46.5" r="1.5" fill="#FFFFFF" />
        <circle cx="58.5" cy="46.5" r="1.5" fill="#FFFFFF" />

        {
    /* Smiling digital mouth */
  }
        <path d="M44 58 Q50 62 56 58" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

        {
    /* Cute blush dots */
  }
        <circle cx="34" cy="56" r="2.5" fill="#F472B6" opacity="0.8" />
        <circle cx="66" cy="56" r="2.5" fill="#F472B6" opacity="0.8" />
      </svg>
    </div>;
};
export const MorningStretchGraphic = ({ className = "w-14 h-14" }) => <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {
  /* Head */
}
      <circle cx="50" cy="24" r="9" fill="#FDE047" />
      {
  /* Torso */
}
      <path d="M50 33 L50 62" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
      {
  /* Arms stretched up cheerfully */
}
      <path d="M28 20 Q40 40 50 38 Q60 40 72 20" fill="none" stroke="#FDE047" strokeWidth="6" strokeLinecap="round" />
      {
  /* Legs in steady pose */
}
      <path d="M50 62 L36 86" stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M50 62 L64 86" stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" />
      {
  /* Sun rays sparkle */
}
      <path d="M18 16 L22 22 M82 16 L78 22" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>;
export const MemoryMatchGraphic = ({ className = "w-14 h-14" }) => <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="22" y="22" width="24" height="24" rx="6" fill="#FDE047" />
      <circle cx="34" cy="34" r="5" fill="#15803D" />

      <rect x="54" y="22" width="24" height="24" rx="6" fill="#FFFFFF" />
      <path d="M62 34 L70 34 M66 30 L66 38" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />

      <rect x="22" y="54" width="24" height="24" rx="6" fill="#FFFFFF" />
      <polygon points="34,60 38,68 30,68" fill="#15803D" />

      <rect x="54" y="54" width="24" height="24" rx="6" fill="#FDE047" />
      <circle cx="66" cy="66" r="5" fill="#15803D" />
    </svg>
  </div>;
export const MeditationGraphic = ({ className = "w-14 h-14" }) => <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {
  /* Halo / Aura */
}
      <circle cx="50" cy="50" r="36" fill="#FED7AA" opacity="0.4" />
      {
  /* Head */
}
      <circle cx="50" cy="30" r="9" fill="#FEF08A" />
      {
  /* Torso */
}
      <path d="M50 39 L50 64" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
      {
  /* Crossed arms on knees with prayer/rest gesture */
}
      <path d="M28 54 Q38 46 50 48 Q62 46 72 54" fill="none" stroke="#FEF08A" strokeWidth="5.5" strokeLinecap="round" />
      {
  /* Lotus crossed legs */
}
      <path d="M24 74 Q50 82 76 74 Q50 66 24 74 Z" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="3" />
      <circle cx="28" cy="74" r="5" fill="#FEF08A" />
      <circle cx="72" cy="74" r="5" fill="#FEF08A" />
    </svg>
  </div>;
export const PatternRecallGraphic = ({ className = "w-14 h-14" }) => <div className={`${className} flex items-center justify-center`}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {
  /* Head profile silhouette in soft grey */
}
      <path
  d="M32 78 L32 64 C32 60, 26 56, 26 46 C26 32, 38 22, 54 22 C68 22, 78 32, 78 46 C78 58, 70 64, 68 70 L68 78 Z"
  fill="#94A3B8"
/>
      {
  /* Lightbulb in the center */
}
      <circle cx="52" cy="44" r="11" fill="#FACC15" />
      <path d="M48 55 L56 55 L54 60 L50 60 Z" fill="#F59E0B" />
      {
  /* Rays */
}
      <line x1="52" y1="28" x2="52" y2="24" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="36" x2="34" y2="33" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="36" x2="70" y2="33" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>;
export const CrosswordGraphic = ({ className = "w-14 h-14" }) => <div className={`${className} bg-white rounded-xl border border-slate-300 p-1 flex items-center justify-center shadow-2xs`}>
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <rect x="2" y="2" width="76" height="76" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
      {
  /* Black squares */
}
      <rect x="2" y="2" width="19" height="19" fill="#0F172A" />
      <rect x="40" y="2" width="19" height="19" fill="#0F172A" />
      <rect x="21" y="21" width="19" height="19" fill="#0F172A" />
      <rect x="59" y="40" width="19" height="19" fill="#0F172A" />
      <rect x="2" y="59" width="19" height="19" fill="#0F172A" />

      {
  /* Grid lines */
}
      <line x1="21" y1="2" x2="21" y2="78" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="40" y1="2" x2="40" y2="78" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="59" y1="2" x2="59" y2="78" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="2" y1="21" x2="78" y2="21" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="2" y1="40" x2="78" y2="40" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="2" y1="59" x2="78" y2="59" stroke="#CBD5E1" strokeWidth="1.5" />

      {
  /* Letters */
}
      <text x="30" y="16" fontSize="12" fontWeight="bold" fill="#0F172A" textAnchor="middle">C</text>
      <text x="68" y="16" fontSize="12" fontWeight="bold" fill="#0F172A" textAnchor="middle">A</text>
      <text x="50" y="35" fontSize="12" fontWeight="bold" fill="#0F172A" textAnchor="middle">R</text>
      <text x="12" y="54" fontSize="12" fontWeight="bold" fill="#0F172A" textAnchor="middle">E</text>
      <text x="30" y="54" fontSize="12" fontWeight="bold" fill="#0F172A" textAnchor="middle">A</text>
      <text x="50" y="54" fontSize="12" fontWeight="bold" fill="#0F172A" textAnchor="middle">S</text>
      <text x="50" y="73" fontSize="12" fontWeight="bold" fill="#0F172A" textAnchor="middle">Y</text>
    </svg>
  </div>;
export const SudokuGraphic = ({ className = "w-14 h-14" }) => <div className={`${className} bg-white rounded-xl border border-slate-300 p-1 flex items-center justify-center shadow-2xs`}>
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <rect x="2" y="2" width="76" height="76" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
      {
  /* 3x3 block lines */
}
      <line x1="27" y1="2" x2="27" y2="78" stroke="#0F172A" strokeWidth="2" />
      <line x1="53" y1="2" x2="53" y2="78" stroke="#0F172A" strokeWidth="2" />
      <line x1="2" y1="27" x2="78" y2="27" stroke="#0F172A" strokeWidth="2" />
      <line x1="2" y1="53" x2="78" y2="53" stroke="#0F172A" strokeWidth="2" />

      {
  /* Minor grid lines */
}
      <line x1="10" y1="2" x2="10" y2="78" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="19" y1="2" x2="19" y2="78" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="36" y1="2" x2="36" y2="78" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="44" y1="2" x2="44" y2="78" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="62" y1="2" x2="62" y2="78" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="70" y1="2" x2="70" y2="78" stroke="#E2E8F0" strokeWidth="1" />

      {
  /* Numbers */
}
      <text x="14" y="20" fontSize="10" fontWeight="bold" fill="#0284C7" textAnchor="middle">5</text>
      <text x="40" y="20" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">3</text>
      <text x="66" y="20" fontSize="10" fontWeight="bold" fill="#0284C7" textAnchor="middle">7</text>
      <text x="14" y="46" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">6</text>
      <text x="40" y="46" fontSize="10" fontWeight="bold" fill="#0284C7" textAnchor="middle">9</text>
      <text x="66" y="46" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">1</text>
      <text x="14" y="72" fontSize="10" fontWeight="bold" fill="#0284C7" textAnchor="middle">8</text>
      <text x="40" y="72" fontSize="10" fontWeight="bold" fill="#334155" textAnchor="middle">4</text>
      <text x="66" y="72" fontSize="10" fontWeight="bold" fill="#0284C7" textAnchor="middle">2</text>
    </svg>
  </div>;
export const JigsawGraphic = ({ className = "w-14 h-14" }) => <div className={`${className} bg-white rounded-xl border border-slate-300 p-1 flex items-center justify-center shadow-2xs`}>
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {
  /* Top Left - Red Piece */
}
      <path
  d="M6 6 L36 6 C36 12, 42 12, 42 6 L44 6 L44 22 C38 22, 38 28, 44 28 L44 44 L28 44 C28 38, 22 38, 22 44 L6 44 Z"
  fill="#EF4444"
/>
      {
  /* Top Right - Green Piece */
}
      <path
  d="M44 6 L74 6 L74 44 L58 44 C58 38, 52 38, 52 44 L44 44 L44 28 C38 28, 38 22, 44 22 Z"
  fill="#10B981"
/>
      {
  /* Bottom Left - Amber/Orange Piece */
}
      <path
  d="M6 44 L22 44 C22 38, 28 38, 28 44 L44 44 L44 60 C38 60, 38 66, 44 66 L44 74 L6 74 Z"
  fill="#F59E0B"
/>
      {
  /* Bottom Right - Teal/Cyan Piece */
}
      <path
  d="M44 44 L52 44 C52 38, 58 38, 58 44 L74 44 L74 74 L44 74 L44 66 C38 66, 38 60, 44 60 Z"
  fill="#06B6D4"
/>
    </svg>
  </div>;
export const BubbleGraphic = ({ className = "w-14 h-14" }) => <div className={`${className} bg-gradient-to-tr from-cyan-50 to-blue-50 rounded-xl border border-slate-300 p-1 flex items-center justify-center shadow-2xs`}>
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <circle cx="24" cy="24" r="14" fill="#38BDF8" opacity="0.9" />
      <circle cx="20" cy="20" r="4" fill="#FFFFFF" opacity="0.8" />

      <circle cx="56" cy="24" r="14" fill="#EC4899" opacity="0.9" />
      <circle cx="52" cy="20" r="4" fill="#FFFFFF" opacity="0.8" />

      <circle cx="40" cy="48" r="16" fill="#10B981" opacity="0.9" />
      <circle cx="36" cy="44" r="5" fill="#FFFFFF" opacity="0.8" />

      <circle cx="20" cy="62" r="10" fill="#F59E0B" opacity="0.8" />
      <circle cx="62" cy="60" r="11" fill="#8B5CF6" opacity="0.8" />
    </svg>
  </div>;
