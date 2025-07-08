import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const buttonVariants = {
  variant: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/20 border border-primary shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/20 border border-secondary shadow-sm hover:shadow-md',
    outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground focus:ring-ring/20 shadow-sm hover:shadow-md',
    ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-ring/20',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/20 border border-destructive shadow-sm hover:shadow-md',
    success: 'bg-success text-success-foreground hover:bg-success/90 focus:ring-success/20 border border-success shadow-sm hover:shadow-md',
    warning: 'bg-warning text-warning-foreground hover:bg-warning/90 focus:ring-warning/20 border border-warning shadow-sm hover:shadow-md',
  },
  size: {
    xs: 'h-7 px-2 text-xs',
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg',
    icon: 'h-10 w-10',
  },
};

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  children, 
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95 active:shadow-sm',
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        loading && 'cursor-not-allowed',
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 