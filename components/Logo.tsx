import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'mark';
  theme?: 'gold' | 'white' | 'dark';
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  variant = 'full',
  theme = 'gold',
  height = 'auto',
}) => {
  const colors = {
    gold: {
      primary: 'url(#gold-gradient)',
      text: '#D4AF37',
      subtext: '#D4AF37',
    },
    white: {
      primary: '#FFFFFF',
      text: '#FFFFFF',
      subtext: '#A0A0A0',
    },
    dark: {
      primary: '#000000',
      text: '#000000',
      subtext: '#333333',
    },
  }[theme];

  return (
    <div className={cn('inline-flex items-center gap-3', className)} style={{ height }}>
      <svg
        viewBox="0 0 160 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="ERANTT TRANSIT Logo"
      >
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* Road Arch Mark */}
        <path
          d="M10 40C10 40 40 10 80 10C120 10 150 40 150 40H140C140 40 115 18 80 18C45 18 20 40 20 40H10Z"
          fill={colors.primary}
        />
        
        {/* Road Dashes */}
        <path
          d="M40 25H50M75 22H85M110 25H120"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* ERANTT Main Text */}
        {(variant === 'full' || variant === 'compact') && (
          <text
            x="80"
            y="48"
            textAnchor="middle"
            style={{
              fontFamily: 'var(--font-display), serif',
              fontWeight: 800,
              fontSize: '24px',
              letterSpacing: '0.1em',
              fill: colors.text,
            }}
            transform="translate(-40, 0)"
          >
            ERANTT
          </text>
        )}

        {/* TRANSIT Subtext */}
        {variant === 'full' && (
          <>
            <line x1="10" y1="56" x2="45" y2="56" stroke={colors.subtext} strokeWidth="0.5" />
            <text
              x="80"
              y="58"
              textAnchor="middle"
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 600,
                fontSize: '8px',
                letterSpacing: '0.4em',
                fill: colors.subtext,
                textTransform: 'uppercase',
              }}
            >
              TRANSIT
            </text>
            <line x1="115" y1="56" x2="150" y2="56" stroke={colors.subtext} strokeWidth="0.5" />
          </>
        )}
      </svg>
    </div>
  );
};
