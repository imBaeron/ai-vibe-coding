import React from 'react';

export interface PillTagProps {
  variant?: 'mint' | 'shade' | 'outline' | 'dark' | 'pistachio' | 'status-available' | 'status-out' | 'status-low';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm';
}

export const PillTag: React.FC<PillTagProps> = ({
  variant = 'shade',
  children,
  icon,
  className = '',
  size = 'sm'
}) => {
  const sizeStyles = size === 'xs' 
    ? 'h-6 px-2.5 py-0.5 text-[11px] leading-none font-medium' 
    : 'h-7 px-3.5 py-1 text-xs leading-none font-medium';
  
  const variantStyles = {
    mint: 'bg-aloe-10 text-ink',
    pistachio: 'bg-pistachio-10 text-ink',
    shade: 'bg-shade-30 text-ink',
    outline: 'bg-transparent border border-hairline-light text-shade-60',
    dark: 'bg-canvas-night-elevated text-on-primary border border-hairline-dark',
    'status-available': 'bg-aloe-10 text-emerald-950 font-semibold',
    'status-out': 'bg-red-100 text-red-950 font-semibold',
    'status-low': 'bg-amber-100 text-amber-950 font-semibold'
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 rounded-pill uppercase tracking-wider flex-shrink-0 whitespace-nowrap ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
