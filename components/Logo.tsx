import React from 'react';
import Image from 'next/image';
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
  return (
    <div className={cn('relative flex items-center justify-start', className)}>
      <Image
        src="/logo.png"
        alt="xtier Logo"
        width={500}
        height={180}
        className="object-contain w-auto h-full"
        priority
      />
    </div>
  );
};
