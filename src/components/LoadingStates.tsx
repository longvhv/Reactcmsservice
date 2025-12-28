import { Loader2, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Skeleton Loader Components
export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-muted/50 rounded w-24" />
        <div className="h-8 w-8 bg-muted/50 rounded-lg" />
      </div>
      <div className="h-8 bg-muted/50 rounded w-32" />
      <div className="h-3 bg-muted/50 rounded w-20" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border/40">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-muted/50 rounded flex-1 animate-pulse" />
        ))}
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 animate-pulse" style={{ animationDelay: `${i * 50}ms` }}>
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-4 bg-muted/50 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ items = 8 }: { items?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <div 
          key={i} 
          className="glass-card p-4 flex items-center gap-4 animate-pulse"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <div className="w-12 h-12 bg-muted/50 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted/50 rounded w-3/4" />
            <div className="h-3 bg-muted/50 rounded w-1/2" />
          </div>
          <div className="h-8 w-24 bg-muted/50 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2 animate-pulse" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="h-4 bg-muted/50 rounded w-32" />
          <div className="h-10 bg-muted/30 rounded-lg border border-border/40" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <div className="h-10 bg-muted/50 rounded-lg flex-1 animate-pulse" />
        <div className="h-10 bg-muted/30 rounded-lg flex-1 animate-pulse" style={{ animationDelay: '100ms' }} />
      </div>
    </div>
  );
}

// Full Page Loading
interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className="relative inline-block">
          {/* Outer ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-blue-500/20 animate-ping" />
          
          {/* Middle ring */}
          <div className="absolute inset-2 w-20 h-20 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-blue-500/20 border-l-purple-500/20 animate-spin" />
          
          {/* Inner icon */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
            <Zap className="w-10 h-10 text-blue-600 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-lg text-foreground animate-pulse">{message}</p>
          <div className="flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Loading
interface InlineLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function InlineLoading({ size = 'md', text }: InlineLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

// Button Loading State
interface ButtonLoadingProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ButtonWithLoading({
  children,
  isLoading = false,
  loadingText,
  icon,
  variant = 'primary',
  onClick,
  disabled,
  className = '',
}: ButtonLoadingProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30',
    secondary: 'bg-muted/60 hover:bg-muted border border-border/40',
    outline: 'border border-border/40 hover:bg-muted/30',
    ghost: 'hover:bg-muted/30',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center gap-2 px-4 py-2 rounded-xl
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}

// Empty State
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        {icon && (
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20" />
            <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-border/40">
              {icon}
            </div>
          </div>
        )}

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-xl text-foreground">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>

        {/* Action */}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
          >
            <Sparkles className="w-4 h-4" />
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

// Progress Bar
interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  value,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
}: ProgressBarProps) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-500',
    green: 'from-green-600 to-green-500',
    yellow: 'from-yellow-600 to-yellow-500',
    red: 'from-red-600 to-red-500',
    purple: 'from-purple-600 to-purple-500',
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && <span className="text-foreground">{Math.round(clampedValue)}%</span>}
        </div>
      )}
      
      <div className={`w-full bg-muted/30 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

// Spinner variants
export function SpinnerDots() {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

export function SpinnerBars() {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="w-1 h-8 bg-gradient-to-t from-blue-600 to-purple-600 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 100}ms`, animationDuration: '1s' }}
        />
      ))}
    </div>
  );
}