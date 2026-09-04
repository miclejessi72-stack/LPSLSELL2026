import React from 'react';

interface LimburgLogoProps {
  className?: string;
  height?: number | string;
  showTagline?: boolean;
}

export const LimburgLogo: React.FC<LimburgLogoProps> = ({
  className = '',
  height = 48,
  showTagline = false,
}) => {
  return (
    <div className={`inline-flex flex-col select-none ${className}`} id="limburg-power-logo">
      <svg
        viewBox="0 0 520 160"
        height={height}
        style={{ width: 'auto', maxHeight: height }}
        className="w-auto drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradient for crisp industrial depth */}
          <linearGradient id="lpRedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8d1520" />
            <stop offset="50%" stopColor="#a31d2a" />
            <stop offset="100%" stopColor="#921722" />
          </linearGradient>
        </defs>

        {/* Outer Red Outline Border surrounding the entire logo badge */}
        <rect
          x="3"
          y="3"
          width="514"
          height="154"
          rx="4"
          fill="none"
          stroke="#9e1b27"
          strokeWidth="6"
        />

        {/* LEFT EMBLEM BLOCK (Black Background) */}
        <g id="logo-emblem-left">
          <rect x="6" y="6" width="160" height="148" fill="#09090b" />

          {/* Stylized White 'L' & Chevron Shape */}
          <path
            d="M 68 18 
               L 42 54 
               L 42 98 
               L 112 98 
               C 134 98 144 86 144 70 
               C 144 54 132 44 114 44 
               L 92 44 
               L 80 60 
               L 108 60 
               C 118 60 124 64 124 70 
               C 124 76 118 80 108 80 
               L 62 80 
               L 62 60 
               L 82 32 
               Z"
            fill="#ffffff"
          />

          {/* Lower White Downward Triangle Accent */}
          <polygon
            points="60,110 104,110 82,142"
            fill="#ffffff"
          />
        </g>

        {/* RIGHT TEXT BLOCK */}
        <g id="logo-text-right">
          {/* Top Half: White Box with LIMBURG */}
          <rect x="166" y="6" width="348" height="74" fill="#ffffff" />
          
          {/* LIMBURG text */}
          <g transform="translate(180, 58)">
            <text
              fontFamily="'Chakra Petch', 'Plus Jakarta Sans', system-ui, sans-serif"
              fontSize="48"
              fontWeight="800"
              letterSpacing="2.5"
              fill="#09090b"
            >
              LIMB
            </text>
            
            {/* Custom stylized 'U' with red wedge notch */}
            <g transform="translate(142, -37)">
              {/* Main U body in black */}
              <path
                d="M 0 0 L 12 0 L 12 24 C 12 34 18 38 27 38 C 36 38 42 34 42 24 L 42 0 L 54 0 L 54 24 C 54 42 42 48 27 48 C 12 48 0 42 0 24 Z"
                fill="#09090b"
              />
              {/* Red flame notch inside right bar */}
              <polygon
                points="42,16 54,4 54,26"
                fill="#9e1b27"
              />
            </g>

            {/* RG text */}
            <text
              x="204"
              y="0"
              fontFamily="'Chakra Petch', 'Plus Jakarta Sans', system-ui, sans-serif"
              fontSize="48"
              fontWeight="800"
              letterSpacing="2.5"
              fill="#09090b"
            >
              RG
            </text>

            {/* Red top corner mark on the G */}
            <polygon
              points="288,-36 308,-36 308,-20"
              fill="#9e1b27"
            />
          </g>

          {/* Red divider strip */}
          <rect x="166" y="78" width="348" height="4" fill="#9e1b27" />

          {/* Bottom Half: Red Box with POWER */}
          <rect x="166" y="80" width="348" height="74" fill="url(#lpRedGrad)" />

          {/* P O W E R text in white with lightning bolt O */}
          <g transform="translate(182, 133)">
            {/* P */}
            <text
              x="0"
              y="0"
              fontFamily="'Chakra Petch', 'Plus Jakarta Sans', system-ui, sans-serif"
              fontSize="44"
              fontWeight="800"
              letterSpacing="3"
              fill="#ffffff"
            >
              P
            </text>

            {/* Stylized 'O' Circle with Lightning Bolt */}
            <g transform="translate(76, -16)">
              {/* Circle border */}
              <circle
                cx="0"
                cy="0"
                r="19"
                fill="none"
                stroke="#ffffff"
                strokeWidth="4"
              />
              {/* Lightning Bolt */}
              <path
                d="M 2 -13 L -9 0 L -1 0 L -3 13 L 9 -1 L 1 -1 Z"
                fill="#ffffff"
              />
            </g>

            {/* W E R */}
            <text
              x="116"
              y="0"
              fontFamily="'Chakra Petch', 'Plus Jakarta Sans', system-ui, sans-serif"
              fontSize="44"
              fontWeight="800"
              letterSpacing="7"
              fill="#ffffff"
            >
              WER
            </text>
          </g>
        </g>
      </svg>

      {showTagline && (
        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9e1b27]"></span>
          <span>CHP & Gas Engine Spare Parts</span>
        </div>
      )}
    </div>
  );
};

export default LimburgLogo;
