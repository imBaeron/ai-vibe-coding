import React from 'react';

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline-light' | 'outline-dark' | 'aloe' | 'shade';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-pill transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';
  
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  }[size];

  const variantStyles = {
    primary: 'bg-primary text-on-primary hover:bg-shade-70 active:bg-shade-70',
    'outline-light': 'bg-canvas-light text-ink border border-ink hover:bg-shade-30/40 active:bg-shade-30',
    'outline-dark': 'bg-transparent text-on-primary border-2 border-on-primary hover:bg-on-primary/10 active:bg-on-primary/20',
    aloe: 'bg-aloe-10 text-ink hover:brightness-95 active:brightness-90 shadow-sm',
    shade: 'bg-shade-30 text-ink hover:bg-shade-40 active:bg-shade-50',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
