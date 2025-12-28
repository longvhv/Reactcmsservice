import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ children, className = '', padding, onClick }: CardProps) {
  // Only apply default padding if not specified in className and padding prop is not provided
  const hasCustomPadding = className.includes('p-') || className.includes('px-') || className.includes('py-');
  
  const paddingClasses = padding ? {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }[padding] : (!hasCustomPadding ? 'p-6' : '');

  return (
    <div 
      className={`bg-card rounded-2xl border border-border/60 ${paddingClasses} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}