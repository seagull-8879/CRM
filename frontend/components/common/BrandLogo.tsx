import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showSubtitle = true,
}) => {
  // Height mappings based on size
  const heightClass = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-11',
    xl: 'h-14',
  }[size];

  if (variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <svg
          viewBox="0 0 100 100"
          className={heightClass}
          style={{ aspectRatio: '1/1' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="iconPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B24D6" />
              <stop offset="40%" stopColor="#581498" />
              <stop offset="100%" stopColor="#350960" />
            </linearGradient>
            <linearGradient id="iconBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="45%" stopColor="#122E94" />
              <stop offset="100%" stopColor="#0A1856" />
            </linearGradient>
          </defs>
          <g transform="translate(6, 6) scale(0.88)">
            {/* Left Purple Peak */}
            <path
              d="M 12,68 L 48,10 C 51,6 56,6 59,9 C 68,17 73,28 70,42 C 67,54 55,66 42,75 L 12,68 Z"
              fill="url(#iconPurpleGrad)"
            />
            {/* Right Royal Blue Wave */}
            <path
              d="M 40,42 C 54,28 72,20 88,14 C 95,11 103,12 106,18 C 109,26 104,36 96,44 C 88,52 74,58 64,64 C 52,71 38,76 26,78 C 22,78 19,74 21,70 C 24,62 30,50 40,42 Z"
              fill="url(#iconBlueGrad)"
            />
            {/* Accent Droplet */}
            <path
              d="M 103,24 C 107,26 110,31 109,36 C 107,41 102,42 99,38 C 98,34 98,28 103,24 Z"
              fill="url(#iconBlueGrad)"
            />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      {/* Dynamic TheMaverics SVG Vector */}
      <svg
        viewBox="0 0 340 105"
        className={`${heightClass} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="brandPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B24D6" />
            <stop offset="35%" stopColor="#581498" />
            <stop offset="100%" stopColor="#350960" />
          </linearGradient>

          <linearGradient id="brandBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="40%" stopColor="#122E94" />
            <stop offset="85%" stopColor="#0E2374" />
            <stop offset="100%" stopColor="#071038" />
          </linearGradient>

          <linearGradient id="brandTextPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6E1DB8" />
            <stop offset="100%" stopColor="#581498" />
          </linearGradient>

          <linearGradient id="brandTextBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#183EB5" />
            <stop offset="100%" stopColor="#122E94" />
          </linearGradient>
        </defs>

        {/* M Emblem */}
        <g transform="translate(100, 2) scale(0.68)">
          <path
            d="M 28,68 L 74,4 C 77,1 81,1 84,3 C 94,10 102,23 99,38 C 96,53 82,67 68,76 L 28,68 Z"
            fill="url(#brandPurpleGrad)"
          />
          <path
            d="M 66,38 C 82,24 104,18 126,8 C 138,2 152,0 162,10 C 172,21 168,36 156,48 C 146,59 130,66 116,74 C 98,84 80,90 60,92 C 54,92 50,88 52,82 C 56,70 66,54 74,44 C 82,34 94,26 94,26 L 66,38 Z"
            fill="url(#brandBlueGrad)"
          />
          <path
            d="M 172,22 C 178,25 184,33 182,41 C 180,48 172,50 168,44 C 166,38 166,30 172,22 Z"
            fill="url(#brandBlueGrad)"
          />
        </g>

        {/* "The" */}
        <text
          x="4"
          y="78"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="36"
          fontWeight="800"
          letterSpacing="-0.5"
          fill="url(#brandTextPurple)"
        >
          The
        </text>

        {/* "Maverics" */}
        <text
          x="78"
          y="78"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="36"
          fontWeight="800"
          letterSpacing="-0.5"
          fill="url(#brandTextBlue)"
        >
          Maverics
        </text>

        {/* Subtitle */}
        {showSubtitle && (
          <text
            x="76"
            y="98"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="10.5"
            fontWeight="700"
            letterSpacing="3.2"
            fill="#64748B"
            className="dark:fill-slate-400 fill-slate-500"
          >
            TECHNOLOGIES PVT. LTD.
          </text>
        )}
      </svg>
    </div>
  );
};
