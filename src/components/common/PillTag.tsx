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
  const sizeStyles = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';
  
  const variantStyles = {
    mint: 'bg-aloe-10 text-ink font-medium',
    pistachio: 'bg-pistachio-10 text-ink font-medium',
    shade: 'bg-shade-30 text-ink font-medium',
    outline: 'bg-transparent border border-hairline-light text-shade-60 font-normal',
    dark: 'bg-canvas-night-elevated text-on-primary border border-hairline-dark font-medium',
    'status-available': 'bg-aloe-10 text-emerald-900 font-medium',
    'status-out': 'bg-red-100 text-red-900 font-medium',
    'status-low': 'bg-amber-100 text-amber-900 font-medium'
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill uppercase tracking-wider ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
