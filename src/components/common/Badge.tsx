import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'emerald' | 'amber' | 'red' | 'cyan' | 'slate';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'cyan',
  size = 'md',
  children,
  className,
  icon,
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 glow-emerald',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30 glow-amber',
    red: 'bg-red-500/15 text-red-400 border-red-500/30 glow-red',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 glow-cyan',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
