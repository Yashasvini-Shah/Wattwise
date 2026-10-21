import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass-panel p-5 relative overflow-hidden',
        hoverable && 'glass-panel-hover cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
